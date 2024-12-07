import bilkentLogo from "../assets/bilkent_logo.png";
import profileImage from "../assets/profile_image.png";
import "./HeaderPanelGlobal.css";

function HeaderPanelGlobal({ name }) {
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
        <button className="profileButton">
          <img src={profileImage} alt="Profile Image" className="profile" />
        </button>
      </div>
    </header>
  );
}
export default HeaderPanelGlobal;
