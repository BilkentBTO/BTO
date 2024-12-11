import React from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";

function AvailableToursPage() {
  const navigate = useNavigate();
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Nunmber of Visitors",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Notes",
  ];
  const data = [
    [
      "1",
      "TED Ankara",
      "Ankara",
      "30.03.2025",
      "18.00",
      "25",
      "Ege Ertem",
      "Pricipal",
      "123124",
      "mail@mail.com",
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
      "Pricipal",
      "123124",
      "mail@mail.com",
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
      "Pricipal",
      "123124",
      "mail@mail.com",
      "Note note note",
    ],
  ];
  const handleRowClick = (rowData) => {
    //navigate("/guidePanel/assignedTours/manageTour", { state: { rowData } }); // Pass rowData via state
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonName = "Apply";

  return (
    <div className="availableToursPage">
      <HeaderPanelGlobal name={"GUIDE PANEL"} />
      <div>
        <h1 className="availableToursHeading">Available Tours</h1>
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

export default AvailableToursPage;
