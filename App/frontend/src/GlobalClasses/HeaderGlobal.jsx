import bilkentLogo from "../assets/bilkent_logo.png";
import "./HeaderGlobal.css";

function HeaderGlobal({ name }) {
  return (
    <header className="header">
      <div className="container">
        <div className="headerText">
          <img src={bilkentLogo} alt="Bilkent Logo" className="logo" />
          <div>
            <h1>Bilkent University</h1>
            <h2>Promotion Office</h2>
          </div>
        </div>
        <div className="title">
          <h1>{name}</h1>
        </div>
      </div>
    </header>
  );
}
export default HeaderGlobal;
