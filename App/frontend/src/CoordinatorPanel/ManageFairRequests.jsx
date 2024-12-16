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

  const handleRowClick = (row) => {
    setSelectedFair(row);
  };

  const closePopup = () => {
    setSelectedFair(null);
  };

  const handleAccept = () => {
    // Implement here
  };

  const handleDecline = () => {
    // Implement here
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
            padding: "5px 10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "5px",
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

            <button onClick={handleAccept} style={{ margin: "5px" }}>
              Accept
            </button>
            <button onClick={handleDecline} style={{ margin: "5px" }}>
              Decline
            </button>
            <button onClick={closePopup} style={{ margin: "5px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFairRequests;
