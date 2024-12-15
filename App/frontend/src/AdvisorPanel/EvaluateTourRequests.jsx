import React, { useState } from "react";
import "./EvaluateTourRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";

function EvaluateTourRequests() {
  const navigate = useNavigate();

  // TEMPORARY DATA
  const headers = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Number of Visitors",
    "Rating",
  ];
  const data = [
    ["1", "TED Ankara", "Ankara", "30.03.2025", "18.00", "25", "High"],
    [
      "2",
      "Ankara Atatürk Lisesi",
      "Ankara",
      "30.03.2025",
      "11.00",
      "11",
      "High",
    ],
    ["3", "Jale Tezer", "Ankara", "30.03.2025", "17.00", "56", "High"],
  ];
  const completeHeaders = [
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
    "Rating",
    "Notes",
  ];
  const completeData = [
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
      "Principal",
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
      "Principal",
      "123124",
      "mail@mail.com",
      "High",
      "Note note note",
    ],
  ];

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px", // Add margin to distinguish buttons
  };

  const buttonName = "Decide";

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (rowData) => {
    const tourId = rowData[0];
    const completeRow = completeData.find((row) => row[0] === tourId);
    setSelectedRow(completeRow);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
  };

  const approve = () => {
    // Approve logic to be implemented later
  };

  const deny = () => {
    // Deny logic to be implemented later
  };

  const proposeDate = () => {
    // Propose another date logic to be implemented later
  };

  return (
    <div className="evaluateTourRequests">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <div>
        <h1 className="evaluateTourRequestsHeading">Evaluate Tour Requests</h1>
        <TableWithButtons
          headers={headers}
          data={data}
          onButtonClick={handleRowClick}
          buttonStyle={buttonStyle} // Pass custom button style
          buttonName={buttonName}
        />
      </div>
      {popupVisible && selectedRow && (
        <div className="requestPopupOverlay">
          <div className="requestPopupContent">
            <h2>Tour Details</h2>
            <table className="popupTable">
              <tbody>
                {completeHeaders.map((header, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{header}:</strong>
                    </td>
                    <td>{selectedRow[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="popupButtons">
              <button
                className="popupButton"
                onClick={approve}
                style={buttonStyle}
              >
                Approve
              </button>
              <button
                className="popupButton"
                onClick={deny}
                style={buttonStyle}
              >
                Deny
              </button>
              <button
                className="popupButton"
                onClick={proposeDate}
                style={buttonStyle}
              >
                Propose Another Date
              </button>
              <button
                className="popupButton"
                onClick={closePopup}
                style={buttonStyle}
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default EvaluateTourRequests;
