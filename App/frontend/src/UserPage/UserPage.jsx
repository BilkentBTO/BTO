import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import "./UserPage.css";

function UserPage({ username }) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("email@example.com"); // Only email is customizable

  const handleEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

  const handleSave = () => {
    setIsEditing(false); // Exit edit mode
    console.log("Updated Email:", email); // Save the new email (can be sent to a server)
  };

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving
  };
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const nameClaim =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ]; // Extract the name claim
        setName(nameClaim || "Unknown"); // Set the name or a default value
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    document.title = "View Profile - BTO"; // Set the tab title
  }, []);

  useEffect(() => {
    document.title = "View Profile - BTO"; // Set the tab title
  }, []);
  return (
    <div>
      <HeaderGlobal name={"Profile Page"} />
      <div className="profileSection">
        <img src={profileImage} alt="Profile" />
        <div className="infoLog">
          <div className="box">
            <p>Name:</p>
          </div>
          <div className="info">
            <p>{name}</p>
          </div>
        </div>
        <div className="infoLog">
          <div className="box">
            <p>Surname:</p>
          </div>
          <div className="info">
            <p>Cindaruk</p>
          </div>
        </div>
        <div className="infoLog">
          <div className="box">
            <p>Username:</p>
          </div>
          <div className="info">
            <p>{name}</p>
          </div>
        </div>
        <div className="infoLog">
          <div className="box">
            <p>Email:</p>
          </div>
          <div className="info">
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="emailEdit"
              />
            ) : (
              <p>{email}</p>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="buttonGroup">
            <button onClick={handleSave} className="saveButton">
              Save
            </button>
            <button onClick={handleCancel} className="cancelButton">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleEdit}>Change Email</button>
        )}
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
