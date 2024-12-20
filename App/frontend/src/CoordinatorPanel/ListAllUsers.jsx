import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListAllUsers.css";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import FormInputGlobal from "../GlobalClasses/FormInputGlobal";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ListAllUsers() {
  const headers = ["Name", "Surname", "Username", "User Type"];
  const data = [
    ["Can", "Kütükoğlu", "spritewithice", "Coordinator"],
    ["Ege", "Ertem", "ege04", "Advisor"],
    ["Bora", "Akoğuz", "boraborabora", "Candidate Guide"],
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [showManageAdvisorPopup, setShowManageAdvisorPopup] = useState(false);
  const [formData, setFormData] = useState({
    taskDate: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const dateFilter = {
    min: today, // Disable past dates
  };

  const handleRowClick = (userData) => {
    setSelectedUser(userData);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
    setShowManageAdvisorPopup(false);
  };

  const handleManageAdvisor = () => {
    setShowManageAdvisorPopup(true);
  };

  const handleCloseManageAdvisorPopup = () => {
    setShowManageAdvisorPopup(false);
  };

  const handleAssignDateClick = () => {
    alert(`Task assigned to ${selectedUser[2]} on ${formData.taskDate}`);
    handleCloseManageAdvisorPopup();
  };

  const handlePromoteUser = () => {
    alert(`User ${selectedUser[2]} has been promoted!`);
  };

  const handleDateChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      taskDate: value,
    }));
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

  return (
    <div className="listAllUsersPage">
      <GlobalSidebar />
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
        <div>
          <h1 className="listAllUsersHeading">List All Users</h1>
          <TableWithButtons
            headers={headers}
            data={data}
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
            buttonName="Manage"
          />
        </div>

        {/* Main User Info Popup */}
        {selectedUser && !showManageAdvisorPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>User Information</h2>
              <p>
                <strong>Name:</strong> {selectedUser[0]}
              </p>
              <p>
                <strong>Surname:</strong> {selectedUser[1]}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser[2]}
              </p>
              <p>
                <strong>User Type:</strong> {selectedUser[3]}
              </p>
              <div className="popupActions">
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
                  onClick={() => alert(`Deleted user: ${selectedUser[2]}`)}
                >
                  Delete User
                </button>
                {selectedUser[3] === "Advisor" && (
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
                {selectedUser[3] === "Candidate Guide" && (
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
                    onClick={handlePromoteUser}
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
        {showManageAdvisorPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Manage Advisor</h2>
              <p>
                <strong>Name:</strong> {selectedUser[0]}
              </p>
              <p>
                <strong>Surname:</strong> {selectedUser[1]}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser[2]}
              </p>

              {/* Date Input for Task Assignment */}
              <FormInputGlobal
                question="Task Date*"
                type="date"
                value={formData.taskDate}
                onChange={handleDateChange}
                dateFilter={dateFilter}
              />

              <div className="popupActions">
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
                  onClick={handleAssignDateClick}
                  disabled={!formData.taskDate}
                >
                  Assign
                </button>
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
