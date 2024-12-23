import React, { useState, useEffect } from "react";
import "./ToursResponsibleByGuides.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import profileImage from "../assets/profile_image.png";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import Table from "../GlobalClasses/Table";

function ToursResponsibleByGuides() {
  // State to manage popup visibility and data
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [guides, setGuides] = useState([]);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [tourType, setTourType] = useState("school"); // Toggle state for tour type
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(() => {
    return (
      location?.state?.formData || {
        guideId: "",
        guideName: "",
        name: "",
        surname: "",
        mail: "",
        bilkentID: "",
        majorCode: "",
        major: "",
        currentYear: "",
        workHours: "",
        userType: "",
      }
    );
  });
  const [selectedGuideDetails, setSelectedGuideDetails] = useState(() => {
    return (
      location?.state?.formData || {
        guideId: "",
        guideName: "",
        name: "",
        surname: "",
        mail: "",
        bilkentID: "",
        majorCode: "",
        major: "",
        currentYear: "",
        workHours: "",
        userType: "",
      }
    );
  });

  const schoolHeaders = ["Tour ID", "Date", "School", "Number of Visitors"];
  const individualHeaders = [
    "Tour ID",
    "Date",
    "Name",
    "Preferred Major",
    "Phone Number",
  ];

  const headers = tourType === "school" ? schoolHeaders : individualHeaders;

  const [tableData, setTableData] = useState([]);
  const [tableIndvData, setTableIndvData] = useState([]);

  const handleRowClick = (rowData, guideFullName) => {
    // Set the selected row and show popup
    setSelectedRow(rowData);

    const fetchAvailableGuidesForEvent = async (eventCode) => {
      try {
        const availableGuidesResponse = await fetch(
          `/api/schedule/available/guide?eventCode=${eventCode}`
        );
        if (!availableGuidesResponse.ok) {
          throw new Error(
            `Failed to fetch available guides for event ${eventCode}: ${availableGuidesResponse.status}`
          );
        }
        const availableGuidesData = await availableGuidesResponse.json();
        console.log(
          `Available Guides for Event ${eventCode}:`,
          availableGuidesData
        );
        return availableGuidesData; // Return the available guides
      } catch (error) {
        console.error("Error fetching available guides:", error);
        return [];
      }
    };

    // Example usage for a specific event code
    const fetchAndSetAvailableGuides = async () => {
      const eventCode = rowData[0]; // Replace with actual eventCode
      const availableGuides = await fetchAvailableGuidesForEvent(eventCode);
      setAvailableGuides(availableGuides); // Update the state with available guides
    };

    // Find the guide using the full name

    if (guideFullName != "Unassigned Unassigned") {
      const guideDetails = users.find(
        (guide) => `${guide.name} ${guide.surname}` === guideFullName
      );
      console.log("GUIDE DETAILS: ", guideDetails);
      console.log("ROW DATA: ", rowData);
      // Set the selected guide details
      setSelectedGuideDetails({
        guideId: guideDetails.id || "N/A",
        guideName: guideDetails.name || "N/A",
        surname: guideDetails.surname || "N/A",
        mail: guideDetails.mail || "N/A",
        bilkentID: guideDetails.bilkentID || "N/A",
        majorCode: guideDetails.major?.id || "N/A",
        major: guideDetails.major?.name || "N/A",
        currentYear: guideDetails.currentYear || "N/A",
        workHours: guideDetails.workHours || "N/A",
        userType: guideDetails.userType || "N/A",
      });
    }
    console.log("ROW DATA: ", rowData);

    fetchAndSetAvailableGuides();
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedRow(null);
  };
  useEffect(() => {
    console.log("GUIDES Updated: ", guides);
  }, [guides]);
  const saveChanges = async () => {
    if (!selectedRow) return;
    const tourCode = selectedRow[0];
    console.log("FORM DATA: ", formData);
    if (!formData.guideId) {
      alert("Please select a valid guide.");
      return;
    }

    try {
      const response = await fetch(
        `/api/schedule/tour/${tourCode}/guide/${formData.guideId}`,
        { method: "PUT" }
      );

      if (response.ok) {
        alert(
          `Successfully assigned ${formData.guideName} to tour ${tourCode}.`
        );
        setIsPopupVisible(false);
        window.location.reload();
      } else {
        console.error("Failed to assign guide:", response.statusText);
        alert("Failed to assign guide. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning guide:", error);
      alert("An error occurred while assigning the guide.");
    }
  };
  useEffect(() => {
    // Fetch tours and guides data from the API
    const fetchToursAndUsers = async () => {
      try {
        console.log("CALLED AND TYPE: ", tourType);
        if (tourType === "school") {
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
        } else {
          const response = await fetch("/api/schedule/individualtours");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const apiData = await response.json();
          console.log("APİ DATA: ", apiData);

          setTableIndvData(apiData);
        }
      } catch (error) {
        console.error("Error fetching tours and user details:", error);
      }
    };
    const fetchAllUsers = async () => {
      try {
        const usersResponse = await fetch("/api/user");
        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        console.log("Fetched Users:", usersData); // Debugging
        setUsers(usersData); // Store all users in `guides`
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const fetchGuides = async () => {
      try {
        const guidesResponse = await fetch("/api/user/filter/4");
        if (!guidesResponse.ok) {
          throw new Error(`Failed to fetch guides: ${guidesResponse.status}`);
        }
        const guidesData = await guidesResponse.json();
        setGuides(guidesData);
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };

    fetchAllUsers();
    fetchGuides();
    fetchToursAndUsers();
  }, [tourType]);
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

  const handleFormChange = (guideName) => {
    const guideProfile = guides.find(
      (guide) => `${guide.name} ${guide.surname}` === guideName
    );

    if (guideProfile) {
      console.log("GUIDE: ", guideProfile);
      setFormData({
        guideId: guideProfile.id || "N/A",
        guideName: guideProfile.name || "N/A",
        surname: guideProfile.surname || "N/A",
        mail: guideProfile.mail || "N/A",
        bilkentID: guideProfile.bilkentID || "N/A",
        majorCode: guideProfile.major?.id || "N/A",
        major: guideProfile.major?.name || "N/A",
        currentYear: guideProfile.currentYear || "N/A",
        workHours: guideProfile.workHours || "N/A",
        userType: guideProfile.userType || "N/A",
      });
    }
    console.log("FORM DATA: ", formData);
  };
  const buttonName = "Edit";
  useEffect(() => {
    console.log("useEffect called due to tourType change:", tourType);
    // Your fetch logic here
  }, [tourType]);
  return (
    <div className="toursResponsibleByGuidesPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"Tours Responsible By Guides"} />
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
            Tours and Corresponding Tours Guides
          </h1>
          {tourType === "school" ? (
            tableData.length > 0 ? (
              <>
                {console.log(
                  "Rendering TableWithButtons with data:",
                  tableData
                )}
                <TableWithButtons
                  headers={headers}
                  data={tableData}
                  onButtonClick={(rowData) =>
                    handleRowClick(rowData, `${rowData[1]} ${rowData[2]}`)
                  }
                  buttonStyle={buttonStyle} // Pass custom button style
                  buttonName={buttonName}
                />
              </>
            ) : (
              <p>No tours assigned to guides yet.</p>
            )
          ) : (
            <Table
              headers={headers}
              data={tableIndvData.map((item) => [
                item.individualTourRegistrationCode || "N/A",
                new Date(
                  item.tourRegistirationInfo?.time
                ).toLocaleDateString() || "N/A",
                item.tourRegistirationInfo?.individualName || "N/A",
                item.tourRegistirationInfo?.individualSurname || "N/A",
                item.tourRegistirationInfo?.individualMajor?.name || "N/A",
              ])}
            />
          )}{" "}
          {/* Replace with null or some other JSX for the else case */}
        </div>

        {/* Popup Modal */}
        {/* Popup Modal */}
        {isPopupVisible && (
          <div className="popupOverlayCompare toursGuidePopup">
            <div className="popupContentCompare">
              <h2>Change Guides</h2>
              <p>
                <strong>Tour:</strong> {selectedRow[0]}
              </p>
              <h3>New Guide</h3>
              <FormDropDownGlobal
                arr={availableGuides.map(
                  (guide) => `${guide.name} ${guide.surname}`
                )}
                question="Select a Guide"
                onChange={handleFormChange}
              />
              <div className="comparisonTables">
                {/* Left Table: Current Guide */}
                <div className="tableSectionCompare">
                  <h3>Current Guide</h3>
                  {selectedGuideDetails ? (
                    <table className="comparisonTable">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name:</strong>
                          </td>
                          <td>{selectedGuideDetails.guideName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Surname:</strong>
                          </td>
                          <td>{selectedGuideDetails.surname}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Username:</strong>
                          </td>
                          <td>{selectedGuideDetails.mail}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Bilkent ID:</strong>
                          </td>
                          <td>{selectedGuideDetails.bilkentID || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Major Code:</strong>
                          </td>
                          <td>{selectedGuideDetails.majorCode || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Major:</strong>
                          </td>
                          <td>{selectedGuideDetails.major || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Current Year:</strong>
                          </td>
                          <td>{selectedGuideDetails.currentYear || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Work Hours:</strong>
                          </td>
                          <td>{selectedGuideDetails.workHours || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>User Type:</strong>
                          </td>
                          <td>{selectedGuideDetails.userType || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>No guide selected</p>
                  )}
                </div>

                {/* Right Table: New Guide */}
                <div className="tableSectionCompare">
                  <h3>Selected Guide</h3>
                  {formData.guideId && (
                    <table className="comparisonTable">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name:</strong>
                          </td>
                          <td>{formData.guideName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Surname:</strong>
                          </td>
                          <td>{formData.surname}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Username:</strong>
                          </td>
                          <td>{formData.mail}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Bilkent ID:</strong>
                          </td>
                          <td>{formData.bilkentID}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Major Code:</strong>
                          </td>
                          <td>{formData.majorCode}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Major:</strong>
                          </td>
                          <td>{formData.major}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Current Year:</strong>
                          </td>
                          <td>{formData.currentYear}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Work Hours:</strong>
                          </td>
                          <td>{formData.workHours}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>User Type:</strong>
                          </td>
                          <td>{formData.userType}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="popupActionsCompare">
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
