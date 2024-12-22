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
    "Fair ID",
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
  const [tourGuides, setTourGuides] = useState([]);
  const [assignedGuides, setAssignedGuides] = useState([]);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/schedule/availablefairs");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        console.log("API DATA: ", apiData);
        setData(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAssignedGuides = async (fairId) => {
    const guidesResponse = await fetch(`/api/schedule/fair/${fairId}/guide`);
    if (!guidesResponse.ok) {
      throw new Error(`HTTP error! Status: ${guidesResponse.status}`);
    }
    const guides = await guidesResponse.json();
    console.log("Available Guides: ", guides);
    setAssignedGuides(guides);
  };
  const fetchAvailableGuides = async () => {
    try {
      // Make the API call with the eventCode as a query parameter
      const guidesResponse = await fetch(`/api/user/filter/4`);

      // Check if the response is OK
      if (!guidesResponse.ok) {
        throw new Error(`HTTP error! Status: ${guidesResponse.status}`);
      }

      // Parse the response data
      const guides = await guidesResponse.json();
      console.log("Available Guides: ", guides);

      // Update the state with the available guides
      setAvailableGuides(guides);
    } catch (error) {
      console.error("Error fetching available guides: ", error.message);
    }
  };

  const handleRowClick = async (row) => {
    console.log("Selected Row: ", row);

    // Extract the Fair ID from the row data
    const fairId = row[0]; // Assuming the first column in the row is the Fair ID
    console.log("Fair ID: ", fairId);

    try {
      // Fetch details for the selected fair
      const response = await fetch(`/api/schedule/fair/${fairId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fairDetails = await response.json();
      console.log("Fair Details: ", fairDetails);

      // Update the state with fetched fair details
      setSelectedFair(fairDetails);

      // Fetch available guides for the selected fair
    } catch (error) {
      console.error("Error fetching fair or guides data: ", error.message);
    }
    fetchAvailableGuides(fairId);
    fetchAssignedGuides(fairId);
    setPopupType(null);
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
    try {
      if (!selectedFair || !dropdownValue) {
        alert("Please select a valid guide and fair.");
        return;
      }

      // Extract required details for API call
      const fairCode = selectedFair.fairRegistrationCode; // Fair Code
      const guideUID = dropdownValue; // Selected Guide ID

      // Make API call to assign guide
      const response = await fetch(
        `/api/schedule/fair/${fairCode}/guide/${guideUID}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert(`Guide successfully assigned to Fair ${fairCode}.`);
        // Refresh assigned guides after successful update
        fetchAssignedGuides(fairCode);
        setPopupType(null); // Close the popup
      } else {
        const errorDetails = await response.json();
        console.error("Failed to assign guide:", errorDetails);
        alert("Failed to assign guide. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning guide:", error);
      alert("An error occurred while assigning the guide.");
    }
  };

  const handleDismiss = async (fairCode, guideUID) => {
    console.log("FAIR CODE DELETE: ", fairCode);
    console.log("GUIDE ID DELETE: ", guideUID);

    try {
      await fetch(`/api/schedule/fair/${fairCode}/guide/${guideUID}`, {
        method: "DELETE",
      });
      fetchAssignedGuides(fairCode);
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
    setPopupType(null);
  };

  const refresh = () => {
    window.location.reload();
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
                item.fairRegistrationCode || "N/A",
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
                    <strong>Fair Registration Code:</strong>{" "}
                    {selectedFair?.fairRegistrationCode || "N/A"}
                  </p>
                  <p>
                    <strong>School Name:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.school?.schoolName ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>City:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.school?.city?.name ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Distance to City:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.school?.city
                      ?.distance || "N/A"}{" "}
                    km
                  </p>
                  <p>
                    <strong>Date of Visit:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.time
                      ? new Date(
                          selectedFair.fairRegistirationInfo.time
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Supervisor Name:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.superVisorName ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Supervisor Duty:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.superVisorDuty ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Supervisor Phone:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo
                      ?.superVisorPhoneNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Supervisor Email:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo
                      ?.superVisorMailAddress || "N/A"}
                  </p>
                  <p>
                    <strong>Notes:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.notes || "N/A"}
                  </p>
                  <p>
                    <strong>Fair Type:</strong>{" "}
                    {selectedFair?.fairRegistirationInfo?.type || "N/A"}
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
                    arr={availableGuides.map(
                      (guide) => `${guide.name} ${guide.surname}`
                    )}
                    question="Select a guide to dismiss"
                    onChange={(selectedValue) => {
                      const selectedGuide = availableGuides.find(
                        (guide) =>
                          `${guide.name} ${guide.surname}` === selectedValue
                      ); // Find the guide by name + surname
                      if (selectedGuide) {
                        setDropdownValue(selectedGuide.id); // Set dropdownValue to the ID
                      }
                    }}
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
                    arr={assignedGuides.map(
                      (guide) => `${guide.name} ${guide.surname}`
                    )}
                    question="Select a guide to dismiss"
                    onChange={(selectedValue) => {
                      const selectedGuide = assignedGuides.find(
                        (guide) =>
                          `${guide.name} ${guide.surname}` === selectedValue
                      ); // Find the guide by name + surname
                      if (selectedGuide) {
                        setDropdownValue(selectedGuide.id); // Set dropdownValue to the ID
                      }
                    }}
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
                      onClick={() =>
                        handleDismiss(
                          selectedFair.fairRegistrationCode,
                          dropdownValue
                        )
                      }
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
