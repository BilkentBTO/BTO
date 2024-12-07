import React from "react";
import Table from "../GlobalClasses/Table";
import "./AssignedFairsPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";

function AssignedFairs() {
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = [
    "School",
    "City",
    "Date",
    "Time",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Notes",
  ];
  const data = [
    [
      "TED Ankara",
      "Ankara",
      "30.03.2025",
      "18.00",
      "Ege Ertem",
      "Pricipal",
      "123124",
      "mail@mail.com",
      "Note note note",
    ],
    [
      "Ankara Atatürk Lisesi",
      "Ankara",
      "30.03.2025",
      "11.00",
      "Can Kütükoğlu",
      "Pricipal",
      "123124",
      "mail@mail.com",
      "Note note note",
    ],
    [
      "Jale Tezer",
      "Ankara",
      "30.03.2025",
      "17.00",
      "Bora Akoğuz",
      "Pricipal",
      "123124",
      "mail@mail.com",
      "Note note note",
    ],
  ];
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  return (
    <div className="assignedFairsPage">
      <HeaderPanelGlobal name={"ASSIGNED FAIRS"} />
      <div>
        <h1 className="assignedFairsHeading">Assigned Fairs</h1>
        <Table headers={headers} data={data} />
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default AssignedFairs;
