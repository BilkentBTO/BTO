import React, { useState } from "react";
import "./GuideRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";

function GuideRequests() {
  const navigate = useNavigate();

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = ["Guide Username", "Tour", "Status"];
  const data = [
    ["cankutukoglu", "Tour 14", "Decision Waiting"],
    ["borabora", "Tour 56", "Decision Waiting"],
    ["egeertem", "Tour 98", "Decision Waiting"],
  ];

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

  const buttonName = "Decide";

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
  };

  const approve = () => {
    // Approve
  };

  const deny = () => {
    // Deny
  };

  const proposeDate = () => {
    // Propose Date
  };

  return (
    <div className="guideRequests">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <div>
        <h1 className="guideRequestsHeading">Guide Tour Requests</h1>
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
            <h2>Decision for Guide Request</h2>
            <p>
              <strong>Guide:</strong> {selectedRow[0]}
            </p>
            <p>
              <strong>Tour:</strong> {selectedRow[1]}
            </p>
            <div className="requestPopupButtons">
              <button
                className="requestPopupButton"
                onClick={approve}
                style={{ margin: "5px" }}
              >
                Approve
              </button>
              <button
                className="requestPopupButton"
                onClick={deny}
                style={{ margin: "5px" }}
              >
                Deny
              </button>
              <button
                className="requestPopupButton"
                onClick={proposeDate}
                style={{ margin: "5px" }}
              >
                Propose Another Day
              </button>
              <button
                className="requestPopupButton"
                onClick={closePopup}
                style={{ margin: "5px" }}
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

export default GuideRequests;
