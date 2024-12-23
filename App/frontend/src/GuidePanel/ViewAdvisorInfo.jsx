import React, { useEffect, useState } from "react";
import Table from "../GlobalClasses/Table";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ViewAdvisorInfo() {
  const navigate = useNavigate();
  const [dataMonday, setMonday] = useState([]);
  const [dataTuesday, setTuesday] = useState([]);
  const [dataWednesday, setWednesday] = useState([]);
  const [dataThursday, setThursday] = useState([]);
  const [dataFriday, setFriday] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headers = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/responsibleadvisors");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        console.log("Api Data", apiData);
        setMonday(apiData[0] || []);
        setTuesday(apiData[1] || []);
        setWednesday(apiData[2] || []);
        setThursday(apiData[3] || []);
        setFriday(apiData[4] || []);
      } catch (error) {
        console.error("Error fetching advisor data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Create rows for the table
  const maxRows = Math.max(
    dataMonday.length,
    dataTuesday.length,
    dataWednesday.length,
    dataThursday.length,
    dataFriday.length
  );

  const tableData = Array.from({ length: maxRows }).map((_, rowIndex) => [
    dataMonday[rowIndex]
      ? `${dataMonday[rowIndex].name || "N/A"} ${
          dataMonday[rowIndex].surname || "N/A"
        } (${dataMonday[rowIndex].mail || "N/A"})`
      : "N/A",
    dataTuesday[rowIndex]
      ? `${dataTuesday[rowIndex].name || "N/A"} ${
          dataTuesday[rowIndex].surname || "N/A"
        } (${dataTuesday[rowIndex].mail || "N/A"})`
      : "N/A",
    dataWednesday[rowIndex]
      ? `${dataWednesday[rowIndex].name || "N/A"} ${
          dataWednesday[rowIndex].surname || "N/A"
        } (${dataWednesday[rowIndex].mail || "N/A"})`
      : "N/A",
    dataThursday[rowIndex]
      ? `${dataThursday[rowIndex].name || "N/A"} ${
          dataThursday[rowIndex].surname || "N/A"
        } (${dataThursday[rowIndex].mail || "N/A"})`
      : "N/A",
    dataFriday[rowIndex]
      ? `${dataFriday[rowIndex].name || "N/A"} ${
          dataFriday[rowIndex].surname || "N/A"
        } (${dataFriday[rowIndex].mail || "N/A"})`
      : "N/A",
  ]);

  return (
    <div className="assignedFairsPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"GUIDE PANEL"} />
        <div>
          <h1 className="assignedFairsHeading">Advisor Info</h1>
          {console.log("Monday", dataMonday)}
          {!isLoading ? (
            <Table headers={headers} data={tableData} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAdvisorInfo;
