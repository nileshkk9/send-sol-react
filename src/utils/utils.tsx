import {
    Account,
    Commitment,
    Connection,
    RpcResponseAndContext,
    SimulatedTransactionResponse,
    Transaction,
    TransactionSignature,
  } from '@solana/web3.js';
  
  import { WalletContextState } from '@solana/wallet-adapter-react';
  
  export const getUnixTs = () => new Date().getTime() / 1000;
  
  const DEFAULT_TIMEOUT = 15000;
  
  async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export async function sendTransaction({
    transaction,
    wallet,
    signers = [],
    connection,
    sendingMessage = 'Sending transaction...',
    sentMessage = 'Transaction sent',
    successMessage = 'Transaction confirmed',
    timeout = DEFAULT_TIMEOUT,
    sendNotification = true,
  }: {
    transaction: Transaction;
    wallet: WalletContextState;
    signers?: Array<Account>;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
    sendNotification?: boolean;
  }) {
    const signedTransaction = await signTransaction({
      transaction,
      wallet,
      signers,
      connection,
    });
  
    if (!signedTransaction) return;
  
    return sendSignedTransaction({
      signedTransaction,
      connection,
      sendingMessage,
      sentMessage,
      successMessage,
      timeout,
      sendNotification,
    });
  }
  
  export async function signTransaction({
    transaction,
    wallet,
    signers = [],
    connection,
  }: {
    transaction: Transaction;
    wallet: WalletContextState;
    signers?: Array<Account>;
    connection: Connection;
  }) {
    if (!wallet.publicKey || wallet.publicKey === null) return;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash('max')
    ).blockhash;
    transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
  
    return await wallet.signTransaction?.(transaction);
  }
  
  export async function signTransactions({
    transactionsAndSigners,
    wallet,
    connection,
  }: {
    transactionsAndSigners: {
      transaction: Transaction;
      signers?: Array<Account>;
    }[];
    wallet: WalletContextState;
    connection: Connection;
  }) {
    if (!wallet.publicKey || wallet.publicKey === null) return;
    const { blockhash } = await connection.getRecentBlockhash('max');
    transactionsAndSigners.forEach(({ transaction, signers = [] }) => {
      transaction.recentBlockhash = blockhash;
      if (!wallet.publicKey || wallet.publicKey === null) return;
  
      transaction.setSigners(
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      );
      if (signers?.length > 0) {
        transaction.partialSign(...signers);
      }
    });
    return await wallet.signAllTransactions?.(
      transactionsAndSigners.map(({ transaction }) => transaction)
    );
  }
  
  export async function sendSignedTransaction({
    signedTransaction,
    connection,
    sendingMessage = 'Sending transaction...',
    sentMessage = 'Transaction sent',
    successMessage = 'Transaction confirmed',
    timeout = DEFAULT_TIMEOUT,
    sendNotification = true,
  }: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
    sendNotification?: boolean;
  }): Promise<string> {
    const rawTransaction = signedTransaction.serialize();
    const startTime = getUnixTs();
    /*  if (sendNotification) {
        notify({ message: sendingMessage });
      }*/
    const txid: TransactionSignature = await connection.sendRawTransaction(
      rawTransaction,
      {
        skipPreflight: true,
      }
    );
    /*  if (sendNotification) {
        notify({ message: sentMessage, type: 'success', txid });
      }*/
  
    console.log('Started awaiting confirmation for', txid);
  
    let done = false;
    (async () => {
      while (!done && getUnixTs() - startTime < timeout) {
        connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
        });
        await sleep(300);
      }
    })();
    try {
      await awaitTransactionSignatureConfirmation(txid, timeout, connection);
    } catch (err: any) {
      if (err && err.timeout) {
        throw new Error('Timed out awaiting confirmation on transaction');
      }
      console.log(err)
      let simulateResult: SimulatedTransactionResponse | null = null;
      try {
        simulateResult = (
          await simulateTransaction(connection, signedTransaction, 'single')
        ).value;
      } catch (e) { }
      if (simulateResult && simulateResult.err) {
        if (simulateResult.logs) {
          for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
            const line = simulateResult.logs[i];
            if (line.startsWith('Program log: ')) {
              throw new Error(
                `Transaction failed: ${line.slice('Program log: '.length)}`
              );
            }
          }
        }
        const parsedError = JSON.stringify(simulateResult.err);
        throw new Error(parsedError);
      }
      throw new Error('Transaction failed');
    } finally {
      done = true;
    }
    /*  if (sendNotification) {
        notify({ message: successMessage, type: 'success', txid });
      }*/
  
    console.log('Latency', txid, getUnixTs() - startTime);
    return txid;
  }
  
  async function awaitTransactionSignatureConfirmation(
    txid: TransactionSignature,
    timeout: number,
    connection: Connection
  ) {
    let done = false;
    const result = await new Promise((resolve, reject) => {
      (async () => {
        setTimeout(() => {
          if (done) {
            return;
          }
          done = true;
          console.log('Timed out for txid', txid);
          reject({ timeout: true });
        }, timeout);
        try {
          connection.onSignature(
            txid,
            (result) => {
              console.log('WS confirmed', txid, result);
              done = true;
              if (result.err) {
                reject(result.err);
              } else {
                resolve(result);
              }
            },
            'recent'
          );
          console.log('Set up WS connection', txid);
        } catch (e) {
          done = true;
          console.log('WS error in setup', txid, e);
        }
        while (!done) {
          // eslint-disable-next-line no-loop-func
          (async () => {
            try {
              const signatureStatuses = await connection.getSignatureStatuses([
                txid,
              ]);
              const result = signatureStatuses && signatureStatuses.value[0];
              if (!done) {
                if (!result) {
                  console.log('REST null result for', txid, result);
                } else if (result.err) {
                  console.log('REST error for', txid, result);
                  done = true;
                  reject(result.err);
                } else if (!result.confirmations) {
                  console.log('REST no confirmations for', txid, result);
                } else {
                  console.log('REST confirmation for', txid, result);
                  done = true;
                  resolve(result);
                }
              }
            } catch (e) {
              if (!done) {
                console.log('REST connection error: txid', txid, e);
              }
            }
          })();
          await sleep(300);
        }
      })();
    });
    done = true;
    return result;
  }
  
  export function mergeTransactions(transactions: (Transaction | undefined)[]) {
    const transaction = new Transaction();
    transactions
      .filter((t): t is Transaction => t !== undefined)
      .forEach((t) => {
        transaction.add(t);
      });
    return transaction;
  }
  
  /** Copy of Connection.simulateTransaction that takes a commitment parameter. */
  async function simulateTransaction(
    connection: Connection,
    transaction: Transaction,
    commitment: Commitment
  ): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
      // @ts-ignore
      connection._disableBlockhashCaching
    );
  
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString('base64');
    const config: any = { encoding: 'base64', commitment };
    const args = [encodedTransaction, config];
  
    // @ts-ignore
    const res = await connection._rpcRequest('simulateTransaction', args);
    if (res.error) {
      throw new Error(`failed to simulate transaction: ${res.error.message}`);
    }
    return res.result;
  }