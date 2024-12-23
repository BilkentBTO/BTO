import React, { useState, useEffect } from "react";
import "./DataPanel.css"; // Reuse the existing styles
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
import PieChartGlobal from "../GlobalClasses/PieChartGlobal";
import ColumnGraphGlobal from "../GlobalClasses/ColumnGraphGlobal";

function DataPanel() {
  const headersSchool = [
    "School",
    "Total Tour Count",
    "Tour Feedback",
    "Bilkent Feedback",
    "Potential Apply Feedback",
    "Relation Status",
  ];

  const headersGuide = [
    "Guide Name",
    "Guide Surname",
    "Average Feedback",
    "Completed Tour Count",
  ];

  const [showPopup, setShowPopup] = useState(false); // State to toggle popup
  const [popupContent, setPopupContent] = useState({});
  const [dataSchool, setDataSchool] = useState([]);
  const [dataGuide, setDataGuide] = useState([]);
  const [selectedSchoolRow, setSelectedSchoolRow] = useState(null);
  const [selectedGuideRow, setSelectedGuideRow] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await fetch("/api/data/school");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        setDataSchool(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchGuideData = async () => {
      try {
        const response = await fetch("/api/data/guide");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        setDataGuide(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuideData();

    fetchSchoolData();
  }, []);

  const handleSchoolRowClick = (rowData) => {
    setSelectedSchoolRow(rowData);
    //
    setShowPopup(true);
  };

  const handleGuideRowClick = (rowData) => {
    // IMPLEMENT LATER
  };

  const closePopup = () => {
    setShowPopup(false);
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
    <div className="dataPanel">
      <GlobalSidebar />
      <div className="rightSideAdminFunction">
        <HeaderPanelGlobal name={"Data Panel"} />
        <div className="scrollContainer">
          <h1 className="dataPanelHeading">School Data</h1>
          <TableWithButtons
            headers={headersSchool}
            data={dataSchool}
            onButtonClick={(row) => handleSchoolRowClick(row)} // Pass the correct row data
            buttonStyle={buttonStyle}
            buttonName="Graphs"
          />
          <h1 className="dataPanelHeading">Guide Data</h1>
          <TableWithButtons
            headers={headersGuide}
            data={dataGuide}
            onButtonClick={(row) => handleGuideRowClick(row)} // Pass the correct row data
            buttonStyle={buttonStyle}
            buttonName="Graphs"
          />
        </div>
        {/* Popup Component */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Graph for {popupContent.school}</h2>
              <PieChartGlobal></PieChartGlobal>
              <ColumnGraphGlobal></ColumnGraphGlobal>
              <button
                onClick={closePopup}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "red",
                  marginTop: "20px",
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
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataPanel;
