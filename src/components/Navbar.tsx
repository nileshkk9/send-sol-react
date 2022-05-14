import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mynav">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Reptilian</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
            </ul>
            <div className="d-flex">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </nav>)
}

export default Navbar