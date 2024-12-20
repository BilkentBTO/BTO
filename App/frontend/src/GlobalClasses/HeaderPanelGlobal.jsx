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
      <h1 className="headerPanelGlobalTitle">{name}</h1>
    </header>
  );
}
export default HeaderPanelGlobal;
