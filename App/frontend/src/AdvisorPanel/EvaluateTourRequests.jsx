import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EvaluateTourRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function renderNoDataTable(headers, message = "No Available Data") {
  return (
    <table className="noDataTable">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={headers.length} style={{ textAlign: "center" }}>
            {message}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
function EvaluateTourRequests() {
  const [headers] = useState(["Tour ID", "School", "State"]);
  const [popupHeaders] = useState([
    "Tour ID",
    "School Name",
    "Priority",
    "City",
    "Date of Visit",
    "Number of Visitors",
    "Supervisor Name",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Email",
    "Notes",
  ]);

  const [tableData, setTableData] = useState([]);
  const [completeData, setCompleteData] = useState([]);

  // New states for pending, accepted, and rejected requests
  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const fetchTourRequests = async () => {
    try {
      const response = await fetch("/api/register/tour/registrations");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const apiData = await response.json();
      // Update complete data for popups
      setTableData(apiData);
      setCompleteData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchAcceptedTourRequests = async () => {
    try {
      const response = await fetch("/api/register/tour/registrations/1");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const apiData = await response.json();
      console.log("ACCEPTED API: ", apiData);
      setAcceptedData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchRejectedTourRequests = async () => {
    try {
      const response = await fetch("/api/register/tour/registrations/2");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const apiData = await response.json();
      console.log("REJECTED API: ", apiData);
      setRejectedData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchPendingTourRequests = async () => {
    try {
      const response = await fetch("/api/register/tour/registrations/0");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const apiData = await response.json();
      console.log("PENDING API: ", apiData);
      setPendingData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTourRequests();
    fetchAcceptedTourRequests();
    fetchRejectedTourRequests();
    fetchPendingTourRequests();
  }, []);
  const headerKeyMap = {
    "Tour ID": "code",
    "School Name": "school.schoolName",
    Priority: "school.priority",
    City: "cityName",
    "Date of Visit": "dateOfVisit",
    "Number of Visitors": "numberOfVisitors",
    "Supervisor Name": "superVisorName",
    "Supervisor Duty": "superVisorDuty",
    "Supervisor Phone Number": "superVisorPhoneNumber",
    "Supervisor Email": "superVisorMailAddress",
    Notes: "notes",
  };

  const handleRowClick = (rowData) => {
    const tourId = String(rowData[0]);

    const completeRow = pendingData.find((row) => String(row.code) === tourId);
    console.log("TOUR ID: ", tourId);
    console.log("COMPLETE ROW: ", completeRow);

    if (completeRow) {
      setSelectedRow(completeRow);
      setPopupVisible(true);
    } else {
      console.error("No matching row found for tour ID:", tourId);
    }
  };

  const handleAcceptedRowClick = (rowData) => {
    const tourId = String(rowData[0]);
    console.log("ACCEPTED DATA: ", acceptedData);

    const completeRow = acceptedData.find((row) => String(row.code) === tourId);
    console.log("TOUR ID: ", tourId);
    console.log("COMPLETE ROW: ", completeRow);

    if (completeRow) {
      setSelectedRow(completeRow);
      setPopupVisible(true);
    } else {
      console.error("No matching row found for tour ID:", tourId);
    }
  };

  const refresh = () => {
    window.location.reload();
  };
  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
    fetchTourRequests(); // Refresh data
  };
  const updateData = (prevData, newRow, stateValue) => {
    // Check if the row already exists in the data
    const existingRowIndex = prevData.findIndex(
      (row) => row.code === newRow.code
    );

    // If the row exists, decide whether to update or leave it
    if (existingRowIndex !== -1) {
      if (prevData[existingRowIndex].state === stateValue) {
        // Row already has the same state, no need to update
        alert("This entry already exists with the same state.");
        return prevData;
      }

      // If the state changes, update the row's state
      const updatedData = [...prevData];
      updatedData[existingRowIndex].state = stateValue;
      console.log("Row state updated. Updated data array:", updatedData);
      return updatedData;
    }

    // If the row doesn't exist, add it as a new entry
    const updatedData = [...prevData, newRow];
    console.log("New row added. Updated data array:", updatedData);
    return updatedData;
  };
  const acceptPopup = async () => {
    const tourId = selectedRow.code; // Get the ID of the selected row
    try {
      await fetch(`/api/register/tour/accept?Code=${tourId}`, {
        method: "POST",
      });
      alert("Registration accepted!");

      // Remove the item from pending and add it to accepted
      setPendingData((prevData) =>
        prevData.filter((row) => row.code !== tourId)
      );
      setAcceptedData((prevData) => [
        ...prevData,
        { ...selectedRow, state: 1 }, // Add updated entry to acceptedData
      ]);
      refresh();
      setPopupVisible(false); // Close the popup after processing
    } catch (error) {
      console.error("Error accepting registration:", error);
    }
  };

  const rejectPopup = async () => {
    const tourId = selectedRow.code;
    try {
      await fetch(`/api/register/tour/reject?Code=${tourId}`, {
        method: "POST",
      });
      alert("Registration rejected!");

      // Update pendingData and rejectedData
      setPendingData((prevData) =>
        prevData.filter((row) => row.code !== tourId)
      ); // Remove from pending
      setRejectedData((prevData) =>
        updateData(prevData, { ...selectedRow, state: 2 }, 2)
      ); // Add or update in rejected

      closePopup();
      refresh();
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };
  const handleDelete = async (code) => {
    try {
      await fetch(`/api/Registration/DeleteRegistration?Code=${code}`, {
        method: "DELETE",
      });
      alert("Registration deleted!");
      fetchTourRequests();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  return (
    <div>
      <HeaderPanelGlobal name={"EVALUATE TOUR REQUESTS"} />
      <div className="evaluateTourRequests">
        {/* Pending Requests */}
        <h1 className="evaluateTourRequestsHeading">Pending Tour Requests</h1>
        {pendingData.length > 0 ? (
          <TableWithButtons
            headers={headers}
            data={pendingData.map((item) => [
              item.code,
              item.school?.schoolName || "N/A",
              "Pending",
            ])}
            onButtonClick={handleRowClick}
            buttonStyle={buttonStyle}
            buttonName="Decide"
          />
        ) : (
          renderNoDataTable(headers, "No Pending Tour Requests")
        )}

        {/* Accepted Requests */}
        <h1 className="evaluateTourRequestsHeading">Accepted Tour Requests</h1>
        {acceptedData.length > 0 ? (
          <TableWithButtons
            headers={headers}
            data={acceptedData.map((item) => [
              item.code,
              item.school?.schoolName || "N/A",
              "Accepted",
            ])}
            onButtonClick={handleAcceptedRowClick}
            buttonStyle={buttonStyle}
            buttonName="View"
          />
        ) : (
          renderNoDataTable(headers, "No Accepted Tour Requests")
        )}

        {/* Rejected Requests */}
        <h1 className="evaluateTourRequestsHeading">Rejected Tour Requests</h1>
        {rejectedData.length > 0 ? (
          <TableWithButtons
            headers={headers}
            data={rejectedData.map((item) => [
              item.code,
              item.school?.schoolName || "N/A",
              "Rejected",
            ])}
            onButtonClick={(row) => handleDelete(row[0])}
            buttonStyle={{ ...buttonStyle, backgroundColor: "red" }}
            buttonName="Delete"
          />
        ) : (
          renderNoDataTable(headers, "No Rejected Tour Requests")
        )}

        {/* Popup */}
        {/* Popup */}
        {popupVisible && selectedRow && (
          <div className="requestPopupOverlay">
            <div className="requestPopupContent">
              <h2>Tour Details</h2>
              <table className="popupTable">
                <tbody>
                  {popupHeaders.map((header, index) => {
                    const keyPath = headerKeyMap[header]; // Match header to object key
                    const value = keyPath
                      .split(".")
                      .reduce(
                        (acc, key) => (acc && acc[key] ? acc[key] : "N/A"),
                        selectedRow
                      );

                    return (
                      <tr key={index}>
                        <td>
                          <strong>{header}:</strong>
                        </td>
                        <td>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Conditional rendering for buttons */}
              {selectedRow.state === 1 ? ( // Accepted rows
                <button style={buttonStyle} onClick={closePopup}>
                  Close
                </button>
              ) : (
                // Pending rows
                <>
                  <button style={buttonStyle} onClick={acceptPopup}>
                    Approve
                  </button>
                  <button style={buttonStyle} onClick={rejectPopup}>
                    Reject
                  </button>
                  <button style={buttonStyle} onClick={closePopup}>
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EvaluateTourRequests;
