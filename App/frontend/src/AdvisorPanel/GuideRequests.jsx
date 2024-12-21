import React, { useState, useEffect } from "react";
import "./GuideRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import profileImage from "../assets/profile_image.png";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function GuideRequests() {
  const [data, setData] = useState([]);

  // TEMPORARY DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const headers = ["Guide Username", "Tour", "Status"];

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/apply/tour");
        if (!response.ok) {
          throw new Error("Failed to fetch guide tour requests.");
        }
        const result = await response.json();
        // Map the result into the format expected by the table
        const formattedData = result.map((item) => [
          item.guideUID || "N/A", // Guide Username
          item.tourCode || "N/A", // Tour Code
          item.guide ? "Pending" : "N/A", // Status
        ]);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching guide tour requests:", error);
      }
    };

    fetchData();
  }, []);

  const buttonStyleApprove = {
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
  };

  const buttonStyleDeny = {
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
  };

  const buttonStyleReturn = {
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
    transition: "background-color 0.3s ease, transform 0.2s ease",
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

  const buttonName = "Decide";

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRow(null);
  };

  const approve = async () => {
    try {
      const guideUID = selectedRow[0]; // Extract guide UID from selected row
      const response = await fetch(`/api/apply/tour/accept/${guideUID}`, {
        method: "GET", // API method is GET
      });
      if (response.ok) {
        alert("Request approved!");
        setData((prevData) => prevData.filter((row) => row[0] !== guideUID)); // Remove approved request from the table
        closePopup(); // Close popup after successful operation
      } else {
        alert("Failed to approve the request.");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve the request.");
    }
  };

  const deny = async () => {
    try {
      const guideUID = selectedRow[0]; // Extract guide UID from selected row
      const response = await fetch(`/api/apply/tour/reject/${guideUID}`, {
        method: "GET", // API method is GET
      });
      if (response.ok) {
        alert("Request denied!");
        setData((prevData) => prevData.filter((row) => row[0] !== guideUID)); // Remove denied request from the table
        closePopup(); // Close popup after successful operation
      } else {
        alert("Failed to deny the request.");
      }
    } catch (error) {
      console.error("Error denying request:", error);
      alert("Failed to deny the request.");
    }
  };

  return (
    <div className="guideRequestsPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"ADVISOR PANEL"} />
        <h1 className="guideRequestsHeading">Guide Tour Requests</h1>

        {data.length > 0 ? (
          <TableWithButtons
            headers={headers}
            data={data}
            onButtonClick={handleRowClick}
            buttonStyle={buttonStyle}
            buttonName="Decide"
          />
        ) : (
          <p className="noDataText">No guide tour requests available.</p>
        )}
      </div>
      {popupVisible && selectedRow && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Decision for Guide Tour Request</h2>
            <p>
              <strong>Guide:</strong> {selectedRow[0]}
            </p>
            <p>
              <strong>Tour:</strong> {selectedRow[1]}
            </p>
            <div className="popupActions">
              <button
                className="requestPopupButton"
                onClick={approve}
                style={buttonStyleApprove}
              >
                Approve
              </button>
              <button
                className="requestPopupButton"
                onClick={deny}
                style={buttonStyleDeny}
              >
                Deny
              </button>
              <button
                className="requestPopupButton"
                onClick={closePopup}
                style={buttonStyleReturn}
              >
                Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuideRequests;
