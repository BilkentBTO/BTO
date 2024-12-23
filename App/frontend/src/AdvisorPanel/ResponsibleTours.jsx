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

        const tours = await response.json();

        console.log("TOURS: ", tours);

        const transformedData = tours.map((tour) => [
          tour.tourRegistrationCode || "N/A", // Tour ID
          tour.tourRegistirationInfo?.school?.schoolName || "N/A", // School Name
          tour.tourRegistirationInfo?.cityName || "N/A", // City
          new Date(tour.tourRegistirationInfo?.time).toLocaleDateString() ||
            "N/A", // Date

          new Date(tour.tourRegistirationInfo?.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          }) || "N/A", // Time
          tour.tourRegistirationInfo?.numberOfVisitors || "N/A", // Number of Visitors
          tour.tourRegistirationInfo?.superVisorName || "N/A", // Supervisor Name
          tour.tourRegistirationInfo?.superVisorDuty || "N/A", // Supervisor Duty
          tour.tourRegistirationInfo?.superVisorPhoneNumber || "N/A", // Supervisor Phone Number
          tour.tourRegistirationInfo?.superVisorMailAddress || "N/A", // Supervisor Email
          tour.quizCode || "N/A", // Quiz Code or Rating
          tour.tourRegistirationInfo?.notes || "N/A", // Notes
        ]);

        console.log("Transformed Data: ", transformedData);
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
        <HeaderPanelGlobal name={"Responsible Tours"} />
        <div>
          <h1 className="responsibleToursHeading">Your Tours</h1>
          <Table headers={headers} data={data} />
        </div>
      </div>
    </div>
  );
}

export default ResponsibleTours;
