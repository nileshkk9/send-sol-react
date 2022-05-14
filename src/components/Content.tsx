import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FC, useEffect, useState } from "react";
import SendLamport from "./SendLamport";

const Content: FC = () => {
  const [image, setImage] = useState(1);

  const changeImage = () => {
    console.log(image);

    if (image < 9) {
      setImage(image + 1);
    } else {
      setImage(1);
    }
  };
  useEffect(() => {
    const interval = setInterval(changeImage, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Reptilian Renegade
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Discord
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Twitter
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Connect
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="app-body">
        <WalletMultiButton />
        <div className="app-body-top col-md-4 col-md-offset-4">
          <div className="g-4 text-center ">
            {/* row-cols-1 row-cols-md-3 */}
            <div className="col">
              <div className="card">
                <img
                  src={`/assets/images/${image}.png`}
                  className="card-img-top"
                  alt="sp1"
                />
                <div className="card-body">
                  <h5 className="card-title">Send Money on Solana</h5>
                  <p className="card-text">
                    <SendLamport />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col d-flex justify-content-center">
        <div
          className="card col-md-4"
          // style={{ width: "300px" }}
        >
          <img
            className="card-img-top"
            src={`/assets/images/${image}.png`}
            alt="Card image"
          />
          <div className="card-body">
            <h4 className="card-title">John Doe</h4>
            <p className="card-text">Some example text.</p>
            <a href="#" className="btn btn-primary">
              See Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
