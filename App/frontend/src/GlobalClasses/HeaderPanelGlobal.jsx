import bilkentLogo from "../assets/bilkent_logo.png";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";

import "./HeaderPanelGlobal.css";

function HeaderPanelGlobal({ name }) {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    console.log("Profile button clicked!");
    navigate("/userPage"); // Navigate to the root page
  };

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
        <button className="profileButton" onClick={handleProfileClick}>
          <img src={profileImage} alt="Profile Image" className="profile" />
        </button>
      </div>
    </header>
  );
}
export default HeaderPanelGlobal;
