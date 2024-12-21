import React, { useState, useEffect } from "react";
import "./ToursResponsibleByGuides.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ToursResponsibleByGuides() {
  // State to manage popup visibility and data
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = ["Tour", "Guide Name", "Guide Surname", "Guide Username"];
  const data = [
    ["12", "Can", "Kütükoğlu", "spritewithice"],
    ["54", "Ege", "Ertem", "ege04"],
    ["33", "Bora", "Akoğuz", "boraborabora"],
  ];

  const handleRowClick = (rowData) => {
    // Set the selected row and show popup
    setSelectedRow(rowData);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedRow(null);
  };

  const saveChanges = () => {
    // SAVE ACTION IMPLEMENT !!!!!!!!!!!!!!!!!!!!!!!!!1
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

  const buttonName = "Edit";

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const guides = ["Canga", "Ertu", "Egorto", "Borabora"];
  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <div className="toursResponsibleByGuidesPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"ADVISOR PANEL"} />
        <div>
          <h1 className="assignedToursHeading">
            Guides and Corresponding Tours
          </h1>
          <TableWithButtons
            headers={headers}
            data={data}
            onButtonClick={handleRowClick}
            buttonStyle={buttonStyle} // Pass custom button style
            buttonName={buttonName}
          />
        </div>

        {/* Popup Modal */}
        {isPopupVisible && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Change Guides</h2>
              <p>
                <strong>Tour:</strong> {selectedRow[0]}
              </p>

              {/* Plain Text for Current Guide */}
              <p>
                <strong>Current Guide:</strong> {selectedRow[1]}{" "}
                {selectedRow[2]}
              </p>

              {/* Dropdown for New Guide */}
              <FormDropDownGlobal arr={guides} question="Change to*" />

              {/* Actions */}
              <div className="popupActions">
                <button
                  onClick={saveChanges}
                  style={{ ...buttonStyle, backgroundColor: "green" }}
                >
                  Save
                </button>
                <button
                  onClick={closePopup}
                  style={{ ...buttonStyle, backgroundColor: "red" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToursResponsibleByGuides;
