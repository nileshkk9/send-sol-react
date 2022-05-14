import { FC, useEffect, useState } from "react";
import Navbar from "./Navbar";
import SendLamport from "./SendLamport";
import "../App.css";

const Content: FC = () => {
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
        if (prevImage === 9) return 1;
        return prevImage + 1;
      });
    }, 1500);
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
        <div className="card col-md-4 mycard" style={{ width: "400px" }}>
          <img
            className="card-img-top mycard"
            src={`/assets/images/${image}.png`}
            alt="Card image"
          />
          <div className="card-body text-center">
            <h4 className="card-title">Mint Here MF!!!</h4>
            <div className="btn-group" role="group">
              <button className="btn btn-danger " onClick={handleDecrement}>
                -
              </button>
              <input type="text" value={nftCount} className="text-center mint-count" />
              <button className="btn btn-success" onClick={handleIncrement}>
                +
              </button>
            </div>
            <p className="card-text">Some example text.</p>
           <SendLamport/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
