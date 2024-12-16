import React, { useState } from "react";
import "../CoordinatorPanel/ListAllUsers.css"; // Reuse the existing styles
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
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  };

  return (
    <div className="listAllUsers">
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
        <div className="popup">
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
          <div className="popupButtons">
            <button
              style={buttonStyle}
              onClick={() =>
                alert(`Deleted coordinator: ${selectedCoordinator[2]}`)
              }
            >
              Delete Coordinator
            </button>
            <button className="closeButton" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListCoordinatorsPage;
