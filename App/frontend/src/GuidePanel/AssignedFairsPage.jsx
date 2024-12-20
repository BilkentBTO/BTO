import React, { useEffect, useState } from "react";
import Table from "../GlobalClasses/Table";
import "./AssignedFairsPage.css";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AssignedFairs() {
  const navigate = useNavigate();

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = [
    "Fair ID",
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
      "1",
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
      "2",
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
      "3",
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
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"GUIDE PANEL"} />
        <div>
          <h1 className="assignedFairsHeading">Assigned Fairs</h1>
          <Table headers={headers} data={data} />
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}
export default AssignedFairs;
