import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainRegButton.css";

function MainRegButton({ name, link }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <button className="mainRegButton" onClick={handleNavigation}>
      {name}
    </button>
  );
}
export default MainRegButton;
