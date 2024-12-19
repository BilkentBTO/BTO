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
    <header className="headerPanelGlobal">
      <div className="headerPanelGlobalText">
        <img src={bilkentLogo} alt="Bilkent Logo" className="bilkentLogo" />
        <div>
          <h1>Bilkent University</h1>
          <h2>Information Office</h2>
        </div>
      </div>
      <h1 className="headerPanelGlobalTitle">{name}</h1>
      <button className="profileButton" onClick={handleProfileClick}>
        <img src={profileImage} alt="Profile Image" className="profile" />
      </button>
    </header>
  );
}
export default HeaderPanelGlobal;
