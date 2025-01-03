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
    "Tour Feedback (Out of 10)",
    "Bilkent Feedback (Out of 10)",
    "Application Possibility (Out of 10)",
  ];

  const headersGuide = [
    "Guide Name",
    "Guide Surname",
    "Feedback (Out of 10)",
    "Completed Tour Count",
  ];

  const [showSchoolPopup, setShowSchoolPopup] = useState(false);
  const [showGuidePopup, setShowGuidePopup] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [dataSchool, setDataSchool] = useState([]);
  const [dataGuide, setDataGuide] = useState([]);
  const [selectedSchoolRow, setSelectedSchoolRow] = useState([]);
  const [selectedGuideRow, setSelectedGuideRow] = useState([]);

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
    setShowSchoolPopup(true);
  };

  const handleGuideRowClick = (rowData) => {
    setSelectedGuideRow(rowData);
    setShowGuidePopup(true);
  };

  const closeSchoolPopup = () => {
    setShowSchoolPopup(false);
  };

  const closeGuidePopup = () => {
    setShowGuidePopup(false);
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

  const infoSchool = [
    { name: "Tour Feedback", value: selectedSchoolRow[2] },
    { name: "Bilkent Feedback", value: selectedSchoolRow[3] },
    {
      name: "Application Possibility Feedback",
      value: selectedSchoolRow[4],
    },
  ];

  const infoGuide = [{ name: "Feedback Average", value: selectedGuideRow[2] }];

  return (
    <div className="dataPanel">
      <GlobalSidebar />
      <div className="rightSideAdminFunction">
        <HeaderPanelGlobal name={"Data Panel"} />
        <div className="scrollContainer">
          <h1 className="dataPanelHeading">School Data</h1>
          {console.log("dataSchool", dataSchool)}
          {console.log("dataGuide", dataGuide)}
          {dataSchool.length > 0 ? (
            <TableWithButtons
              headers={headersSchool}
              data={dataSchool.map((item) => [
                item.school.schoolName || "N/A",
                item.totalTours || "N/A",
                item.rateTour || "N/A",
                item.rateBilkent || "N/A",
                item.applyToBilkent || "N/A",
              ])}
              onButtonClick={(row) => handleSchoolRowClick(row)} // Pass the correct row data
              buttonStyle={buttonStyle}
              buttonName="Graphs"
            />
          ) : (
            <p className="noDataText">No Users</p>
          )}
          <h1 className="dataPanelHeading">Guide Data</h1>
          {dataGuide.length > 0 ? (
            <TableWithButtons
              headers={headersGuide}
              data={dataGuide.map((item) => [
                item.guide.name || "N/A",
                item.guide.surname || "N/A",
                item.averagePoints || "N/A",
                item.completedTours || "N/A",
              ])}
              onButtonClick={(row) => handleGuideRowClick(row)} // Pass the correct row data
              buttonStyle={buttonStyle}
              buttonName="Graphs"
            />
          ) : (
            <p className="noDataText">No Users</p>
          )}
        </div>
        {/* Popup Component */}
        {showSchoolPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Graph for Row</h2>
              {/*<PieChartGlobal data={infoSchool} outerRadius="80" />*/}
              <ColumnGraphGlobal
                data={infoSchool}
                width="250px"
                height="250px"
              />
              <button
                onClick={closeSchoolPopup}
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
        {/* Popup Component */}
        {showGuidePopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Graph for Row</h2>
              <ColumnGraphGlobal
                data={infoGuide}
                width="250px"
                height="250px"
              />
              <button
                onClick={closeGuidePopup}
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
