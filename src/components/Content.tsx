import { FC } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import { Exploit } from "./Exploit";
import { useWallet } from "@solana/wallet-adapter-react";

const Content: FC = () => {
  const { wallet } = useWallet();
  return (
    <div>
      <WalletMultiButton />
      {wallet && <WalletDisconnectButton />}
      <Exploit />
    </div>
  );
};

export default Content;
