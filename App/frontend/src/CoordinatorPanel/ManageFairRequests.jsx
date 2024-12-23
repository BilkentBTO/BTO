import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import "./ManageFairRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ManageFairRequests() {
  const headers = [
    "Code",
    "School Name",
    "City",
    "Date of Visit",
    "Supervisor Name",
  ];

  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [selectedFair, setSelectedFair] = useState(null);
  const [popupVisible, setPopupVisible] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data for school requests
      try {
        const pending = await fetch("/api/register/fair/registrations/0").then(
          (res) => res.json()
        );
        const accepted = await fetch("/api/register/fair/registrations/1").then(
          (res) => res.json()
        );
        const rejected = await fetch("/api/register/fair/registrations/2").then(
          (res) => res.json()
        );
        console.log("PENDING: ", pending);
        console.log("ACCEPTED: ", accepted);
        console.log("REJECTED: ", rejected);
        setPendingData(pending);

        setAcceptedData(accepted);

        setRejectedData(rejected);
      } catch (error) {
        console.error("Error fetching school data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (rowData) => {
    const tourId = String(rowData[0]);

    const completeRow = pendingData.find((row) => String(row.code) === tourId);
    console.log("TOUR ID: ", tourId);
    console.log("COMPLETE ROW: ", completeRow);

    if (completeRow) {
      setSelectedFair(completeRow);
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
      setSelectedFair(completeRow);
      setPopupVisible(true);
    } else {
      console.error("No matching row found for tour ID:", tourId);
    }
  };
  const refresh = () => {
    window.location.reload();
  };
  const closePopup = () => {
    console.log(selectedFair);
    setSelectedFair(null);
  };
  const handleAccept = async () => {
    try {
      const fairCode = selectedFair.code;
      const response = await fetch(
        `/api/register/fair/accept?Code=${encodeURIComponent(fairCode)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("Fair request accepted successfully.");
        setPendingData((prevData) =>
          prevData.filter((row) => row.code !== selectedFair.code)
        );
        setAcceptedData((prevData) => [...prevData, selectedFair]);
        closePopup();
        refresh();
      } else {
        console.error("Failed to accept fair request:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting fair request:", error);
    }
  };

  const handleDecline = async () => {
    try {
      const fairCode = selectedFair.code;
      const response = await fetch(
        `/api/register/fair/reject?Code=${encodeURIComponent(fairCode)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        alert("Fair request declined successfully.");
        setPendingData((prevData) =>
          prevData.filter((row) => row.code !== selectedFair.code)
        );
        setRejectedData((prevData) => [...prevData, selectedFair]);
        closePopup();
        refresh();
      } else {
        console.error("Failed to decline fair request:", response.statusText);
      }
    } catch (error) {
      console.error("Error declining fair request:", error);
    }
  };

  return (
    <div className="assignGuideToFairsPage">
      <GlobalSidebar />
      <div className="rightSideCoorFunction">
        <HeaderPanelGlobal name={"COORDINATOR PANEL"} />

        <div>
          <h1 className="assignGuideToFairsHeading">Pending Fair Requests</h1>
          {pendingData.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={pendingData.map((item) => [
                item.code || "N/A",
                item.school?.schoolName || "N/A",
                item.cityName || "N/A",
                new Date(item.time).toLocaleDateString() || "N/A",
                item.superVisorName || "N/A",
              ])}
              onButtonClick={handleRowClick}
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
              buttonName="Manage Fair"
            />
          ) : (
            <p>No pending fair requests available to display.</p>
          )}
        </div>

        <div>
          <h1 className="assignGuideToFairsHeading">Accepted Fair Requests</h1>
          {acceptedData.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={acceptedData.map((item) => [
                item.code || "N/A",
                item.school?.schoolName || "N/A",
                item.cityName || "N/A",
                new Date(item.time).toLocaleDateString() || "N/A",
                item.superVisorName || "N/A",
              ])}
              onButtonClick={handleAcceptedRowClick}
              buttonStyle={{
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
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              buttonName="View Details"
            />
          ) : (
            <p>No accepted fair requests available to display.</p>
          )}
        </div>

        <div>
          <h1 className="assignGuideToFairsHeading">Rejected Fair Requests</h1>
          {rejectedData.length > 0 ? (
            <TableWithButtons
              headers={headers}
              data={rejectedData.map((item) => [
                item.code || "N/A",
                item.school?.schoolName || "N/A",
                item.cityName || "N/A",
                new Date(item.time).toLocaleDateString() || "N/A",
                item.superVisorName || "N/A",
              ])}
              onButtonClick={(row) => handleDelete(row[0])}
              buttonStyle={{
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
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              buttonName="View Details"
            />
          ) : (
            <p>No rejected fair requests available to display.</p>
          )}
        </div>

        {popupVisible && selectedFair && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Tour Details</h2>
              <table className="popupTable">
                <tbody>
                  {/* Each field is manually listed */}

                  <tr>
                    <td>
                      <strong>Code:</strong>
                    </td>
                    <td>{selectedFair.code || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>City Name:</strong>
                    </td>
                    <td>{selectedFair.cityName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>School Name:</strong>
                    </td>
                    <td>{selectedFair.school?.schoolName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Date of Visit:</strong>
                    </td>
                    <td>
                      {selectedFair.time
                        ? new Date(selectedFair.time).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Priority:</strong>
                    </td>
                    <td>{selectedFair.school?.priority || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Supervisor Name:</strong>
                    </td>
                    <td>{selectedFair.superVisorName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Supervisor Duty:</strong>
                    </td>
                    <td>{selectedFair.superVisorDuty || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Supervisor Phone Number:</strong>
                    </td>
                    <td>{selectedFair.superVisorPhoneNumber || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Supervisor Mail Address:</strong>
                    </td>
                    <td>{selectedFair.superVisorMailAddress || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Notes:</strong>
                    </td>
                    <td>{selectedFair.notes || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
              {/* Conditional rendering for buttons */}
              {selectedFair.state === 1 ? ( // Accepted rows
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
                    onClick={handleAccept}
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
                    onClick={handleDecline}
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
  );
}

export default ManageFairRequests;
