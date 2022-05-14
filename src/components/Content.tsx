import { FC, useEffect, useState } from "react";
import Navbar from "./Navbar";
import SendLamport from "./SendLamport";
import "../App.css";
import ProgressBar from "./Progressbar";

const Content: FC = () => {
  const IMAGE_COUNT = 14;
  const IMAGE_CHANGE_WAIT = 1500;
  const [image, setImage] = useState(1);
  const [nftCount, setNftCount] = useState(1);

  const handleIncrement = () => {
    if (nftCount < 5) {
      setNftCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (nftCount > 1) {
      setNftCount((prev) => prev - 1);
    }
  };
  const changeImage = () => {
    const interval = setInterval(() => {
      setImage((prevImage) => {
        if (prevImage === IMAGE_COUNT) return 1;
        return prevImage + 1;
      });
    }, IMAGE_CHANGE_WAIT);
    return interval;
  };

  useEffect(() => {
    const interval = changeImage();
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <Navbar />
      {/* <div className="app-body">
        <WalletMultiButton />
      </div> */}
      <div className="col d-flex justify-content-center mt-5 ">
        <div className="card mycard" style={{ width: "400px" }}>
          <img
            className="card-img-top mycard"
            src={`/assets/images/${image}.png`}
            alt="Card image"
          />
          <div className="card-body text-center">
            <h4 className="card-title">WL Mint Phase 1</h4>
            <div className="btn-group" role="group">
              <button className="btn btn-danger " onClick={handleDecrement}>
                -
              </button>
              <input
                type="text"
                value={nftCount}
                className="text-center mint-count"
              />
              <button className="btn btn-success" onClick={handleIncrement}>
                +
              </button>
            </div>
            <ProgressBar/>
            {/* TODO: mint price/ nft */}
            <p className="card-text">Some example text.</p>
            <SendLamport count={nftCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
