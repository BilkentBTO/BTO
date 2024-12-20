import React, { useState } from "react";
import "./ManageFairRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function ManageFairRequests() {
  const headers = ["School Name", "City", "Date of Visit", "Notes"];

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
    <div className="assignGuideToFairs">
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
        <div className="popupOverlay">
          <div className="popupContent">
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
            <p>
              <strong>Notes:</strong> {selectedFair[3]}
            </p>

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
                  transition: "background-color 0.3s ease, transform 0.2s ease",
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
                  transition: "background-color 0.3s ease, transform 0.2s ease",
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
                  transition: "background-color 0.3s ease, transform 0.2s ease",
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
  );
}

export default ManageFairRequests;
