import React, { useState } from "react";
import bilkentLogo from "../assets/bilkent_logo.png";
import returnButton from "../assets/return.png";
import LoginTextEdit from "./LoginTextEdit";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    console.log("NEW:", newPassword);
    console.log("NEW CON", confirmPassword);
    if (newPassword !== confirmPassword) {
      setPopupMessage("New passwords do not match");
      setIsPopupVisible(true);
      return;
    }

    try {
      const response = await fetch("/api/credential/changepassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check for invalid credentials
        if (response.status === 401) {
          setPopupMessage("Invalid credentials. Please check your input.");
        } else {
          setPopupMessage(
            `Failed to reset password: ${errorData.message || "Unknown error"}`
          );
        }
        setIsPopupVisible(true);
        return;
      }

      setPopupMessage("Password changed successfully!");
      setIsPopupVisible(true);

      // Redirect to login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      setPopupMessage("An error occurred. Please try again.");
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
          className="returnLoginButton"
          onClick={goBack}
          alt="Go Back"
        />
        <img src={bilkentLogo} className="logoLogin" alt="Bilkent Logo" />
        <h2 className="loginHeader">Forgot Password</h2>
        <LoginTextEdit
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoginTextEdit
          type="password"
          placeholder="Enter your old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <LoginTextEdit
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <LoginTextEdit
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="loginButton" onClick={handleForgotPassword}>
          Change Password
        </button>
      </div>
      {/* Popup for error or success messages */}
      <div id="popup" className={`popup ${isPopupVisible ? "" : "hidden"}`}>
        <div className="popup-content">
          <p id="popup-message">{popupMessage}</p>
          <button
            id="close-popup"
            className="popupForgotbutton"
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
