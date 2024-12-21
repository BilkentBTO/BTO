import "./GuidePanel.css";
import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function GuidePanel() {
  const navigate = useNavigate();

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

  // Button click handlers for guide panel-specific actions
  const handleAvailableToursClick = () => {
    navigate("/guidePanel/availableTours");
  };

  const handleAssignedFairsClick = () => {
    navigate("/guidePanel/assignedFairs");
  };

  const handleAssignedToursClick = () => {
    navigate("/guidePanel/assignedTours");
  };

  const handleEditAvailableHoursClick = () => {
    navigate("/guidePanel/editAvailableHours");
  };

  return (
    <div className="guidePanel">
      <div className="innerGuide">
        {/* Sidebar */}
        <GlobalSidebar />

        {/* Guide Panel Buttons */}
        <div className="buttonGuidePanelSection">
          <button onClick={handleAvailableToursClick}>Available Tours</button>
          <button onClick={handleAssignedFairsClick}>Assigned Fairs</button>
          <button onClick={handleAssignedToursClick}>Assigned Tours</button>
          <button onClick={handleEditAvailableHoursClick}>
            Edit Available Hours
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default GuidePanel;
