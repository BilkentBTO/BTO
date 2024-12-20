import React, { useEffect, useState } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../GlobalClasses/TableWithButtons";
import { useNavigate } from "react-router-dom";
import "./AvailableToursPage.css";
import profileImage from "../assets/profile_image.png";
import { jwtDecode } from "jwt-decode";

function AvailableToursPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state
  const [selectedTour, setSelectedTour] = useState(null); // Selected tour data

  const headers = ["Tour ID", "Date", "School", "Number of Visitors"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/register/tour/registrations/1");
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

  const handleRowClick = (rowData) => {
    const selectedTourData = data.find((item) => item.code === rowData[0]);
    setSelectedTour(selectedTourData); // Track the clicked tour
    setShowPopup(true); // Show popup
  };

  const handleApply = () => {
    console.log("Applied:", selectedTour);
    setShowPopup(false);
    // IMPLEMENT !!!!!!!!!!!!!
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTour(null); // Clear selection
  };
  const [username, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // State to hold the user's role

  // Simulate fetching the user's role from an API or global state
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("TOKEN: ", token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        // Extract the role claim (adjust based on your JWT structure)
        const roleClaim =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || decodedToken.role; // Use "role" if no namespace is used
        setUserRole(roleClaim || "User");

        const nameClaim =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ];
        setUserName(nameClaim || "Unknown");

        console.log("Decoded Token:", decodedToken);
        console.log("Role:", roleClaim);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const navigateToSection = (path) => {
    navigate(path);
  };
  const sidebarOptions = {
    Admin: [
      { label: "Admin Panel", path: "/adminPanel" },
      { label: "Coordinator Panel", path: "/coordinatorPanel" },
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Coordinator: [
      { label: "Coordinator Panel", path: "/coordinatorPanel" },
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Advisor: [
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Guide: [{ label: "Guide Panel", path: "/guidePanel" }],
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
      <div className="leftSideGuideFunction">
        <div className="sidebar">
          <h3>Navigation</h3>
          <ul>
            {sidebarOptions[userRole]?.map((option, index) => (
              <li
                key={index}
                onClick={() => navigateToSection(option.path)}
                style={{
                  border: "1px solid white",
                  padding: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  backgroundColor: location.pathname.startsWith(option.path)
                    ? "#1e1e64"
                    : "#3c3c82",
                  color: location.pathname.startsWith(option.path)
                    ? "white"
                    : "white",
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="bottomSidebarSection">
          <div className="profileSidebarSection">
            <img src={profileImage}></img>
            <span>{username}</span>
          </div>
          <div className="logoutSidebarSection">
            <button onClick={handleLogout}>LOGOUT</button>
          </div>
        </div>
      </div>
      <div className="rightSideGuideFunction">
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
              ])}
              onButtonClick={handleRowClick}
              buttonStyle={buttonStyle}
              buttonName={buttonName}
            />
          ) : (
            <p>No available tours found.</p>
          )}
        </div>

        {/* Custom Popup */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h3>Tour Details</h3>
              {selectedTour ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                  }}
                >
                  <tbody>
                    {Object.entries({
                      "Tour ID": selectedTour.code || "N/A",
                      School: selectedTour.school?.schoolName || "N/A",
                      City: selectedTour.cityName || "N/A",
                      Date:
                        new Date(
                          selectedTour.dateOfVisit
                        ).toLocaleDateString() || "N/A",
                      Time: selectedTour.preferredVisitTime?.id || "N/A",
                      "Number of Visitors":
                        selectedTour.numberOfVisitors || "N/A",
                      Supervisor: selectedTour.superVisorName || "N/A",
                      "Supervisor Duty": selectedTour.superVisorDuty || "N/A",
                      "Supervisor Phone Number":
                        selectedTour.superVisorPhoneNumber || "N/A",
                      "Supervisor Mail":
                        selectedTour.superVisorMailAddress || "N/A",
                      Notes: selectedTour.notes || "N/A",
                    }).map(([key, value]) => (
                      <tr key={key}>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            fontWeight: "bold",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          {key}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                          }}
                        >
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No details available.</p>
              )}
              <div className="popupActions">
                <button
                  onClick={handleApply}
                  style={{
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
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                >
                  Apply
                </button>
                <button
                  onClick={closePopup}
                  style={{
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
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableToursPage;
