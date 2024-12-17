import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainButton.css";

function MainButton({ name, link }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <button className="mainButton" onClick={handleNavigation}>
      {name}
    </button>
  );
}

export default MainButton;
