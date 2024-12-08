import React, { useState } from "react";
import bilkentLogo from "../assets/bilkent_logo.png";
import LoginTextEdit from "./LoginTextEdit";
import { useNavigate } from "react-router-dom";
import returnButton from "../assets/return.png";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/Credential/login", {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(response.ok);
      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const result = await response.text();
      console.log(result);

      navigate("/coordinatorPanel");
    } catch (error) {
      setPopupMessage(`Error: ${error.message}`);
      setIsPopupVisible(true);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const forgotPassword = () => {
    navigate("/forgotPassword");
  };

  const goBack = () => {
    navigate("/");
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
        <h2 className="loginHeader">Login</h2>
        <LoginTextEdit
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoginTextEdit
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginButton" onClick={handleLogin}>
          Login
        </button>

        {/* Pop-up for error message */}
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
            <button className="forgotPasswordButton" onClick={forgotPassword}>
              Forgot Password?
            </button>
          </div>
        </div>

        <button className="forgotPasswordButton" onClick={forgotPassword}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
