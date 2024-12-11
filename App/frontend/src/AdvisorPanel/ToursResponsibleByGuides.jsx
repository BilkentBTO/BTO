import React from "react";
import "./ToursResponsibleByGuides.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";

function ToursResponsibleByGuides() {
  const navigate = useNavigate();
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = ["Tour", "Guide Name", "Guide Surname", "Guide Username"];
  const data = [
    ["Tour 12", "Can", "Kütükoğlu", "spritewithice"],
    ["Tour 54", "Ege", "Ertem", "ege04"],
    ["Tour 33", "Bora", "Akoğuz", "boraborabora"],
  ];
  const handleRowClick = (rowData) => {
    // CHANGE, MAKE A POPUP
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonName = "Edit";

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  return (
    <div className="toursResponsibleByGuides">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <div>
        <h1 className="assignedToursHeading">Guides and Corresponding Tours</h1>
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
export default ToursResponsibleByGuides;
