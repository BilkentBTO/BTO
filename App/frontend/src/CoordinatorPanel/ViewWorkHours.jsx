import React, { useEffect, useState } from "react";
import Table from "../GlobalClasses/Table";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ViewWorkHours() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headers = ["ID", "Name", "Surname", "Mail", "User Type", "Work Hours"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        setData(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserTypeString = (userType) => {
    switch (userType) {
      case 1:
        return "Admin";
      case 2:
        return "Coordinator";
      case 3:
        return "Advisor";
      case 4:
        return "Guide";
      case 5:
        return "Candidate Guide";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="assignedFairsPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"View Working Hours"} />
        <div>
          <h1 className="assignedFairsHeading">Users - Working Hours</h1>
          <Table
            headers={headers}
            data={data.map((item) => [
              item.id || "N/A",
              item.name || "N/A",
              item.surname || "N/A",
              item.mail || "N/A",
              getUserTypeString(item.userType),
              item.workHours || "N/A",
            ])}
          />
        </div>
      </div>
    </div>
  );
}
export default ViewWorkHours;
