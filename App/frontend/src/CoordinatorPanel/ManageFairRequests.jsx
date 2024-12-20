import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import "./ManageFairRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ManageFairRequests() {
  const headers = ["School Name", "City", "Date of Visit", "Notes"];
  const navigate = useNavigate();
  const data = [
    ["TED Ankara", "Ankara", "24.12.2025", "Not not not"],
    ["Nesibe Aydin", "Ankara", "30.12.2025", "Not not not"],
  ];

  const [selectedFair, setSelectedFair] = useState(null);
  const [popupType, setPopupType] = useState(null); // "accept", "decline", or null

  const handleRowClick = (row) => {
    setSelectedFair(row);
    setPopupType(null); // Ensure no popup is open initially
  };

  const closePopup = () => {
    setSelectedFair(null);
    setPopupType(null);
  };

  const handleAccept = () => {
    setPopupType("accept");
    // Implement accept logic here
  };

  const handleDecline = () => {
    setPopupType("decline");
    // Implement decline logic here
  };

  return (
    <div className="assignGuideToFairsPage">
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
        <div>
          <h1 className="assignGuideToFairsHeading">Manage Fair Requests</h1>
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
            buttonName="Manage Fair"
          />
        </div>

        {selectedFair && (
          <div className="popup">
            <div className="popup-content">
              <h2>Fair Information</h2>
              <p>School Name: {selectedFair[0]}</p>
              <p>City: {selectedFair[1]}</p>
              <p>Date of Visit: {selectedFair[2]}</p>
              <p>Notes: {selectedFair[3]}</p>

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
                  onClick={handleAccept}
                >
                  Accept
                </button>
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
                  onClick={handleDecline}
                >
                  Decline
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
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageFairRequests;
