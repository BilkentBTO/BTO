import "./CoordinatorPanel.css";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";
function CoordinatorPanel() {
  const navigate = useNavigate();

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
      <div className="innerCoordinator">
        <GlobalSidebar />
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
