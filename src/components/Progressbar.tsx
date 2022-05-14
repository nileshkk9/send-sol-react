import { useEffect, useState } from "react";

const ProgressBar = () => {
  const [minted, setMinted] = useState(25);

  const minting = () => {
    setMinted((prevMint) => {
      localStorage.setItem("mintedCount", (prevMint + 5).toString());

      return prevMint + 5;
    });
  };
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
    <div className="mt-3">
      <div className="progress" style={{ height:30 }}>
        <div
          className="progress-bar bg-success progress-bar-striped"
          style={{ width: minted, height:30 }}
        >
          {minted}/4000 minted
        </div>
      </div>
    </div>
  );
};
export default ProgressBar;
