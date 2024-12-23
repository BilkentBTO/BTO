import React, { useState, useEffect } from "react";
import "./AssignedFairsPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AssignedFairsPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedFair, setSelectedFair] = useState(null); // State to track the selected fair

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
  }, [navigate]);

  const fetchData = async (UID) => {
    try {
      const response = await fetch(`/api/user/${UID}/fair`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiData = await response.json();
      console.log("API DATA: ", apiData);

      const fairsArray = Array.isArray(apiData) ? apiData : [apiData];

      const transformedData = fairsArray.map((item) => [
        item.fairRegistrationCode || "N/A", // Fair ID
        item.fairRegistirationInfo?.school?.schoolName || "N/A", // School Name
        item.fairRegistirationInfo?.cityName || "N/A", // City
        new Date(item.fairRegistirationInfo?.time).toLocaleDateString() ||
          "N/A", // Date
        new Date(item.fairRegistirationInfo?.time).toLocaleTimeString() ||
          "N/A", // Time
        item.fairRegistirationInfo?.superVisorName || "N/A", // Supervisor Name
        item.fairRegistirationInfo?.superVisorDuty || "N/A", // Supervisor Duty
        item.fairRegistirationInfo?.superVisorPhoneNumber || "N/A", // Supervisor Phone
        item.fairRegistirationInfo?.superVisorMailAddress || "N/A", // Supervisor Email
        item.fairRegistirationInfo?.notes || "N/A", // Notes
      ]);

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching fairs data:", error.message);
    }
  };

  const handleRowClick = (rowIndex) => {
    setSelectedFair(data[rowIndex]); // Track the selected row
    setShowPopup(true); // Show confirmation popup
  };

  const confirmRemove = async () => {
    if (!selectedFair || !selectedFair[0]) {
      console.error("No fair selected or invalid fair data.");
      return;
    }
    const fairCode = selectedFair[0]; // Assuming the first column is the Fair ID
    try {
      const response = await fetch(`/api/schedule/fair/${fairCode}/guide`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`Successfully canceled assignment for fair ${fairCode}.`);
        // Remove the canceled fair from the table
        setData((prevData) => prevData.filter((row) => row[0] !== fairCode));
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
    setSelectedFair(null); // Clear the selected fair
  };

  return (
    <div className="assignedFairsPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"Assigned Fairs"} />
        <div>
          <h1 className="assignedFairsHeading">Your Fairs</h1>
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
            <p className="noDataText">No Fairs Assigned</p>
          )}
        </div>
        {showPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h3>Are you sure you want to remove this fair assignment?</h3>
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
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignedFairsPage;
