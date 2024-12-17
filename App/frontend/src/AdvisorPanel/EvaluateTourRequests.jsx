import React, { useState, useEffect } from "react";
import "./EvaluateTourRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";

function EvaluateTourRequests() {
  const [headers] = useState([
    "Tour ID",
    "School",
    "City",
    "Date",
    "Number of Visitors",
    "Supervisor Name",
  ]);

  const [popupHeaders] = useState([
    "Tour ID",
    "School Name",
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
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  };

  const buttonName = "Decide";

  useEffect(() => {
    const fetchTourRequests = async () => {
      try {
        const response = await fetch("/api/Registration/GetAllRegistrations");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const apiData = await response.json();

        // Map data for the table (simplified table data)
        const simplifiedData = apiData.map((item) => [
          item.code,
          item.schoolName || "N/A",
          item.cityName || "N/A",
          item.dateOfVisit.split("T")[0],
          item.numberOfVisitors || "N/A",
          item.superVisorName || "N/A",
        ]);

        // Detailed data for the popup
        const detailedData = apiData.map((item) => [
          item.code,
          item.schoolName || "N/A",
          item.cityName || "N/A",
          item.dateOfVisit.split("T")[0],
          item.numberOfVisitors || "N/A",
          item.superVisorName || "N/A",
          item.superVisorDuty || "N/A",
          item.superVisorPhoneNumber || "N/A",
          item.superVisorMailAddress || "N/A",
          item.notes || "N/A",
        ]);

        // Update tableData and completeData
        setTableData(simplifiedData);
        setCompleteData(detailedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTourRequests();
  }, []); // Fetch data only on component mount

  const handleRowClick = (rowData) => {
    const tourId = rowData[0];
    const completeRow = completeData.find((row) => row[0] === tourId);
    setSelectedRow(completeRow);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
  };

  return (
    <div className="evaluateTourRequests">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <h1 className="evaluateTourRequestsHeading">Evaluate Tour Requests</h1>

      {/* Ensure that updated tableData is passed to the TableWithButtons */}
      {tableData.length > 0 ? (
        <TableWithButtons
          headers={headers}
          data={tableData}
          onButtonClick={handleRowClick}
          buttonStyle={buttonStyle}
          buttonName={buttonName}
        />
      ) : (
        <p>Loading table data...</p>
      )}

      {/* Popup for detailed view */}
      {popupVisible && selectedRow && (
        <div className="requestPopupOverlay">
          <div className="requestPopupContent">
            <h2>Tour Details</h2>
            <table className="popupTable">
              <tbody>
                {popupHeaders.map((header, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{header}:</strong>
                    </td>
                    <td>{selectedRow[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={buttonStyle} onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvaluateTourRequests;
