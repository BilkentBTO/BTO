import React, { useEffect, useState } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";
import "./AvailableToursPage.css";

function AvailableToursPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // State to hold fetched data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Table headers (only the required columns)
  const headers = ["Tour ID", "Date", "School", "Number of Visitors"];

  // Fetch tours data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/register/tour/registrations/1");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        setData(apiData); // Set the API response to the state
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false); // Stop the loading indicator
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (rowData) => {
    // Find the full data for the clicked row
    const selectedTour = data.find((item) => item.code === rowData[0]);
    console.log("SELECTED TOUR: ", selectedTour);
    // Navigate to the detailed tour management page
    navigate("/guidePanel/assignedTours/manageTour", {
      state: { selectedTour },
    });
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

  const buttonName = "View";

  return (
    <div className="availableToursPage">
      <HeaderPanelGlobal name={"GUIDE PANEL"} />
      <div>
        <h1 className="availableToursHeading">Available Tours</h1>
        {isLoading ? (
          <p>Loading available tours...</p>
        ) : data.length > 0 ? (
          <TableWithButtons
            headers={headers}
            data={data.map((item) => [
              item.code || "N/A", // Tour ID
              new Date(item.dateOfVisit).toLocaleDateString() || "N/A", // Date
              item.school?.schoolName || "N/A", // School
              item.numberOfVisitors || "N/A", // Number of Visitors
            ])} // Map the required data to the table rows
            onButtonClick={handleRowClick}
            buttonStyle={buttonStyle} // Pass custom button style
            buttonName={buttonName}
          />
        ) : (
          <p>No available tours found.</p>
        )}
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default AvailableToursPage;
