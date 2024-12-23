import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListAllUsers.css";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import FormDropDownGlobal from "../GlobalClasses/FormDropDownGlobal";

function ListAllUsers() {
  const headers = ["ID", "Name", "Surname", "EMail", "User Type"];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showManageAdvisorPopup, setShowManageAdvisorPopup] = useState(false);
  const [formData, setFormData] = useState({
    taskDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user");
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

  const today = new Date().toISOString().split("T")[0];
  const dateFilter = {
    min: today, // Disable past dates
  };

  const handleRowClick = async (userData) => {
    console.log("Selected User ID: ", userData[0]); // Assuming the first column contains the user ID

    try {
      // Fetch additional user details from the API
      const response = await fetch(`/api/user/${userData[0]}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }
      const detailedUserData = await response.json();

      console.log("Detailed User Data: ", detailedUserData);
      setSelectedUser({
        ...userData, // Preserve basic row data
        ...detailedUserData, // Merge with additional user details
      });
    } catch (error) {
      console.error("Error fetching user details: ", error.message);
      alert("Failed to fetch user details. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setSelectedUser(false);
    setShowManageAdvisorPopup(false);
  };

  const handleManageAdvisor = () => {
    setShowManageAdvisorPopup(true);
  };

  const handleCloseManageAdvisorPopup = () => {
    setShowManageAdvisorPopup(false);
  };

  const handlePromoteUser = async (id) => {
    // Build the request body with correct key names
    const payload = {
      id: id,
      userType: 4,
    };

    try {
      console.log("Payload being sent: ", JSON.stringify(payload));
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send fixed payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.title || "Failed to register user.");
      }

      // Navigate to success page
      console.log("Promotion successful");
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Registration failed: ${error.message}`);
    }
    handleClosePopup();
    refresh();
  };

  const handleDateChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      taskDate: value,
    }));
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });
      fetchTourRequests();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
    handleClosePopup();
    refresh();
  };

  const refresh = () => {
    window.location.reload();
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

  const getUserTypeString = (userType) => {
    switch (userType) {
      case 1:
        return "Admin";
      case 2:
        return "Coordinator";
      case 3:
        return "Advisor";
      case 4:
        return "Guide";
      case 5:
        return "Candidate Guide";
      default:
        return "Unknown";
    }
  };

  const assignTaskToAdvisor = async (advisorId, taskDate) => {
    const dayMapping = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
    };

    const dayValue = dayMapping[taskDate];

    console.log("ADVISOR ID: ", advisorId);
    console.log("TASK DATE ID: ", dayValue);
    try {
      console.log(
        `Assigning advisor ${advisorId} to ${taskDate} (Day: ${dayValue})`
      );
      const response = await fetch(
        `/api/user/${advisorId}/responsibleday/${dayValue}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert(
          `Successfully assigned ${taskDate} as the responsible day for Advisor ${advisorId}.`
        );
      } else {
        console.error("Failed to assign task:", response.statusText);
        alert("Failed to assign the task. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("An error occurred while assigning the task.");
    } finally {
      handleCloseManageAdvisorPopup(); // Close the popup
    }
  };

  return (
    <div className="listAllUsersPage">
      <GlobalSidebar />
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
        <div>
          <h1 className="listAllUsersHeading">List All Users</h1>
          {data.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={data.map((item) => [
                item.id || "N/A",
                item.name || "N/A",
                item.surname || "N/A",
                item.mail || "N/A",
                getUserTypeString(item.userType),
              ])}
              onButtonClick={(row) => {
                handleRowClick(row);
              }}
              buttonStyle={buttonStyle}
              buttonName="Manage"
            />
          ) : (
            <p className="noDataText">No Users</p>
          )}
        </div>

        {/* Main User Info Popup */}
        {/* Main User Info Popup */}
        {selectedUser && !showManageAdvisorPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>User Information</h2>
              <p>
                <strong>ID:</strong> {selectedUser.id || "N/A"}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser.name || "N/A"}
              </p>
              <p>
                <strong>Surname:</strong> {selectedUser.surname || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong>Work Hours:</strong> {selectedUser.workHours || "N/A"}
              </p>
              {["Admin", "Coordinator", "Advisor"].includes(
                selectedUser[4]
              ) && (
                <p>
                  <strong>Responsible Day:</strong>{" "}
                  {selectedUser.responsibleDay || "Not Assigned"}
                </p>
              )}

              <div className="popupActions">
                {(selectedUser[4] === "Guide" ||
                  selectedUser[4] === "Advisor" ||
                  selectedUser[4] === "Candidate Guide") && (
                  <button
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
                    onClick={() => handleDeleteUser(selectedUser[0])}
                  >
                    Delete User
                  </button>
                )}

                {selectedUser[4] === "Advisor" && (
                  <button
                    style={{
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
                      transition:
                        "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    onClick={handleManageAdvisor}
                  >
                    Manage Advisor
                  </button>
                )}

                {selectedUser[4] === "Candidate Guide" && (
                  <button
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
                    onClick={() => handlePromoteUser(selectedUser[0])}
                  >
                    Promote
                  </button>
                )}

                <button
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
            </div>
          </div>
        )}

        {/* Manage Advisor Popup */}
        {/* Manage Advisor Popup */}
        {/* Manage Advisor Popup */}
        {showManageAdvisorPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Manage Advisor</h2>
              <p>
                <strong>Name:</strong> {selectedUser[0]} {/* Advisor Name */}
              </p>
              <p>
                <strong>Surname:</strong> {selectedUser[1]}{" "}
                {/* Advisor Surname */}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser[2]}{" "}
                {/* Advisor Username */}
              </p>

              {/* Dropdown for Date Selection */}
              <FormDropDownGlobal
                arr={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]} // Directly use day names
                question="Select a Task Date"
                onChange={(selectedValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    taskDate: selectedValue, // Update formData with selected day
                  }))
                }
              />

              <div className="popupActions">
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                  }}
                  onClick={() =>
                    assignTaskToAdvisor(selectedUser[0], formData.taskDate)
                  } // Call the modular method
                  disabled={!formData.taskDate} // Disable if no date is selected
                >
                  Assign
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "grey",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                  }}
                  onClick={handleCloseManageAdvisorPopup}
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

export default ListAllUsers;
