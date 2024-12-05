import MainButton from "./MainButton";
import logo from "../assets/bilkent_logo.png";
import "./MainHeader.css";

function MainHeader() {
  return (
    <header className="mainHeader">
      <div className="container">
        <div className="textSection">
          <img src={logo} alt="Bilkent Logo" className="logo" />
          <div>
            <h1>Bilkent University</h1>
            <h2>Promotion Office</h2>
          </div>
        </div>
        <div className="buttonSection">
          <MainButton name="Invite Bilkent to Fairs" link="/inviteBilkent" />
          <MainButton name="Join Promotion Office" link="/joinBTO" />
          <MainButton name="BTO Login" link="/login" />
        </div>
      </div>
    </header>
  );
}
export default MainHeader;
