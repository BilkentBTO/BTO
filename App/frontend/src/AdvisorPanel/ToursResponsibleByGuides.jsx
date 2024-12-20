import React, { useState, useEffect } from "react";
import "./ToursResponsibleByGuides.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";

function ToursResponsibleByGuides() {
  // State to manage popup visibility and data
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = ["Tour", "Guide Name", "Guide Surname", "Guide Username"];
  const data = [
    ["12", "Can", "Kütükoğlu", "spritewithice"],
    ["54", "Ege", "Ertem", "ege04"],
    ["33", "Bora", "Akoğuz", "boraborabora"],
  ];

  const handleRowClick = (rowData) => {
    // Set the selected row and show popup
    setSelectedRow(rowData);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedRow(null);
  };

  const saveChanges = () => {
    // SAVE ACTION IMPLEMENT !!!!!!!!!!!!!!!!!!!!!!!!!1
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#1e1e64",
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

  const buttonName = "Edit";

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const guides = ["Canga", "Ertu", "Egorto", "Borabora"];
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
  return (
    <div className="toursResponsibleByGuidesPage">
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
          <h1 className="assignedToursHeading">
            Guides and Corresponding Tours
          </h1>
          <TableWithButtons
            headers={headers}
            data={data}
            onButtonClick={handleRowClick}
            buttonStyle={buttonStyle} // Pass custom button style
            buttonName={buttonName}
          />
        </div>

        {/* Popup Modal */}
        {isPopupVisible && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Change Guides</h2>
              <p>
                <strong>Tour:</strong> {selectedRow[0]}
              </p>

              {/* Plain Text for Current Guide */}
              <p>
                <strong>Current Guide:</strong> {selectedRow[1]}{" "}
                {selectedRow[2]}
              </p>

              {/* Dropdown for New Guide */}
              <FormDropDownGlobal arr={guides} question="Change to*" />

              {/* Actions */}
              <div className="popupActions">
                <button
                  onClick={saveChanges}
                  style={{ ...buttonStyle, backgroundColor: "green" }}
                >
                  Save
                </button>
                <button
                  onClick={closePopup}
                  style={{ ...buttonStyle, backgroundColor: "red" }}
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

export default ToursResponsibleByGuides;
