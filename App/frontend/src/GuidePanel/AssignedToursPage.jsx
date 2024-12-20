import React, { useState, useEffect } from "react";
import "./AssignedToursPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import profileImage from "../assets/profile_image.png";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AssignedToursPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedTour, setSelectedTour] = useState(null); // State to track the selected tour

  const headers = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Number of Visitors",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
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
      "Principal",
      "123124",
      "mail@mail.com",
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
      "Principal",
      "123124",
      "mail@mail.com",
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
      "Principal",
      "123124",
      "mail@mail.com",
      "Note note note",
    ],
  ];

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
    maxWidth: "120px",
    textAlign: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const buttonName = "Remove";

  const handleRemoveClick = (rowIndex) => {
    setSelectedTour(data[rowIndex]); // Track the selected row
    setShowPopup(true); // Show confirmation popup
  };

  const confirmRemove = () => {
    console.log("Removed:", selectedTour); // Perform removal action here
    setShowPopup(false); // Close the popup
  };
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
  const cancelRemove = () => {
    setShowPopup(false); // Close the popup
    setSelectedTour(null); // Clear the selected tour
  };

  return (
    <div className="assignedToursPage">
      <div className="leftSideGuideFunction">
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
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"GUIDE PANEL"} />
        <div>
          <h1 className="assignedToursHeading">Assigned Tours</h1>
          <TableWithButtons
            headers={headers}
            data={data}
            onButtonClick={handleRemoveClick} // Pass row index to the handler
            buttonStyle={buttonStyle}
            buttonName={buttonName}
          />
        </div>
        {/* Confirmation Popup */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h3>Are you sure you want to remove this tour?</h3>
              <p>This action cannot be undone.</p>
              <div className="popupActions">
                <button
                  onClick={confirmRemove}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={cancelRemove}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignedToursPage;
