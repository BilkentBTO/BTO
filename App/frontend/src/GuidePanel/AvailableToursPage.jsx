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
  const [tourType, setTourType] = useState("school"); // Toggle state for tour type

  const schoolHeaders = ["Tour ID", "Date", "School", "Number of Visitors"];
  const individualHeaders = [
    "Tour ID",
    "Date",
    "Name",
    "Preferred Major",
    "Phone Number",
  ];

  const headers = tourType === "school" ? schoolHeaders : individualHeaders;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const apiEndpoint =
        tourType === "school"
          ? "/api/schedule/availabletours" // API for school tours
          : "/api/schedule/availableindividualtours"; // API for individual tours
      try {
        const response = await fetch(apiEndpoint);
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
  }, [tourType]);

  const handleRowClick = (rowData) => {
    console.log("DATA: ", data);

    // Different logic for school and individual tours
    const selectedTourData =
      tourType === "school"
        ? data.find((item) => item.tourRegistrationCode === rowData[0]) // For school tours
        : data.find(
            (item) => item.individualTourRegistrationCode === rowData[0]
          ); // For individual tours

    if (selectedTourData) {
      setSelectedTour(selectedTourData); // Track the clicked tour
      setShowPopup(true); // Show popup
    } else {
      console.error("No matching tour found for the selected row.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const UID = decodedToken["UID"];
        setGuideUID(UID || "Unknown");
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

    console.log("Selected Tour: ", selectedTour);

    // Define the endpoint and payload based on the tour type
    const endpoint =
      tourType === "school"
        ? "/api/apply/tour" // Endpoint for school tours
        : "/api/apply/individualtour"; // Endpoint for individual tours

    const payload =
      tourType === "school"
        ? {
            tourCode: selectedTour.tourRegistrationCode, // For school tours
            guideUID: guideUID, // Replace with the actual guide UID
          }
        : {
            individualTourCode: selectedTour.individualTourRegistrationCode, // For individual tours
            guideUID: guideUID, // Replace with the actual guide UID
          };

    console.log("Payload: ", payload);

    try {
      const response = await fetch(endpoint, {
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
        <HeaderPanelGlobal name={"Available Tours"} />
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
          <h1 className="availableToursHeading">
            Apply to {tourType === "school" ? "School" : "Individual"} Tours
          </h1>
          {isLoading ? (
            <p>Loading available tours...</p>
          ) : data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data.map((item) => {
                if (tourType === "school") {
                  return [
                    item.tourRegistrationCode || "N/A", // Tour ID
                    new Date(
                      item.tourRegistirationInfo?.time
                    ).toLocaleDateString() || "N/A", // Date
                    item.tourRegistirationInfo?.school?.schoolName || "N/A", // School
                    item.tourRegistirationInfo?.numberOfVisitors || "N/A", // Number of Visitors
                  ];
                } else {
                  return [
                    item.individualTourRegistrationCode || "N/A", // Tour ID for Individual
                    new Date(
                      item.tourRegistirationInfo?.time
                    ).toLocaleDateString() || "N/A", // Date
                    item.tourRegistirationInfo?.individualName || "N/A", // Name
                    item.tourRegistirationInfo?.individualMajor?.name || "N/A", // Preferred Major
                    item.tourRegistirationInfo?.individualPhoneNumber || "N/A", // Phone Number
                  ];
                }
              })}
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
                    {Object.entries(
                      tourType === "school"
                        ? {
                            "Tour ID":
                              selectedTour?.tourRegistrationCode || "N/A",
                            "School Name":
                              selectedTour?.tourRegistirationInfo?.school
                                ?.schoolName || "N/A",
                            Date: selectedTour?.tourRegistirationInfo?.time
                              ? new Date(
                                  selectedTour.tourRegistirationInfo?.time
                                ).toLocaleDateString()
                              : "N/A",
                            Time: selectedTour?.tourRegistirationInfo?.timeBlock
                              ?.time
                              ? new Date(
                                  selectedTour.tourRegistirationInfo.timeBlock.time
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })
                              : selectedTour?.tourRegistirationInfo?.time
                              ? new Date(
                                  selectedTour.tourRegistirationInfo.time
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })
                              : "N/A",
                            "Number of Visitors":
                              selectedTour?.tourRegistirationInfo
                                ?.numberOfVisitors || "N/A",
                            Notes:
                              selectedTour?.tourRegistirationInfo?.notes ||
                              "N/A",
                          }
                        : {
                            "Tour ID":
                              selectedTour?.individualTourRegistrationCode ||
                              "N/A",
                            Name:
                              selectedTour?.tourRegistirationInfo
                                ?.individualName || "N/A",
                            Surname:
                              selectedTour?.tourRegistirationInfo
                                ?.individualSurname || "N/A",
                            "Preferred Major":
                              selectedTour?.tourRegistirationInfo
                                ?.individualMajor?.name || "N/A",
                            "Phone Number":
                              selectedTour?.tourRegistirationInfo
                                ?.individualPhoneNumber || "N/A",
                            Email:
                              selectedTour?.tourRegistirationInfo
                                ?.individualMailAddress || "N/A",
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
                            Notes:
                              selectedTour?.tourRegistirationInfo?.notes ||
                              "N/A",
                          }
                    ).map(([key, value]) => (
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
