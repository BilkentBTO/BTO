import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import "./UserPage.css";

function UserPage({ username }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("email@example.com"); // Only email is customizable

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleBack = () => {
    console.log("Back");
    // DOES NOT WORK, EITHER DELETE OR IMPLEMENT
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

  return (
    <div>
      <HeaderGlobal name={"Profile Page"} />
      <div className="profileSection">
        <img className="profileImage" src={profileImage} alt="Profile" />
        <table className="profileTable">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Surname</th>
              <td>Cindaruk</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{username || name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>Admin</td>
            </tr>
          </tbody>
        </table>
        <button className="profileBackButton" onClick={handleBack}>
          Back
        </button>
        <button className="profileLogoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default UserPage;
