import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ResponsibleTours.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import Table from "../GlobalClasses/Table";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";

function ResponsibleTours() {
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Nunmber of Visitors",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Rating",
    "Notes",
  ];
  const data = [
    [
      "1",
      "TED Ankara",
      "Ankara",
      "30.03.2025",
      "18.00",
      "25",
      "Ege Ertem",
      "Pricipal",
      "123124",
      "mail@mail.com",
      "High",
      "Note note note",
    ],
    [
      "2",
      "Ankara Atatürk Lisesi",
      "Ankara",
      "30.03.2025",
      "11.00",
      "11",
      "Can Kütükoğlu",
      "Pricipal",
      "123124",
      "mail@mail.com",
      "High",
      "Note note note",
    ],
    [
      "3",
      "Jale Tezer",
      "Ankara",
      "30.03.2025",
      "17.00",
      "56",
      "Bora Akoğuz",
      "Pricipal",
      "123124",
      "mail@mail.com",
      "High",
      "Note note note",
    ],
  ];
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // State to hold the user's role

  // Simulate fetching the user's role from an API or global state
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("TOKEN: ", token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        // Extract the role claim (adjust based on your JWT structure)
        const roleClaim =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || decodedToken.role; // Use "role" if no namespace is used
        setUserRole(roleClaim || "User");

        const nameClaim =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        setUserName(nameClaim || "Unknown");

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

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const navigateToSection = (path) => {
    navigate(path);
  };
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
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  return (
    <div className="responsibleToursPage">
      <div className="leftSideAdvisorFunction">
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
          <div className="profileSidebarSection">
            <img src={profileImage}></img>
            <span>{username}</span>
          </div>
          <div className="logoutSidebarSection">
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>
      </div>
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"ADVISOR PANEL"} />
        <div>
          <h1 className="responsibleToursHeading">Responsible Tours</h1>
          <Table headers={headers} data={data} />
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}

export default ResponsibleTours;
