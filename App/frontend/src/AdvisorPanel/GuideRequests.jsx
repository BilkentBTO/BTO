import React, { useState, useEffect } from "react";
import "./GuideRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import profileImage from "../assets/profile_image.png";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function GuideRequests() {
  const navigate = useNavigate();

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = ["Guide Username", "Tour", "Status"];
  const data = [
    ["cankutukoglu", "Tour 14", "Decision Waiting"],
    ["borabora", "Tour 56", "Decision Waiting"],
    ["egeertem", "Tour 98", "Decision Waiting"],
  ];

  const buttonStyleApprove = {
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
  };

  const buttonStyleDeny = {
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

  const buttonStyleReturn = {
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
    <div className="guideRequestsPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"ADVISOR PANEL"} />
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
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Decision for Guide Tour Request</h2>
            <p>
              <strong>Guide:</strong> {selectedRow[0]}
            </p>
            <p>
              <strong>Tour:</strong> {selectedRow[1]}
            </p>
            <div className="popupActions">
              <button
                className="requestPopupButton"
                onClick={approve}
                style={buttonStyleApprove}
              >
                Approve
              </button>
              <button
                className="requestPopupButton"
                onClick={deny}
                style={buttonStyleDeny}
              >
                Deny
              </button>
              <button
                className="requestPopupButton"
                onClick={closePopup}
                style={buttonStyleReturn}
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuideRequests;
