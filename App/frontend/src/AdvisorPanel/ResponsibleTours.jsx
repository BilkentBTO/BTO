import React, { useState } from "react";
import "./ResponsibleTours.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import Table from "../GlobalClasses/Table";

function ResponsibleTours() {
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
    "Rating",
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
      "Pricipal",
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
      "Pricipal",
      "123124",
      "mail@mail.com",
      "High",
      "Note note note",
    ],
  ];

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  return (
    <div className="responsibleTours">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <div>
        <h1 className="responsibleToursHeading">Responsible Tours</h1>
        <Table headers={headers} data={data} />
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default ResponsibleTours;