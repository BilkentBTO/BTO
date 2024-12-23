import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EvaluateTourRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import TableWithButtonConflict from "../GlobalClasses/TableWithButtonConflict";

function SchoolPopup({ selectedRow, onClose, onAccept, onReject, onDelete }) {
  const schoolHeaders = [
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
  ];

  const schoolKeyMap = {
    "Tour ID": "code",
    "School Name": "school.schoolName",
    Priority: "school.priority",
    City: "cityName",
    "Date of Visit": "timeBlock.time",
    "Number of Visitors": "numberOfVisitors",
    "Supervisor Name": "superVisorName",
    "Supervisor Duty": "superVisorDuty",
    "Supervisor Phone Number": "superVisorPhoneNumber",
    "Supervisor Email": "superVisorMailAddress",
    Notes: "notes",
  };

  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h2>School Tour Details</h2>
        <table className="popupTable">
          <tbody>
            {schoolHeaders.map((header, index) => {
              const keyPath = schoolKeyMap[header];
              const value = keyPath
                .split(".")
                .reduce(
                  (acc, key) =>
                    acc && acc[key] !== undefined ? acc[key] : "N/A",
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
        <div className="popupActions">
          {selectedRow.state === 0 && (
            <>
              <button onClick={onAccept} className="popupButton green">
                Approve
              </button>
              <button onClick={onReject} className="popupButton red">
                Reject
              </button>
            </>
          )}
          <button onClick={onClose} className="popupButton blue">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function IndividualPopup({
  selectedRow,
  onClose,
  onAccept,
  onReject,
  onDelete,
}) {
  const individualHeaders = [
    "Individual ID",
    "Name",
    "Surname",
    "City",
    "Date of Visit",
    "Number of Visitors",
    "Supervisor Name",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Email",
    "Notes",
    "Preferred Visit Time",
    "Major",
  ];

  const individualKeyMap = {
    "Individual ID": "code",
    Name: "individualName",
    Surname: "individualSurname",
    City: "cityName", // Adjust if this exists
    "Date of Visit": "time",
    "Number of Visitors": "numberOfVisitors", // Adjust if individual-specific
    "Supervisor Name": "superVisorName", // Adjust if individual-specific
    "Supervisor Duty": "superVisorDuty", // Adjust if individual-specific
    "Supervisor Phone Number": "individualPhoneNumber",
    "Supervisor Email": "individualMailAddress",
    Notes: "notes",
    "Preferred Visit Time": "preferredVisitTime",
    Major: "individualMajor.name",
  };

  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h2>Individual Tour Details</h2>
        <table className="popupTable">
          <tbody>
            {individualHeaders.map((header, index) => {
              const keyPath = individualKeyMap[header];
              const value = keyPath
                .split(".")
                .reduce(
                  (acc, key) =>
                    acc && acc[key] !== undefined ? acc[key] : "N/A",
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
        <div className="popupActions">
          {selectedRow.state === 0 && (
            <>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  margin: "4px",
                }}
                onClick={onAccept}
              >
                Approve
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  margin: "4px",
                }}
                onClick={onReject}
              >
                Reject
              </button>
            </>
          )}
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "grey",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              margin: "4px",
            }}
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              margin: "4px",
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function EvaluateTourRequests() {
  const [headers] = useState(["Tour ID", "School", "State"]);
  const [headersIndv] = useState([
    "Tour ID",
    "Name",
    "Preferred Major",
    "State",
  ]);
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

  const [selectedType, setSelectedType] = useState("school");

  // New states for pending, accepted, and rejected requests
  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const [pendingIndvData, setPendingIndvData] = useState([]);
  const [acceptedIndvData, setAcceptedIndvData] = useState([]);
  const [rejectedIndvData, setRejectedIndvData] = useState([]);

  const [popupIndvVisible, setPopupIndvVisible] = useState(false);
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

  const fetchSchoolData = async () => {
    // Fetch data for school requests
    try {
      const pending = await fetch("/api/register/tour/registrations/0").then(
        (res) => res.json()
      );
      const accepted = await fetch("/api/register/tour/registrations/1").then(
        (res) => res.json()
      );
      const rejected = await fetch("/api/register/tour/registrations/2").then(
        (res) => res.json()
      );

      // Process the combined Pending and Accepted data
      const processedData = processCombinedTourData(pending, accepted);

      // Separate processed data back into pending and accepted
      const updatedPendingData = processedData.filter((tour) =>
        pending.some((pendingItem) => pendingItem.code === tour.code)
      );

      const updatedAcceptedData = processedData.filter((tour) =>
        accepted.some((acceptedItem) => acceptedItem.code === tour.code)
      );

      // Update state with processed data
      setPendingData(updatedPendingData);
      setAcceptedData(updatedAcceptedData);
      setRejectedData(rejected);
    } catch (error) {
      console.error("Error fetching school data:", error);
    }
  };

  const fetchIndividualData = async () => {
    // Fetch data for individual requests
    try {
      const pending = await fetch(
        "/api/register/individual/registrations/0"
      ).then((res) => res.json());
      const accepted = await fetch(
        "/api/register/individual/registrations/1"
      ).then((res) => res.json());
      const rejected = await fetch(
        "/api/register/individual/registrations/2"
      ).then((res) => res.json());
      setPendingIndvData(pending);
      setAcceptedIndvData(accepted);
      setRejectedIndvData(rejected);
    } catch (error) {
      console.error("Error fetching individual data:", error);
    }
  };

  useEffect(() => {
    if (selectedType === "school") {
      fetchSchoolData();
    } else {
      fetchIndividualData();
    }
  }, [selectedType]);

  const headerKeyMap = {
    "Tour ID": "code",
    "School Name": "school.schoolName",
    Priority: "school.priority",
    City: "cityName",
    "Date of Visit": "timeBlock.time",
    "Number of Visitors": "numberOfVisitors",
    "Supervisor Name": "superVisorName",
    "Supervisor Duty": "superVisorDuty",
    "Supervisor Phone Number": "superVisorPhoneNumber",
    "Supervisor Email": "superVisorMailAddress",
    Notes: "notes",
  };

  const [conflictPopupVisible, setConflictPopupVisible] = useState(false);
  const [selectedConflictId, setSelectedConflictId] = useState(null);
  const [conflictingTours, setConflictingTours] = useState([]);
  const [selectedTours, setSelectedTours] = useState([]);
  const handleRowClick = (rowData, isConflict, conflictId) => {
    if (isConflict) {
      // Filter tours with the same conflictId
      const conflictingTours = [...pendingData, ...acceptedData].filter(
        (tour) => tour.conflictId === conflictId
      );

      setSelectedConflictId(conflictId);
      setConflictingTours(conflictingTours);
      setConflictPopupVisible(true);
    } else {
      const tourId = String(rowData[0]);
      const completeRow = pendingData.find(
        (row) => String(row.code) === tourId
      );

      if (completeRow) {
        setSelectedRow(completeRow);
        setPopupVisible(true);
      } else {
        console.error("No matching row found for tour ID:", tourId);
      }
    }
  };
  const handleIndvRowClick = (rowData, isConflict, conflictId) => {
    const tourId = String(rowData[0]);
    const completeRow = pendingIndvData.find(
      (row) => String(row.code) === tourId
    );

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
  const handleAcceptedIndvRowClick = (rowData) => {
    const tourId = String(rowData[0]);
    console.log("ACCEPTED DATA: ", acceptedData);

    const completeRow = acceptedIndvData.find(
      (row) => String(row.code) === tourId
    );
    console.log("TOUR ID: ", tourId);
    console.log("COMPLETE ROW: ", completeRow);

    if (completeRow) {
      setSelectedRow(completeRow);
      setPopupVisible(true);
    } else {
      console.error("No matching row found for tour ID:", tourId);
    }
  };
  const acceptIndvPopup = async () => {
    const tourId = selectedRow.code;
    try {
      await fetch(`/api/register/individual/accept?Code=${tourId}`, {
        method: "POST",
      });

      setPendingIndvData((prev) => prev.filter((item) => item.code !== tourId));
      setAcceptedIndvData((prev) => [...prev, { ...selectedRow, state: 1 }]);
      closePopup();
    } catch (error) {
      console.error("Error accepting individual registration:", error);
    }
  };

  const rejectIndvPopup = async () => {
    const tourId = selectedRow.code;
    try {
      await fetch(`/api/register/individual/reject?Code=${tourId}`, {
        method: "POST",
      });

      setPendingIndvData((prev) => prev.filter((item) => item.code !== tourId));
      setRejectedIndvData((prev) => [...prev, { ...selectedRow, state: 2 }]);
      closePopup();
    } catch (error) {
      console.error("Error rejecting individual registration:", error);
    }
  };

  const handleIndvDelete = async () => {
    const tourId = selectedRow.code;
    try {
      await fetch(`/api/register/individual/delete?Code=${tourId}`, {
        method: "DELETE",
      });

      setRejectedIndvData((prev) =>
        prev.filter((item) => item.code !== tourId)
      );
      closePopup();
    } catch (error) {
      console.error("Error deleting individual registration:", error);
    }
  };
  const refresh = () => {
    window.location.reload();
  };
  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
  };
  const processCombinedTourData = (pendingData, acceptedData) => {
    const conflictMap = new Map(); // Map to store conflict data for each timeBlock
    let conflictCounter = 1; // Counter to generate unique conflict IDs

    // Combine pending and accepted data into one array
    const combinedData = [...pendingData, ...acceptedData];

    // Step 1: Build the conflict map
    combinedData.forEach((tour) => {
      const timeBlock = tour.timeBlock?.scheduledTours?.join(",");

      // Skip processing for resolved tours
      if (tour.timeBlock?.conflictSolved) {
        return;
      }

      if (timeBlock) {
        if (conflictMap.has(timeBlock)) {
          const conflictInfo = conflictMap.get(timeBlock);
          conflictInfo.tours.push(tour.code);

          // Mark as conflict only if there are multiple tours
          if (conflictInfo.tours.length > 1 && !conflictInfo.isConflict) {
            conflictInfo.isConflict = true; // Mark the group as a conflict
            conflictInfo.conflictId = `${conflictCounter++}`; // Assign a new conflict ID
          }
        } else {
          conflictMap.set(timeBlock, {
            conflictId: null,
            tours: [tour.code],
            isConflict: false,
          });
        }
      }
    });

    // Step 2: Map the conflict information back to tours
    return combinedData.map((tour) => {
      if (tour.timeBlock?.conflictSolved) {
        console.log("TOUR SOLVED: ", tour);
        // Explicitly set resolved tours to not be in conflict
        return {
          ...tour,
          isConflict: false,
          conflictId: null,
        };
      }

      const timeBlock = tour.timeBlock?.scheduledTours?.join(",");
      if (timeBlock && conflictMap.has(timeBlock)) {
        const conflictInfo = conflictMap.get(timeBlock);
        return {
          ...tour,
          isConflict: conflictInfo.isConflict,
          conflictId: conflictInfo.conflictId,
        };
      }

      // Default case for tours with no timeBlock or conflict
      return {
        ...tour,
        isConflict: false,
        conflictId: null,
      };
    });
  };
  const confirmConflictResolution = async () => {
    try {
      // Accept selected tours
      for (const tourId of selectedTours) {
        await fetch(`/api/register/tour/accept?Code=${tourId}`, {
          method: "POST",
        });
        // Mark the tour as resolved
        await fetch(`/api/register/tour/marksolved?Code=${tourId}`, {
          method: "POST",
        });
      }

      // Reject unselected tours
      const unselectedTours = conflictingTours
        .filter((tour) => !selectedTours.includes(tour.code))
        .map((tour) => tour.code);

      for (const tourId of unselectedTours) {
        await fetch(`/api/register/tour/reject?Code=${tourId}`, {
          method: "POST",
        });
        // Mark the tour as resolved
        await fetch(`/api/register/tour/marksolved?Code=${tourId}`, {
          method: "POST",
        });
      }

      // Update the state to remove conflicts from resolved tours
      setPendingData((prevData) =>
        prevData.map((tour) =>
          conflictingTours.some((conflict) => conflict.code === tour.code)
            ? { ...tour, isConflict: false, conflictId: null }
            : tour
        )
      );

      setAcceptedData((prevData) =>
        prevData.map((tour) =>
          conflictingTours.some((conflict) => conflict.code === tour.code)
            ? { ...tour, isConflict: false, conflictId: null }
            : tour
        )
      );

      alert("Conflict resolved successfully and marked as solved!");
      setConflictPopupVisible(false);
      refresh(); // Reload data
    } catch (error) {
      console.error("Error resolving conflict:", error);
    }
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
      await fetch(`/api/register/general/cancel?Code=${code}`, {
        method: "POST",
      });
      alert("Registration deleted!");
      refresh();
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  return (
    <div className="evaluateTourRequestPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"Evaluate Tour Requests"} />
        <div className="toggleButtons">
          <button
            className={`toggleButton ${
              selectedType === "school" ? "active" : ""
            }`}
            onClick={() => setSelectedType("school")}
          >
            School
          </button>
          <button
            className={`toggleButton ${
              selectedType === "individual" ? "active" : ""
            }`}
            onClick={() => setSelectedType("individual")}
          >
            Individual
          </button>
        </div>
        <div className="rightInnerEvaluation">
          {conflictPopupVisible && (
            <div className="conflict-popup-overlay">
              <div className="conflict-popup-content">
                <h2>Resolve Conflict - ID: {selectedConflictId}</h2>
                <p>Select the tours to accept. The rest will be rejected.</p>
                <form>
                  {conflictingTours.map((tour) => (
                    <div key={tour.code} className="conflict-popup-details">
                      <label>
                        <input
                          type="checkbox"
                          value={tour.code}
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setSelectedTours((prevSelected) =>
                              checked
                                ? [...prevSelected, value]
                                : prevSelected.filter((id) => id !== value)
                            );
                          }}
                        />
                        {tour.school?.schoolName || tour.name || "N/A"} (ID:{" "}
                        {tour.code})
                      </label>

                      {/* Details for the conflicting tour */}
                      <table className="conflict-popup-table">
                        <tbody>
                          {popupHeaders.map((header, index) => {
                            const keyPath = headerKeyMap[header]; // Match header to object key
                            const value = keyPath
                              .split(".")
                              .reduce(
                                (acc, key) =>
                                  acc && acc[key] ? acc[key] : "N/A",
                                tour
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
                    </div>
                  ))}
                </form>
                <div className="conflict-popup-actions">
                  <button
                    className="confirm-btn"
                    onClick={confirmConflictResolution}
                  >
                    Confirm
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setConflictPopupVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {selectedType === "school" ? (
            <div className="leftSideEvaluation">
              <div className="evaluateTourRequests">
                {/* Pending Requests */}
                <h1 className="evaluateTourRequestsHeading">
                  Pending School Tour Requests
                </h1>
                {pendingData.length > 0 ? (
                  <TableWithButtonConflict
                    headers={headers}
                    data={pendingData.map((item) => [
                      item.code,
                      item.school?.schoolName || "N/A",
                      "Pending",
                      item.isConflict,
                      item.conflictId,
                    ])}
                    onButtonClick={handleRowClick}
                    buttonStyle={buttonStyle}
                    defaultButtonName="Decide"
                  />
                ) : (
                  <p className="noDataText">No Pending School Tour Requests</p>
                )}

                {/* Accepted Requests */}
                <h1 className="evaluateTourRequestsHeading">
                  Accepted School Tour Requests
                </h1>
                {acceptedData.length > 0 ? (
                  <TableWithButtonConflict
                    headers={headers}
                    data={acceptedData.map((item) => [
                      item.code,
                      item.school?.schoolName || "N/A",
                      "Accepted",
                      item.isConflict,
                      item.conflictId,
                    ])}
                    onButtonClick={(rowData) => {
                      const tourId = String(rowData[0]);
                      const selectedTour = acceptedData.find(
                        (tour) => String(tour.code) === tourId
                      );

                      if (selectedTour?.isConflict) {
                        // Open the resolve conflict popup if there is a conflict
                        const conflictingTours = [
                          ...acceptedData,
                          ...pendingData,
                        ].filter(
                          (tour) => tour.conflictId === selectedTour.conflictId
                        );
                        setSelectedConflictId(selectedTour.conflictId);
                        setConflictingTours(conflictingTours);
                        setConflictPopupVisible(true);
                      } else {
                        handleAcceptedRowClick(rowData);
                      }
                    }}
                    buttonStyle={buttonStyle}
                    defaultButtonName="View"
                  />
                ) : (
                  <p className="noDataText">No Accepted School Tour Requests</p>
                )}

                {/* Rejected Requests */}
                <h1 className="evaluateTourRequestsHeading">
                  Rejected School Tour Requests
                </h1>
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
                  <p className="noDataText">No Rejected School Tour Requests</p>
                )}

                {/* Popup */}
                {/* Popup */}
                {popupVisible && selectedRow && (
                  <div className="popupOverlay">
                    <div className="popupContent">
                      <h2>Tour Details</h2>
                      <table className="popupTable">
                        <tbody>
                          {popupHeaders.map((header, index) => {
                            const keyPath = headerKeyMap[header]; // Match header to object key
                            const value = keyPath
                              .split(".")
                              .reduce(
                                (acc, key) =>
                                  acc && acc[key] ? acc[key] : "N/A",
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
                          onClick={closePopup}
                        >
                          Close
                        </button>
                      ) : (
                        // Pending rows
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
                            onClick={acceptPopup}
                          >
                            Approve
                          </button>
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
                            onClick={rejectPopup}
                          >
                            Reject
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
                            onClick={closePopup}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rightSideEvaluation">
              <div className="evaluateTourRequests">
                {/* Pending Requests */}
                <h1 className="evaluateTourRequestsHeading">
                  Pending Individual Tour Requests
                </h1>
                {pendingIndvData.length > 0 ? (
                  <TableWithButtons
                    headers={headersIndv}
                    data={pendingIndvData.map((item) => [
                      item.code,
                      item.name || "N/A",
                      item.individualMajor?.name || "N/A",
                      "Pending",
                    ])}
                    onButtonClick={handleIndvRowClick}
                    buttonStyle={buttonStyle}
                    buttonName="Decide"
                  />
                ) : (
                  <p className="noDataText">
                    No Pending Individual Tour Requests
                  </p>
                )}

                {/* Accepted Requests */}
                <h1 className="evaluateTourRequestsHeading">
                  Accepted Individual Tour Requests
                </h1>
                {acceptedIndvData.length > 0 ? (
                  <TableWithButtons
                    headers={headersIndv}
                    data={acceptedIndvData.map((item) => [
                      item.code,
                      item.individualName || "N/A",
                      item.individualMajor?.name || "N/A",
                      "Accepted",
                    ])}
                    onButtonClick={handleAcceptedIndvRowClick}
                    buttonStyle={buttonStyle}
                    buttonName="View"
                  />
                ) : (
                  <p className="noDataText">
                    No Accepted Individual Tour Requests
                  </p>
                )}

                {/* Rejected Requests */}
                <h1 className="evaluateTourRequestsHeading">
                  Rejected Individual Tour Requests
                </h1>
                {rejectedIndvData.length > 0 ? (
                  <TableWithButtons
                    headers={headersIndv}
                    data={rejectedIndvData.map((item) => [
                      item.code,
                      item.name || "N/A",
                      item.individualMajor?.name || "N/A",
                      "Rejected",
                    ])}
                    onButtonClick={(row) => handleDelete(row[0])}
                    buttonStyle={{ ...buttonStyle, backgroundColor: "red" }}
                    buttonName="Delete"
                  />
                ) : (
                  <p className="noDataText">
                    No Rejected Individual Tour Requests
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {popupVisible && selectedRow && selectedType === "individual" && (
        <IndividualPopup
          selectedRow={selectedRow}
          onClose={closePopup}
          onAccept={acceptIndvPopup}
          onReject={rejectIndvPopup}
          onDelete={handleIndvDelete}
        />
      )}
    </div>
  );
}

export default EvaluateTourRequests;
