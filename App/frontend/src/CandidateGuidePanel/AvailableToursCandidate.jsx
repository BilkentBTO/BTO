import React, { useEffect, useState } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import Table from "../GlobalClasses/Table";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AvailableToursCandidate() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [guideUID, setGuideUID] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const [selectedTour, setSelectedTour] = useState(null); // Selected tour data
  const [tourType, setTourType] = useState("school"); // Toggle state for tour type

  const schoolHeaders = [
    "Tour ID",
    "Date",
    "School",
    "Number of Visitors",
    "Time",
  ];
  const individualHeaders = [
    "Tour ID",
    "Date",
    "Name",
    "Preferred Major",
    "Phone Number",
  ];

  const headers = tourType === "school" ? schoolHeaders : individualHeaders;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const apiEndpoint =
        tourType === "school"
          ? "/api/schedule/availabletours" // API for school tours
          : "/api/schedule/availableindividualtours"; // API for individual tours
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const apiData = await response.json();
        console.log(apiData);
        setData(apiData);
      } catch (error) {
        console.error("Error fetching tours data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tourType]);

  const convertToUTCTime = (dateString) => {
    const date = new Date(dateString); // Create a Date object
    const time = date.toISOString().split("T")[1].split("Z")[0]; // Extract the time part
    return time.split(".")[0]; // Remove milliseconds
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const UID = decodedToken["UID"];
        setGuideUID(UID || "Unknown");
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  return (
    <div className="availableToursPage">
      <GlobalSidebar />
      <div className="rightSideGuideFunction">
        <HeaderPanelGlobal name={"Available Tours"} />
        <div className="toggleButtons">
          <button
            className={`toggleButton ${tourType === "school" ? "active" : ""}`}
            onClick={() => setTourType("school")}
          >
            School Tours
          </button>
          <button
            className={`toggleButton ${
              tourType === "individual" ? "active" : ""
            }`}
            onClick={() => setTourType("individual")}
          >
            Individual Tours
          </button>
        </div>
        <div>
          <h1 className="availableToursHeading">
            Apply to {tourType === "school" ? "School" : "Individual"} Tours
          </h1>
          {isLoading ? (
            <p>Loading available tours...</p>
          ) : data.length > 0 ? (
            <Table
              headers={headers}
              data={data.map((item) => {
                if (tourType === "school") {
                  return [
                    item.tourRegistrationCode || "N/A", // Tour ID
                    new Date(
                      item.tourRegistirationInfo?.time
                    ).toLocaleDateString() || "N/A", // Date
                    item.tourRegistirationInfo?.school?.schoolName || "N/A", // School
                    item.tourRegistirationInfo?.numberOfVisitors || "N/A", // Number of Visitors
                    convertToUTCTime(item.tourRegistirationInfo?.time) || "N/A",
                  ];
                } else {
                  return [
                    item.individualTourRegistrationCode || "N/A", // Tour ID for Individual
                    new Date(
                      item.tourRegistirationInfo?.time
                    ).toLocaleDateString() || "N/A", // Date
                    item.tourRegistirationInfo?.individualName || "N/A", // Name
                    item.tourRegistirationInfo?.individualMajor?.name || "N/A", // Preferred Major
                    item.tourRegistirationInfo?.individualPhoneNumber || "N/A", // Phone Number
                  ];
                }
              })}
            />
          ) : (
            <p>No available tours found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailableToursCandidate;
