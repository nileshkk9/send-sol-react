import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { FC } from "react";

const SendLamport: FC<{ count: Number }> = (props) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const transferSol = async () => {
    const recieverWallet = new PublicKey(
      // @ts-ignore
      process.env.REACT_APP_RECEIVER_WALLET
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

  return (
    <button onClick={transferSol} className="btn-11" disabled={!publicKey}>
      Mint
    </button>
  );
};

export default SendLamport;
