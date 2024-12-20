import React, { useState } from "react";
import "./DataPanel.css"; // Reuse the existing styles
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function DataPanel() {
  const headers = [
    "Schools",
    "Location",
    "Student Number",
    "Students Sent to Bilkent",
    "YKS Rating",
    "Relation Status",
  ];
  const data = [
    ["Ted Ankara Koleji", "Ankara", "600", "130", "Low", "Good"],
    ["Atatürk Anadolu", "Ankara", "100", "23", "High", "Mid"],
    ["Nesibe Aydin", "Ankara", "200", "68", "High", "Mid"],
  ];

  const [showPopup, setShowPopup] = useState(false); // State to toggle popup
  const [popupContent, setPopupContent] = useState({}); // State to store popup data

  const handleRowClick = (rowData) => {
    // Open the popup and set its content
    setPopupContent({
      school: rowData[0],
      location: rowData[1],
      studentNumber: rowData[2],
      sentToBilkent: rowData[3],
      yksRating: rowData[4],
      relationStatus: rowData[5],
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
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

  return (
    <div className="dataPanel">
      <HeaderPanelGlobal name={"DATA PANEL"} />
      <div>
        <h1 className="dataPanelHeading">School Data</h1>
        <TableWithButtons
          headers={headers}
          data={data}
          onButtonClick={(row) => handleRowClick(row)} // Pass the correct row data
          buttonStyle={buttonStyle}
          buttonName="Details"
        />
      </div>

      {/* Popup Component */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>{popupContent.school}</h2>
            <p>
              <strong>Location:</strong> {popupContent.location}
            </p>
            <p>
              <strong>Student Number:</strong> {popupContent.studentNumber}
            </p>
            <p>
              <strong>Students Sent to Bilkent:</strong>{" "}
              {popupContent.sentToBilkent}
            </p>
            <p>
              <strong>YKS Rating:</strong> {popupContent.yksRating}
            </p>
            <p>
              <strong>Relation Status:</strong> {popupContent.relationStatus}
            </p>
            <button
              onClick={closePopup}
              style={{
                padding: "8px 16px",
                backgroundColor: "red",
                marginTop: "20px",
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
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataPanel;
