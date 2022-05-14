import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { FC, useCallback } from "react";

const SendLamport: FC<{ count: Number }> = (props) => {
    
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const transferSol = async () => {
    const recieverWallet = new PublicKey(
      "92MShDuWbTtjoDrp5t3RJLzHaEsnXj8k7kA2vbvUSSsk"
    );
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        // @ts-ignore
        fromPubkey: publicKey,
        toPubkey: recieverWallet,
        // @ts-ignore
        lamports: LAMPORTS_PER_SOL * props.count,
      })
    );
    // @ts-ignore
    transaction.feePayer = await publicKey;
    let blockhashObj = await connection.getLatestBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;
    // @ts-ignore
    let signed = await signTransaction(transaction);
    // The signature is generated
    let signature = await connection.sendRawTransaction(signed.serialize());
    // Confirm whether the transaction went through or not
    await connection.confirmTransaction(signature);
  };

  // const onClick = useCallback(async () => {
  //     if (!publicKey) throw new WalletNotConnectedError();
  //     const transaction = new Transaction().add(
  //         SystemProgram.transfer({
  //             fromPubkey: publicKey,
  //             toPubkey: new PublicKey("35sy8KpwfV65QMQAdLDLk1AATVH6HdQeGiGAe4zHsTnW"),
  //             lamports: 100

  //         })
  //     );
  //     const signature = await sendTransaction(transaction, connection);
  //     await connection.confirmTransaction(signature, "confirmed");
  // }, [publicKey, sendTransaction, connection])
  return (
    <button onClick={transferSol} className="btn-11" disabled={!publicKey}>
      Mint
    </button>
  );
};

export default SendLamport;
