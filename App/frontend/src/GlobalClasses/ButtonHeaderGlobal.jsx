import React from "react";
import { useNavigate } from "react-router-dom";
import "./ButtonHeaderGlobal.css";

function ButtonHeaderGlobal({ name, link }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <button onClick={handleNavigation} className="buttonHeaderGlobal">
      {name}
    </button>
  );
}

export default ButtonHeaderGlobal;
