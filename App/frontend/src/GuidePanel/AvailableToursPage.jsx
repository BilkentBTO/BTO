import React, { useEffect, useState } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";
import "./AvailableToursPage.css";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AvailableToursPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [guideUID, setGuideUID] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const [selectedTour, setSelectedTour] = useState(null); // Selected tour data

  const headers = ["Tour ID", "Date", "School", "Number of Visitors"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/schedule/availableTours");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        console.log(apiData);
        setData(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (rowData) => {
    const selectedTourData = data.find(
      (item) => item.tourRegistrationCode === rowData[0]
    );
    setSelectedTour(selectedTourData); // Track the clicked tour
    setShowPopup(true); // Show popup
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

  const handleApply = async () => {
    if (!selectedTour) {
      alert("No tour selected to apply for.");
      return;
    }

    console.log("TOUR: ", selectedTour.code);

    const payload = {
      tourCode: selectedTour.tourRegistrationCode, // Pass the tour code from the selected tour
      guideUID: guideUID, // Replace with the actual guide UID from your app's state or context
    };

    try {
      const response = await fetch("/api/apply/tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Successfully applied to the tour!");
        setShowPopup(false);
      } else {
        const error = await response.json();
        console.error("Failed to apply for the tour:", error);
        alert(`Error: ${error.message || "Unable to apply for the tour."}`);
      }
    } catch (error) {
      console.error("Error applying for the tour:", error);
      alert("An error occurred while applying for the tour.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTour(null); // Clear selection
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

  const buttonName = "View";

  return (
    <div className="availableToursPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"GUIDE PANEL"} />
        <div>
          <h1 className="availableToursHeading">Available Tours</h1>
          {isLoading ? (
            <p>Loading available tours...</p>
          ) : data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data.map((item) => [
                item.tourRegistrationCode || "N/A", // Tour ID
                new Date(item.time).toLocaleDateString() || "N/A", // Date
                item.tourRegistirationInfo?.school?.schoolName || "N/A", // School
                item.tourRegistirationInfo?.numberOfVisitors || "N/A", // Number of Visitors
              ])}
              onButtonClick={handleRowClick}
              buttonStyle={buttonStyle}
              buttonName={buttonName}
            />
          ) : (
            <p>No available tours found.</p>
          )}
        </div>

        {/* Custom Popup */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h3>Tour Details</h3>
              {selectedTour ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                  }}
                >
                  <tbody>
                    {Object.entries({
                      "Tour ID": selectedTour?.tourRegistrationCode || "N/A",
                      "School Name":
                        selectedTour?.tourRegistirationInfo?.school
                          ?.schoolName || "N/A",
                      City:
                        selectedTour?.tourRegistirationInfo?.school?.city
                          ?.name || "N/A",
                      Date: selectedTour?.tourRegistirationInfo?.time
                        ? new Date(
                            selectedTour.tourRegistirationInfo.time
                          ).toLocaleDateString()
                        : "N/A",
                      Time: selectedTour?.tourRegistirationInfo?.time
                        ? new Date(
                            selectedTour.tourRegistirationInfo.time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A",
                      "Number of Visitors":
                        selectedTour?.tourRegistirationInfo?.numberOfVisitors ||
                        "N/A",
                      "Supervisor Name":
                        selectedTour?.tourRegistirationInfo?.superVisorName ||
                        "N/A",
                      "Supervisor Duty":
                        selectedTour?.tourRegistirationInfo?.superVisorDuty ||
                        "N/A",
                      "Supervisor Phone Number":
                        selectedTour?.tourRegistirationInfo
                          ?.superVisorPhoneNumber || "N/A",
                      "Supervisor Email":
                        selectedTour?.tourRegistirationInfo
                          ?.superVisorMailAddress || "N/A",
                      Notes:
                        selectedTour?.tourRegistirationInfo?.notes || "N/A",
                      "Priority Score":
                        selectedTour?.tourRegistirationInfo?.school?.priority ||
                        "N/A",
                      "Distance to City (km)":
                        selectedTour?.tourRegistirationInfo?.school?.city
                          ?.distance || "N/A",
                      Type: selectedTour?.tourRegistirationInfo?.type || "N/A",
                    }).map(([key, value]) => (
                      <tr key={key}>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            fontWeight: "bold",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          {key}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                          }}
                        >
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No details available.</p>
              )}
              <div className="popupActions">
                <button
                  onClick={handleApply}
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
                  Apply
                </button>
                <button
                  onClick={closePopup}
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

export default AvailableToursPage;
