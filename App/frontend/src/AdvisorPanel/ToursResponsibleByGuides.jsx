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
  const [tableData, setTableData] = useState([]);

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
  useEffect(() => {
    // Fetch tours and guides data from the API
    const fetchToursAndUsers = async () => {
      try {
        // Fetch tours data
        const toursResponse = await fetch("/api/schedule/tours");
        if (!toursResponse.ok) {
          throw new Error(`Failed to fetch tours: ${toursResponse.status}`);
        }
        const toursData = await toursResponse.json();

        // For each tour, fetch the guide's user details
        const enrichedData = await Promise.all(
          toursData.map(async (tour) => {
            if (tour.assignedGuideID) {
              try {
                // Fetch user details for the assigned guide
                const userResponse = await fetch(
                  `/api/user/${tour.assignedGuideID}`
                );
                if (!userResponse.ok) {
                  throw new Error(
                    `Failed to fetch user ${tour.assignedGuideID}: ${userResponse.status}`
                  );
                }
                const userData = await userResponse.json();

                // Return enriched tour data
                return [
                  tour.tourRegistrationCode, // Tour Code
                  userData.name || "N/A", // Guide Name
                  userData.surname || "N/A", // Guide Surname
                  userData.mail || "N/A", // Guide Email/Username
                ];
              } catch (userError) {
                console.error(
                  `Error fetching user ${tour.assignedGuideID}:`,
                  userError
                );
                return [
                  tour.tourRegistrationCode,
                  "Unknown",
                  "Unknown",
                  "Unknown",
                ];
              }
            } else {
              // If no guide is assigned, return placeholders
              return [
                tour.tourRegistrationCode,
                "Unassigned",
                "Unassigned",
                "Unassigned",
              ];
            }
          })
        );

        // Set the table data
        setTableData(enrichedData);
      } catch (error) {
        console.error("Error fetching tours and user details:", error);
      }
    };

    fetchToursAndUsers();
  }, []);
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
          {tableData.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={tableData}
              onButtonClick={handleRowClick}
              buttonStyle={buttonStyle} // Pass custom button style
              buttonName={buttonName}
            />
          ) : (
            <p>No tours assigned to guides yet.</p>
          )}
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
