import React, { useState } from "react";
import "../CoordinatorPanel/ListAllUsers.css"; // Reuse the existing styles
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
    ["TED Ankara", "Ankara", "600", "130", "Low", "Good"],
    ["Atatürk Anadolu", "Ankara", "100", "23", "High", "Mid"],
    ["Nesibe Aydin", "Ankara", "200", "68", "High", "Mid"],
  ];

  const handleRowClick = () => {};

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  };

  return (
    <div className="dataPanel">
      <HeaderPanelGlobal name={"DATA PANEL"} />
      <div>
        <h1 className="dataPanelHeading">Data Panel</h1>
        <TableWithButtons
          headers={headers}
          data={data}
          onButtonClick={handleRowClick}
          buttonStyle={buttonStyle}
          buttonName="Details"
        />
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default DataPanel;
