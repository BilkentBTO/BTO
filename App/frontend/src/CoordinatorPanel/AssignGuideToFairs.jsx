import React, { useState } from "react";
import "./AssignGuideToFairs.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";

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

  const handleRowClick = () => {
    // Fill here
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  };

  const buttonName = "Manage Guide";

  return (
    <div className="assignGuideToFairs">
      <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
      <div>
        <h1 className="assignGuideToFairsHeading">Assign Guide to Fairs</h1>
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

export default AssignGuideToFairs;
