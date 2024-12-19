import MainButton from "./MainButton";
import logo from "../assets/bilkent_logo.png";
import "./MainHeader.css";

function MainHeader() {
  return (
    <header className="mainHeader">
      <div className="mainHeaderTextSection">
        <img src={logo} alt="Bilkent Logo" className="bilkentLogo" />
        <div>
          <h1>Bilkent University</h1>
          <h2>Information Office</h2>
        </div>
      </div>
      <div className="mainHeaderButtonSection">
        <MainButton name="Invite Bilkent to Fairs" link="/inviteBilkent" />
        <MainButton name="Join Information Office" link="/joinBTO" />
        <MainButton name="BTO Login" link="/login" />
      </div>
    </header>
  );
}
export default MainHeader;
