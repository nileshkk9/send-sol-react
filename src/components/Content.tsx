import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Idl } from "../utils/Idl";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

import { Program, Provider, web3, BN } from "@project-serum/anchor";

const Content: FC = () => {
  const wallet = useAnchorWallet();
  const baseAccount = web3.Keypair.generate();


  const getProvider = () => {
    if (!wallet) {
      return null;
    }

    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    const provider = new Provider(connection, wallet, {
      preflightCommitment: "processed",
    });
    return provider;
  };

  const createCounter = async () => {
    const provider = getProvider();
    if (!provider) {
      throw "provider is null";
    }

    // create the program interface combining the idl, program ID, and provider
    const program = new Program(Idl as any, Idl.metadata.address, provider);

    try {
      await program.rpc.initialize(new BN(10),{
        accounts: {
          myAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.myAccount.fetch(
        baseAccount.publicKey
      );
      console.log(account);
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const increment = async () => {
    const provider = getProvider();
    if (!provider) {
      throw "provider is null";
    }

    // create the program interface combining the idl, program ID, and provider
    const program = new Program(Idl as any, Idl.metadata.address, provider);

    try {
      await program.rpc.increment({
        accounts: {
          myAccount: baseAccount.publicKey,
        },
      });

      const account = await program.account.myAccount.fetch(
        baseAccount.publicKey
      );
      console.log(account.data.toString());
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const decrement = async () => {
    const provider = getProvider();
    if (!provider) {
      throw "provider is null";
    }

    // create the program interface combining the idl, program ID, and provider
    const program = new Program(Idl as any, Idl.metadata.address, provider);

    try {
      await program.rpc.decrement({
        accounts: {
          myAccount: baseAccount.publicKey,
        },
      });

      const account = await program.account.myAccount.fetch(
        baseAccount.publicKey
      );
      console.log(account.data.toString());
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  const update = async () => {
    const provider = getProvider();
    if (!provider) {
      throw "provider is null";
    }

    // create the program interface combining the idl, program ID, and provider
    const program = new Program(Idl as any, Idl.metadata.address, provider);

    try {
      await program.rpc.update(new BN(5), {
        accounts: {
          myAccount: baseAccount.publicKey,
        },
      });

      const account = await program.account.myAccount.fetch(
        baseAccount.publicKey
      );
      console.log(account.data.toString());
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  };

  return (
    <div>
      <button onClick={createCounter}>Initialize</button>
      <button onClick={update}>update</button>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>

      <WalletMultiButton />
    </div>
  );
};

export default Content;
