import { FC, useEffect, useState } from "react";
import Navbar from "./Navbar";
import SendLamport from "./SendLamport";
import "../App.css";
import ProgressBar from "./Progressbar";
import Footer from "./Footer";

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
        <div className="card mycard bg-dark" style={{ width: "400px" }}>
          <img
            className="card-img-top mycard"
            src={`/assets/images/${image}.png`}
            alt="Card image"
          />
          <div className="card-body text-center">
            <h5 className="card-title">WL Mint Phase 1</h5>
            <div className="btn-group mt-2" role="group">
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

            <p className="card-text mt-3">1 Mint = 1 SOL</p>
            <SendLamport count={nftCount} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Content;
