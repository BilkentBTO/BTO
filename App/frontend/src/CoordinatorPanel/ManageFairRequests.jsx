import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import "./ManageFairRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ManageFairRequests() {
  const headers = [
    "School Name",
    "City",
    "Date of Visit",
    "Supervisor Name",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Notes",
  ];

  const [pendingData, setPendingData] = useState([]);
  const [acceptedData, setAcceptedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [selectedFair, setSelectedFair] = useState(null);
  const [popupType, setPopupType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingResponse = await fetch("/api/register/fair");
        const acceptedResponse = await fetch(
          "/api/register/fair/getregistrations/accepted"
        );
        const rejectedResponse = await fetch(
          "/api/register/fair/getregistrations/rejected"
        );

        if (pendingResponse.ok) {
          const pendingResult = await pendingResponse.json();
          setPendingData(
            pendingResult.map((item) => [
              item.school.schoolName,
              item.cityName,
              new Date(item.dateOfVisit).toLocaleDateString(),
              item.superVisorName,
              item.superVisorDuty,
              item.superVisorPhoneNumber,
              item.superVisorMailAddress,
              item.notes,
            ])
          );
        }

        if (acceptedResponse.ok) {
          const acceptedResult = await acceptedResponse.json();
          setAcceptedData(
            acceptedResult.map((item) => [
              item.school.schoolName,
              item.cityName,
              new Date(item.dateOfVisit).toLocaleDateString(),
              item.superVisorName,
              item.superVisorDuty,
              item.superVisorPhoneNumber,
              item.superVisorMailAddress,
              item.notes,
            ])
          );
        }

        if (rejectedResponse.ok) {
          const rejectedResult = await rejectedResponse.json();
          setRejectedData(
            rejectedResult.map((item) => [
              item.school.schoolName,
              item.cityName,
              new Date(item.dateOfVisit).toLocaleDateString(),
              item.superVisorName,
              item.superVisorDuty,
              item.superVisorPhoneNumber,
              item.superVisorMailAddress,
              item.notes,
            ])
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (row) => {
    setSelectedFair(row);
    setPopupType(null);
  };

  const closePopup = () => {
    setSelectedFair(null);
    setPopupType(null);
  };

  const handleAccept = async () => {
    try {
      const response = await fetch("/api/register/fair/accept?Code=${}", {
        method: "POST",
      });

      if (response.ok) {
        alert("Fair request accepted successfully.");
        setPendingData((prevData) =>
          prevData.filter((row) => row[0] !== selectedFair[0])
        );
        setAcceptedData((prevData) => [...prevData, selectedFair]);
        closePopup();
      } else {
        console.error("Failed to accept fair request:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting fair request:", error);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await fetch("/api/register/fair/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName: selectedFair[0] }),
      });

      if (response.ok) {
        alert("Fair request declined successfully.");
        setPendingData((prevData) =>
          prevData.filter((row) => row[0] !== selectedFair[0])
        );
        setRejectedData((prevData) => [...prevData, selectedFair]);
        closePopup();
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
              data={pendingData}
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
              data={acceptedData}
              onButtonClick={() => {}}
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
              data={rejectedData}
              onButtonClick={() => {}}
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

        {selectedFair && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Fair Information</h2>
              <table className="popupTable">
                <tbody>
                  {headers.map((header, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{header}:</strong>
                      </td>
                      <td>{selectedFair[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="popupActions">
                <button
                  className="popupButton"
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
                  Accept
                </button>
                <button
                  className="popupButton"
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
                  Decline
                </button>
                <button
                  className="popupButton closeButton"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageFairRequests;
