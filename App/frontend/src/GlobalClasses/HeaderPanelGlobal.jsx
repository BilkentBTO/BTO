import bilkentLogo from "../assets/bilkent_logo.png";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";

import "./HeaderPanelGlobal.css";

function HeaderPanelGlobal({ name }) {
  const navigate = useNavigate();

  const uppercase = (text) => {
    return text.toUpperCase();
  };

  const handleProfileClick = () => {
    console.log("Profile button clicked!");
    navigate("/userPage");
  };

  return (
    <header className="headerPanelGlobal">
      <h1 className="headerPanelGlobalTitle">{uppercase(name)}</h1>
    </header>
  );
}

export default HeaderPanelGlobal;
