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
    ["cankutukoglu", "Tour 14"],
    ["borabora", "Tour 56"],
    ["egeertem", "Tour 98"],
  ];

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonName = "Decide";

  const handleRowClick = (rowData) => {};

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default GuideRequests;
