import React, { useState, useEffect } from "react";
import "./GuideRequests.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function GuideRequests() {
  const [data, setData] = useState([]);
  const [tourType, setTourType] = useState("school"); // Toggle between school and individual
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  // Headers for school and individual tours
  const schoolHeaders = ["Guide ID", "Guide Username", "School", "Status"];
  const individualHeaders = [
    "Guide ID",
    "Guide Username",
    "Individual Name",
    "Preferred Major",
    "Status",
  ];

  const headers = tourType === "school" ? schoolHeaders : individualHeaders;

  useEffect(() => {
    // Fetch data for the selected tour type
    const fetchData = async () => {
      const endpoint =
        tourType === "school"
          ? "/api/apply/tour" // API for school tour requests
          : "/api/apply/individualtour"; // API for individual tour requests

      try {
        const response = await fetch(endpoint, { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch guide tour requests.");
        }
        const result = await response.json();

        const formattedData = result.map((item) => {
          if (tourType === "school") {
            return [
              item.guideUID,
              item.guide
                ? `${item.guide.name || "N/A"} ${item.guide.surname || "N/A"}`
                : "N/A",
              item.tourCode || "N/A", // School Name
              "Pending", // Status
            ];
          } else {
            const individualInfo = item.individualTour?.tourRegistirationInfo;
            return [
              item.guideUID,
              `${item.guide?.name || "N/A"} ${item.guide?.surname || "N/A"}`,
              individualInfo?.individualName || "N/A", // Individual Name
              individualInfo?.individualMajor?.name || "N/A", // Preferred Major
              "Pending", // Status
            ];
          }
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching guide tour requests:", error);
      }
    };

    fetchData();
  }, [tourType]);

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
      const endpoint =
        tourType === "school"
          ? `/api/apply/tour/accept/${guideUID}`
          : `/api/apply/tour/accept/${guideUID}`;

      const response = await fetch(endpoint, { method: "POST" });
      if (response.ok) {
        alert("Request approved!");
        setData((prevData) => prevData.filter((row) => row[0] !== guideUID)); // Remove approved request
        closePopup();
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
      const endpoint =
        tourType === "school"
          ? `/api/apply/tour/reject/${guideUID}`
          : `/api/apply/tour/reject/${guideUID}`;

      const response = await fetch(endpoint, { method: "POST" });
      if (response.ok) {
        alert("Request denied!");
        setData((prevData) => prevData.filter((row) => row[0] !== guideUID)); // Remove denied request
        closePopup();
      } else {
        alert("Failed to deny the request.");
      }
    } catch (error) {
      console.error("Error denying request:", error);
      alert("Failed to deny the request.");
    }
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

  return (
    <div className="guideRequestsPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"Guide Requests"} />
        <div className="toggleButtons">
          <button
            className={`toggleButton ${tourType === "school" ? "active" : ""}`}
            onClick={() => setTourType("school")}
          >
            School Requests
          </button>
          <button
            className={`toggleButton ${
              tourType === "individual" ? "active" : ""
            }`}
            onClick={() => setTourType("individual")}
          >
            Individual Requests
          </button>
        </div>
        <h1 className="guideRequestsHeading">
          Guide {tourType === "school" ? "School" : "Individual"} Tour Requests
        </h1>
        {data.length > 0 ? (
          <TableWithButtons
            headers={headers}
            data={data}
            onButtonClick={handleRowClick}
            buttonStyle={buttonStyle}
            buttonName={buttonName}
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
              <strong>Guide:</strong> {selectedRow[1]}
            </p>
            <p>
              <strong>
                {tourType === "school" ? "School" : "Individual"}:
              </strong>{" "}
              {selectedRow[2]}
            </p>
            {tourType === "individual" && (
              <>
                <p>
                  <strong>Preferred Major:</strong> {selectedRow[3]}
                </p>
              </>
            )}
            <div className="popupActions">
              <button
                className="requestPopupButton"
                onClick={approve}
                style={{
                  ...buttonStyle,
                  backgroundColor: "green",
                }}
              >
                Approve
              </button>
              <button
                className="requestPopupButton"
                onClick={deny}
                style={{
                  ...buttonStyle,
                  backgroundColor: "red",
                }}
              >
                Deny
              </button>
              <button
                className="requestPopupButton"
                onClick={closePopup}
                style={{
                  ...buttonStyle,
                  backgroundColor: "grey",
                }}
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
