import React, { useState } from "react";
import "./ListCoordinatorsPage.css";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function ListCoordinatorsPage() {
  const headers = ["Name", "Surname", "Username", "Email"];
  const coordinators = [
    ["Alice", "Johnson", "alicej", "alice.johnson@example.com"],
    ["Bob", "Smith", "bobsmith", "bob.smith@example.com"],
    ["Charlie", "Brown", "charlieb", "charlie.brown@example.com"],
  ];

  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  const handleRowClick = (coordinatorData) => {
    setSelectedCoordinator(coordinatorData);
  };

  const handleClosePopup = () => {
    setSelectedCoordinator(null);
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
    <div className="listAllUsers">
      <GlobalSidebar />
      <div className="rightSideAdminFunction">
        <HeaderPanelGlobal name={"ADMIN PANEL"} />
        <div>
          <h1 className="listAllUsersHeading">List All Coordinators</h1>
          <TableWithButtons
            headers={headers}
            data={coordinators}
            onButtonClick={(row) => handleRowClick(row)}
            buttonStyle={buttonStyle}
            buttonName="Manage"
          />
        </div>

        {/* Coordinator Information Popup */}
        {selectedCoordinator && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Coordinator Information</h2>
              <p>
                <strong>Name:</strong> {selectedCoordinator[0]}
              </p>
              <p>
                <strong>Surname:</strong> {selectedCoordinator[1]}
              </p>
              <p>
                <strong>Username:</strong> {selectedCoordinator[2]}
              </p>
              <p>
                <strong>Email:</strong> {selectedCoordinator[3]}
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
                  onClick={() =>
                    alert(`Deleted coordinator: ${selectedCoordinator[2]}`)
                  }
                >
                  Delete Coordinator
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
                  className="closeButton"
                  onClick={handleClosePopup}
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

export default ListCoordinatorsPage;
