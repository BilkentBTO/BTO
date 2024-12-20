import React, { useState, useEffect } from "react";
import "./AssignedToursPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import profileImage from "../assets/profile_image.png";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

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
  const cancelRemove = () => {
    setShowPopup(false); // Close the popup
    setSelectedTour(null); // Clear the selected tour
  };

  return (
    <div className="assignedToursPage">
      <GlobalSidebar />
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
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                >
                  Remove
                </button>
                <button
                  onClick={cancelRemove}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "grey",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
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
