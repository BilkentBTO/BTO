import React from "react";
import { useNavigate } from "react-router-dom";

function MainButton({ name, link }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <button onClick={handleNavigation} className="mainButton">
      {name}
    </button>
  );
}

export default MainButton;
