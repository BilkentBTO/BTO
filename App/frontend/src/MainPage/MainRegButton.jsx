import React from "react";
import { useNavigate } from "react-router-dom";

function MainRegButton({ name, link }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <button onClick={handleNavigation} className="mainRegButton">
      {name}
    </button>
  );
}
export default MainRegButton;
