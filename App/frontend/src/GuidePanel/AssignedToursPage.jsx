import React, { useState, useEffect } from "react";
import "./AssignedToursPage.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import profileImage from "../assets/profile_image.png";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AssignedToursPage() {
  const [guideUID, setGuideUID] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedTour, setSelectedTour] = useState(null); // State to track the selected tour

  const headers = [
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
    "Notes",
  ];

  const buttonStyle = {
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
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log(token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token

        // Extract the name claim
        const UID = decodedToken["UID"];
        setGuideUID(UID || "Unknown");

        // Extract the role claim (adjust based on your JWT structure)

        console.log("Decoded Token:", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${guideUID}/tour`);
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

  const buttonName = "Remove";

  const handleRemoveClick = (rowIndex) => {
    setSelectedTour(data[rowIndex]); // Track the selected row
    setShowPopup(true); // Show confirmation popup
  };

  const confirmRemove = () => {
    console.log("Removed:", selectedTour); // Perform removal action here
    setShowPopup(false); // Close the popup
  };
  const cancelRemove = () => {
    setShowPopup(false); // Close the popup
    setSelectedTour(null); // Clear the selected tour
  };

  return (
    <div className="assignedToursPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"GUIDE PANEL"} />
        <div>
          <h1 className="assignedToursHeading">Assigned Tours</h1>
          {data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data.map((item) => [
                item.tourRegistrationCode || "N/A", // Tour ID
                new Date(item.time).toLocaleDateString() || "N/A", // Date
                item.tourRegistirationInfo?.school?.schoolName || "N/A", // School
                item.tourRegistirationInfo?.numberOfVisitors || "N/A", // Number of Visitors
              ])}
              onButtonClick={handleRemoveClick} // Pass row index to the handler
              buttonStyle={buttonStyle}
              buttonName={buttonName}
            />
          ) : (
            <p className="noDataText">No Users</p>
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
                  Remove
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
