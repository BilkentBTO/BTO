import React, { useState } from "react";
import bilkentLogo from "../assets/bilkent_logo.png";
import { useEffect } from "react";
import LoginTextEdit from "./LoginTextEdit";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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

      console.log("Response: ", response.json);
      console.log(response);

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const token = await response.text();

      const decodedToken = jwtDecode(token);

      console.log("Result: ", token);

      localStorage.setItem("jwt", token);

      const role = decodedToken["UserType"];

      console.log("ROLE: ", role);
      if (role === "Coordinator") {
        navigate("/coordinatorPanel");
      } else if (role === "Admin") {
        console.log("I WORK HERE");
        navigate("/adminPanel");
      } else if (role === "Guide") {
        navigate("/guidePanel");
      } else if (role === "Advisor") {
        navigate("/advisorPanel");
      } else {
        throw new Error("Unauthorized role");
      }
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
  useEffect(() => {
    document.title = "Login Page - BTO"; // Set the tab title
  }, []);

  return (
    <div className="loginPage">
      <div className="loginSection">
        <img
          src={returnButton}
          className="returnLoginButton"
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
        <div
          id="popup"
          className={`loginPopup ${isPopupVisible ? "" : "hidden"}`}
        >
          <div className="loginPopupContent">
            <p id="popup-message">{popupMessage}</p>
            <button
              id="close-popup"
              className="loginPopupButton"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>

        <button className="loginForgotPasswordButton" onClick={forgotPassword}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
