import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC } from "react";
import SendLamport from "./SendLamport";

const Content: FC = () => {
    
    return (
      <div className="App">
        <WalletMultiButton />
        <div className="app-body">
          <div className="app-body-top">
            <h3>Send Money on Solana</h3>
            <SendLamport/>
          </div>
        </div>
      </div>

    );
  };

  
  export default Content;