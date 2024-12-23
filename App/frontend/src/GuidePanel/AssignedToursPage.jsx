import React, { useState, useEffect } from "react";
import "./AssignedToursPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AssignedToursPage() {
  const [data, setData] = useState([]);
  const [tourType, setTourType] = useState("school"); // Toggle state for tour type
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedTour, setSelectedTour] = useState(null); // State to track the selected tour

  const schoolHeaders = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Number of Visitors",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Quiz Code",
    "Notes",
  ];

  const individualHeaders = [
    "Tour ID",
    "Name",
    "Preferred Major",
    "Phone Number",
    "Email",
    "Date",
    "Time",
    "Notes",
  ];

  const headers = tourType === "school" ? schoolHeaders : individualHeaders;

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const UID = decodedToken["UID"];

        // Fetch data directly after setting the UID
        fetchData(UID);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate, tourType]);

  const fetchData = async (UID) => {
    try {
      const apiEndpoint =
        tourType === "school"
          ? `/api/user/${UID}/tour` // API for school tours
          : `/api/user/${UID}/individualTours`; // API for individual tours

      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiData = await response.json();
      console.log("API DATA: ", apiData);

      const toursArray = Array.isArray(apiData) ? apiData : [apiData];

      const transformedData = toursArray.map((item) => {
        if (tourType === "school") {
          return [
            item.tourRegistrationCode || "N/A", // Tour ID
            item.tourRegistirationInfo?.school?.schoolName || "N/A", // School Name
            item.tourRegistirationInfo?.cityName || "N/A", // City
            new Date(item.tourRegistirationInfo?.time).toLocaleDateString() ||
              "N/A", // Date
            new Date(item.tourRegistirationInfo?.time).toLocaleTimeString() ||
              "N/A", // Time
            item.tourRegistirationInfo?.numberOfVisitors || "N/A", // Number of Visitors
            item.tourRegistirationInfo?.superVisorName || "N/A", // Supervisor Name
            item.tourRegistirationInfo?.superVisorDuty || "N/A", // Supervisor Duty
            item.tourRegistirationInfo?.superVisorPhoneNumber || "N/A", // Supervisor Phone
            item.tourRegistirationInfo?.superVisorMailAddress || "N/A", // Supervisor Email
            item.quizCode || "N/A", // Quiz Code
            item.tourRegistirationInfo?.notes || "N/A", // Notes
          ];
        } else {
          return [
            item.tourRegistrationCode || "N/A", // Tour ID
            item.individualName || "N/A", // Name
            item.individualMajor?.name || "N/A", // Preferred Major
            item.individualPhoneNumber || "N/A", // Phone Number
            item.individualMailAddress || "N/A", // Email
            new Date(item.time).toLocaleDateString() || "N/A", // Date
            new Date(item.time).toLocaleTimeString() || "N/A", // Time
            item.notes || "N/A", // Notes
          ];
        }
      });

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching tours data:", error.message);
    }
  };

  const handleRowClick = () => {
    setSelectedTour(data); // Track the selected row
    setShowPopup(true); // Show confirmation popup
  };

  const confirmRemove = async () => {
    if (!selectedTour || !selectedTour[0]) {
      console.error("No tour selected or invalid tour data.");
      return;
    }
    const tourCode = selectedTour[0][0]; // Assuming the first column is the Tour ID
    console.log("TOUR CODE: ", tourCode);
    try {
      const response = await fetch(`/api/schedule/tour/${tourCode}/guide`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`Successfully canceled assignment for tour ${tourCode}.`);
        // Remove the canceled tour from the table
        setData((prevData) => prevData.filter((row) => row[0] !== tourCode));
        setShowPopup(false); // Close the popup
      } else {
        console.error(`Failed to cancel assignment: ${response.statusText}`);
        alert("Failed to cancel assignment. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling assignment:", error);
      alert("An error occurred while canceling the assignment.");
    }
  };

  const cancelRemove = () => {
    setShowPopup(false); // Close the popup
    setSelectedTour(null); // Clear the selected tour
  };

  return (
    <div className="assignedToursPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"Assigned Tours"} />
        <div className="toggleButtons">
          <button
            className={`toggleButton ${tourType === "school" ? "active" : ""}`}
            onClick={() => setTourType("school")}
          >
            School Tours
          </button>
          <button
            className={`toggleButton ${
              tourType === "individual" ? "active" : ""
            }`}
            onClick={() => setTourType("individual")}
          >
            Individual Tours
          </button>
        </div>
        <div>
          <h1 className="assignedToursHeading">
            Assigned {tourType === "school" ? "School" : "Individual"} Tours
          </h1>
          {data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data}
              onButtonClick={handleRowClick}
              buttonStyle={{
                padding: "8px 16px",
                backgroundColor: "gray",
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
              buttonName="Decide"
            />
          ) : (
            <p className="noDataText">
              No {tourType === "school" ? "School" : "Individual"} Tours
              Assigned
            </p>
          )}
        </div>
        {/* Confirmation Popup */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h3>Are you sure you want to remove this tour?</h3>
              <p>This action cannot be undone.</p>
              <div className="popupActions">
                <button
                  onClick={confirmRemove}
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
                >
                  Cancel Assignment
                </button>
                <button
                  onClick={cancelRemove}
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
                >
                  Tour Done
                </button>
                <button
                  onClick={cancelRemove}
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

export default AssignedToursPage;
