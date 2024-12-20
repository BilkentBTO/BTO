import React, { useState, useEffect } from "react";
import "./AssignGuideToFairs.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AssignGuideToFairs() {
  const headers = [
    "School Name",
    "City",
    "Date of Visit",
    "Guide Number",
    "Notes",
  ];

  const data = [
    ["TED Ankara", "Ankara", "24.12.2025", "1", "Not not not"],
    ["Nesibe Aydin", "Ankara", "30.12.2025", "2", "Not not not"],
  ];

  const [selectedFair, setSelectedFair] = useState(null);
  const [popupType, setPopupType] = useState(null); // "dismiss" or "assign"
  const [dropdownValue, setDropdownValue] = useState("");

  const guides = ["Can", "Ege", "Bora"];
  const allGuides = [...guides, "Ertu", "Kerem"];

  const handleRowClick = (row) => {
    setSelectedFair(row);
    setPopupType(null); // Ensure no popup is open initially
  };

  const handleDismissGuide = () => {
    setPopupType("dismiss");
  };

  const handleAssignGuide = () => {
    setPopupType("assign");
  };

  const handleClosePopup = () => {
    setPopupType(null);
    setSelectedFair(null);
  };

  const handleClosePopupContent = () => {
    setPopupType(null);
  };

  const handleConfirm = () => {
    alert(`Confirmed action with guide: ${dropdownValue}`);
    setPopupType(null);
  };
  return (
    <div className="assignGuideToFairs">
      <GlobalSidebar />
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
        <div>
          <h1 className="assignGuideToFairsHeading">Assign Guide to Fairs</h1>
          <TableWithButtons
            headers={headers}
            data={data}
            onButtonClick={(row) => handleRowClick(row)}
            buttonStyle={{
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
            }}
            buttonName="Manage Guide"
          />
        </div>

        {selectedFair && (
          <div className="popup">
            {popupType === null && (
              <div className="popup-content">
                <h2>Fair Information</h2>
                <p>School Name: {selectedFair[0]}</p>
                <p>City: {selectedFair[1]}</p>
                <p>Date of Visit: {selectedFair[2]}</p>
                <button onClick={handleDismissGuide} style={{ margin: "5px" }}>
                  Dismiss Guide
                </button>
                <button onClick={handleAssignGuide} style={{ margin: "5px" }}>
                  Assign Guide
                </button>
                <button onClick={handleClosePopup} style={{ margin: "5px" }}>
                  Close
                </button>
              </div>
            )}

            {popupType === "dismiss" && (
              <div className="popup-content">
                <h2>Dismiss Guide</h2>
                <FormDropDownGlobal
                  arr={guides}
                  question="Select a guide to dismiss"
                  onChange={(value) => setDropdownValue(value)}
                />
                <button onClick={handleConfirm} style={{ margin: "5px" }}>
                  Confirm
                </button>
                <button
                  onClick={handleClosePopupContent}
                  style={{ margin: "5px" }}
                >
                  Close
                </button>
              </div>
            )}

            {popupType === "assign" && (
              <div className="popup-content">
                <h2>Assign Guide</h2>
                <FormDropDownGlobal
                  arr={allGuides}
                  question="Select a guide to assign"
                  onChange={(value) => setDropdownValue(value)}
                />
                <button onClick={handleConfirm} style={{ margin: "5px" }}>
                  Assign
                </button>
                <button
                  onClick={handleClosePopupContent}
                  style={{ margin: "5px" }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignGuideToFairs;
