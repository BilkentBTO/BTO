import "./CoordinatorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
function CoordinatorPanel() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(""); // State to hold the user's role

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

  // Sidebar navigation based on role
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

  const navigateToSection = (path) => {
    navigate(path);
  };
  const handleManageFairRequestsClick = () => {
    console.log("Manage Fair Requests button clicked");
    navigate("/coordinatorPanel/manageFairRequests");
  };

  const handleAssignGuideToFairsClick = () => {
    console.log("Assign Guide To Fairs button clicked");
    navigate("/coordinatorPanel/assignGuideToFairs");
  };

  const handleListAllUsersClick = () => {
    console.log("List All Users button clicked");
    navigate("/coordinatorPanel/listAllUsers");
  };

  const handleAddUserClick = () => {
    console.log("Add User button clicked");
    navigate("/coordinatorPanel/addUser");
  };

  const handleManageSurveysClick = () => {
    navigate("/coordinatorPanel/manageSurveys");

    // Implement Later
  };

  const handleAccessAdvisorPanelClick = () => {
    console.log("Access to Advisor Panel button clicked");
    navigate("/advisorPanel");
  };

  return (
    <div className="coordinatorPanel">
      <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
      <div className="innerCoordinator">
        <div className="leftSideCoordinator">
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
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="buttonCoordinatorPanelSection">
          <button onClick={handleListAllUsersClick}>List All Users</button>

          <button onClick={handleAssignGuideToFairsClick}>
            Assign Guide To Fairs
          </button>

          <button onClick={handleManageFairRequestsClick}>
            Manage Fair Requests
          </button>

          <button onClick={handleAddUserClick}>Add User</button>

          <button onClick={handleManageSurveysClick}>Manage Surveys</button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default CoordinatorPanel;
