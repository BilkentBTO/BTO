import React, { useState, useEffect } from "react";
import "./AssignGuideToFairs.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AssignGuideToFairs() {
  const headers = [
    "School Name",
    "City",
    "Date of Visit",
    "Supervisor Name",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Notes",
  ];

  const [data, setData] = useState([]);
  const [selectedFair, setSelectedFair] = useState(null);
  const [popupType, setPopupType] = useState(null); // "dismiss" or "assign"
  const [dropdownValue, setDropdownValue] = useState("");

  const guides = ["Can", "Ege", "Bora"];
  const allGuides = [...guides, "Ertu", "Kerem"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/schedule/availablefairs");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        setData(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (row) => {
    setSelectedFair(row);
    setPopupType(null); // Ensure no popup is open initially
  };

  const handleDismissGuide = () => {
    setPopupType("dismiss");
  };

  const handleAssignGuide = () => {
    setPopupType("assign");
  };

  const handleClosePopup = () => {
    setSelectedFair(null);
    setPopupType(null);
  };

  const handleConfirm = async () => {
    // IMPLEMENT !!!!!!!!!!!!!
    alert(`Confirmed action with guide: ${dropdownValue}`);
    setPopupType(null);
  };

  const handleDismiss = async () => {
    // IMPLEMENT !!!!!!!!!!!!!
    alert(`Confirmed action with guide: ${dropdownValue}`);
    setPopupType(null);
  };

  return (
    <div className="assignGuideToFairs">
      <GlobalSidebar />
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
        <div>
          <h1 className="assignGuideToFairsHeading">Assign Guide to Fairs</h1>
          {data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data.map((item) => [
                item.fairRegistirationInfo.school.schoolName || "N/A",
                item.fairRegistirationInfo.cityName || "N/A",
                item.fairRegistirationInfo.dateOfVisit || "N/A",
                item.fairRegistirationInfo.superVisorName || "N/A",
                item.fairRegistirationInfo.superVisorDuty || "N/A",
                item.fairRegistirationInfo.superVisorPhoneNumber || "N/A",
                item.fairRegistirationInfo.superVisorMailAddress || "N/A",
                item.fairRegistirationInfo.notes || "N/A",
              ])}
              onButtonClick={(row) => handleRowClick(row)}
              buttonStyle={{
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
              }}
              buttonName="Manage Guide"
            />
          ) : (
            <p className="noDataText">No Fairs</p>
          )}
        </div>

        {selectedFair && (
          <div className="popupOverlay">
            <div className="popupContent">
              {popupType === null && (
                <>
                  <h2>Fair Information</h2>
                  <p>
                    <strong>School Name:</strong> {selectedFair[0]}
                  </p>
                  <p>
                    <strong>City:</strong> {selectedFair[1]}
                  </p>
                  <p>
                    <strong>Date of Visit:</strong> {selectedFair[2]}
                  </p>
                  <div className="popupActions">
                    <button
                      className="popupButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={handleDismissGuide}
                    >
                      Dismiss Guide
                    </button>
                    <button
                      className="popupButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={handleAssignGuide}
                    >
                      Assign Guide
                    </button>
                    <button
                      className="popupButton closeButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "grey",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

              {popupType === "assign" && (
                <>
                  <h2>Assign Guide</h2>
                  <FormDropDownGlobal
                    arr={allGuides}
                    question="Select a guide to assign"
                    onChange={(value) => setDropdownValue(value)}
                  />
                  <div className="popupActions">
                    <button
                      className="popupButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={() => handleConfirm()}
                    >
                      Assign
                    </button>
                    <button
                      className="popupButton closeButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "grey",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
              {popupType === "dismiss" && (
                <>
                  <h2>Dismiss Guide</h2>
                  <FormDropDownGlobal
                    arr={guides}
                    question="Select a guide to dismiss"
                    onChange={(value) => setDropdownValue(value)}
                  />
                  <div className="popupActions">
                    <button
                      className="popupButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={() => handleDismiss()}
                    >
                      Dismiss
                    </button>
                    <button
                      className="popupButton closeButton"
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "grey",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                      }}
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignGuideToFairs;
