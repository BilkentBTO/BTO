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
    // IMPLEMENT !!!!!!!
  };

  const handleAssignGuide = () => {
    setPopupType("assign");
  };

  const handleClosePopup = () => {
    setSelectedFair(null);
    setPopupType(null);
  };

  const handleConfirm = () => {
    // IMPLEMENT !!!!!!!!!!!!!
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
          <div className="popupOverlay">
            <div className="popupContent">
              {popupType === null && (
                <>
                  <h2>Fair Information</h2>
                  <p>
                    <strong>School Name:</strong> {selectedFair[0]}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedFair[1]}
                  </p>
                  <p>
                    <strong>Date of Visit:</strong> {selectedFair[2]}
                  </p>
                  <div className="popupActions">
                    <button
                      className="popupButton"
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
                      onClick={handleDismissGuide}
                    >
                      Dismiss Guide
                    </button>
                    <button
                      className="popupButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "green",
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
                      onClick={handleAssignGuide}
                    >
                      Assign Guide
                    </button>
                    <button
                      className="popupButton closeButton"
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
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

              {popupType === "assign" && (
                <>
                  <h2>Assign Guide</h2>
                  <FormDropDownGlobal
                    arr={allGuides}
                    question="Select a guide to assign"
                    onChange={(value) => setDropdownValue(value)}
                  />
                  <div className="popupActions">
                    <button
                      className="popupButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "green",
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
                      onClick={handleConfirm}
                    >
                      Assign
                    </button>
                    <button
                      className="popupButton closeButton"
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
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignGuideToFairs;
