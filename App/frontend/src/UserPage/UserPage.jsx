import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import "./UserPage.css";

function UserPage({ username }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState(""); // State to store the role
  const [email, setEmail] = useState("email@example.com");

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleBack = () => {
    console.log("Back");
    // Navigate to different pages based on the role
    switch (role.toLowerCase()) {
      case "admin":
        navigate("/adminPanel");
        break;
      case "advisor":
        navigate("/advisorPanel");
        break;
      case "guide":
        navigate("/guidePanel");
        break;
      case "coordinator":
        navigate("/coordinatorPanel");
        break;
      default:
        navigate("/"); // Default fallback page
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token

        // Extract the name claim
        const nameClaim =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        setName(nameClaim || "Unknown");

        // Extract the role claim (adjust based on your JWT structure)
        const roleClaim =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || decodedToken.role; // Use "role" if no namespace is used
        setRole(roleClaim || "User");

        console.log("Decoded Token:", decodedToken);
        console.log("Role:", roleClaim);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    document.title = "View Profile - BTO";
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
              <td>{name}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{name}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{role}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{email}</td>
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
