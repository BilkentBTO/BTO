import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./GlobalSidebar.css";

function GlobalSidebar() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(""); // State to hold the user's role
  const [username, setUserName] = useState("");

  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate fetching the user's role from an API or global state
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const roleClaim =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || decodedToken.role; // Use "role" if no namespace is used
        const nameClaim =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        const emailClaim = decodedToken.email || "example@mail.com";
        const surnameClaim = decodedToken.surname || "Unknown Surname";

        setUserRole(roleClaim || "User");
        setUserName(nameClaim || "Unknown User");
        setEmail(emailClaim);
        setSurname(surnameClaim);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  const toggleProfile = () => {
    setIsExpanded((prev) => !prev); // Toggle the expanded state
  };
  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  // Sidebar navigation based on role
  const sidebarOptions = {
    Admin: [
      { label: "Admin Panel", path: "/adminPanel" },
      { label: "Coordinator Panel", path: "/coordinatorPanel" },
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Coordinator: [
      { label: "Coordinator Panel", path: "/coordinatorPanel" },
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Advisor: [
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Guide: [{ label: "Guide Panel", path: "/guidePanel" }],
  };

  const navigateToSection = (path) => {
    navigate(path);
  };
  return (
    <div className="leftSideCoorFunction">
      <div className="sidebar">
        <h3>Navigation</h3>
        <ul>
          {sidebarOptions[userRole]?.map((option, index) => (
            <li
              key={index}
              onClick={() => navigateToSection(option.path)}
              style={{
                border: "1px solid white",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: location.pathname.startsWith(option.path)
                  ? "#1e1e64"
                  : "#3c3c82",
                color: location.pathname.startsWith(option.path)
                  ? "white"
                  : "white",
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="bottomSidebarSection">
        <div className={`profileDetails ${isExpanded ? "show" : ""}`}>
          <p>
            <strong>Surname:</strong> {surname}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Username:</strong> {username}
          </p>
        </div>
        <div
          className={`profileSidebarSection ${isExpanded ? "expanded" : ""}`}
          onClick={toggleProfile}
        >
          <img src={profileImage} alt="Profile" />
          <span>{username}</span>
        </div>

        <div className="logoutSidebarSection">
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
}
export default GlobalSidebar;
