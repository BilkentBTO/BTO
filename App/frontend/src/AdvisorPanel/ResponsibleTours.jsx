import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ResponsibleTours.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import Table from "../GlobalClasses/Table";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function ResponsibleTours() {
  const headers = [
    "Tour ID",
    "School",
    "City",
    "Date",
    "Time",
    "Number of Visitors",
    "Supervisor",
    "Supervisor Duty",
    "Supervisor Phone Number",
    "Supervisor Mail",
    "Rating",
    "Notes",
  ];

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResponsibleTours = async () => {
      try {
        // Retrieve the token
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("No token found");
        }

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userID = decodedToken["UID"];
        if (!userID) {
          throw new Error("User ID not found in token");
        }

        // Fetch responsible tours for the user
        const response = await fetch(`/api/user/${userID}/responsibletours`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tours: ${response.status}`);
        }

        // Parse and transform data for the table
        const tours = await response.json();
        const transformedData = tours.map((tour) => [
          tour.tourID || "N/A",
          tour.school || "N/A",
          tour.city || "N/A",
          new Date(tour.date).toLocaleDateString() || "N/A",
          new Date(tour.time).toLocaleTimeString() || "N/A",
          tour.numberOfVisitors || "N/A",
          tour.supervisor || "N/A",
          tour.supervisorDuty || "N/A",
          tour.supervisorPhoneNumber || "N/A",
          tour.supervisorMail || "N/A",
          tour.rating || "N/A",
          tour.notes || "N/A",
        ]);

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching responsible tours: ", error);
        alert("Failed to fetch responsible tours. Please try again.");
      }
    };

    fetchResponsibleTours();
  }, [navigate]);

  return (
    <div className="responsibleToursPage">
      <GlobalSidebar />
      <div className="rightSideAdvisorFunction">
        <HeaderPanelGlobal name={"ADVISOR PANEL"} />
        <div>
          <h1 className="responsibleToursHeading">Responsible Tours</h1>
          <Table headers={headers} data={data} />
        </div>
      </div>
    </div>
  );
}

export default ResponsibleTours;
