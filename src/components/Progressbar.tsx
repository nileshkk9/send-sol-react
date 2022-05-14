import { useEffect, useState } from "react";

const ProgressBar = () => {
  const [minted, setMinted] = useState(25);
    const TOTAL_MINT = 4000;
  const minting = () => {
    setMinted((prevMint) => {
        const ran = generateRandom(25,100)
      localStorage.setItem("mintedCount", (prevMint + ran).toString());
      return prevMint + ran;
    });
  };

  const generateRandom=(min = 0, max = 100)=> {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}
  useEffect(() => {
      if(localStorage.getItem("mintedCount")){
          setMinted(Number(localStorage.getItem("mintedCount")))
      }
    const mintInterval = setInterval(minting, 2000);
    return () => {
      clearInterval(mintInterval);
    };
  }, []);
  return (
    <div className="mt-4">
      <div className="progress">
        <div
          className="progress-bar bg-success progress-bar-striped"
          style={{ width: minted/10 }}
        >
            {minted>=TOTAL_MINT?"Mint Completed":`${minted}/${TOTAL_MINT} minted`}
          
        </div>
      </div>
    </div>
  );
};
export default ProgressBar;
