import React, { useState } from "react";
import bilkentLogo from "../assets/bilkent_logo.png";
import { useEffect } from "react";
import LoginTextEdit from "./LoginTextEdit";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import returnButton from "../assets/return.png";
import "./LoginPage.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handleForgot = () => {
    //Do the required
    if (email === confirmEmail) {
      console.log(email);
      console.log(confirmEmail);
      navigate("/");
    } else {
      setPopupMessage(`Emails do not match`);
      setIsPopupVisible(true);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const goBack = () => {
    navigate("/login");
  };
  return (
    <div className="loginPage">
      <div className="loginSection">
        <img
          src={returnButton}
          className="returnButton"
          onClick={goBack}
          alt="Go Back"
        />
        <img src={bilkentLogo} className="logoLogin" alt="Bilkent Logo" />
        <h2 className="loginHeader">Forgot Password</h2>
        <LoginTextEdit
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoginTextEdit
          type="text"
          placeholder="Confirm your email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />
        <button className="loginButton" onClick={handleForgot}>
          Reset Password
        </button>
      </div>
      <div id="popup" className={`popup ${isPopupVisible ? "" : "hidden"}`}>
        <div className="popup-content">
          <p id="popup-message">{popupMessage}</p>
          <button
            id="close-popup"
            className="popup-button"
            onClick={closePopup}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
export default ForgotPasswordPage;
