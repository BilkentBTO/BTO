import profileImage from "../assets/profile_image.png";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function CandidateGuidePanel() {
  const navigate = useNavigate();

  const handleAvailableToursClick = () => {
    navigate("/candidateGuidePanel/availableToursCandidate");
  };

  const handleViewAdvisorInfoClick = () => {
    navigate("/guidePanel/viewAdvisorInfo");
  };

  return (
    <div className="guidePanel">
      <div className="innerGuide">
        {/* Sidebar */}
        <GlobalSidebar />

        {/* Guide Panel Buttons */}
        <div className="buttonGuidePanelSection">
          <button onClick={handleAvailableToursClick}>Available Tours</button>
          <button onClick={handleViewAdvisorInfoClick}>
            View Advisor Info
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default CandidateGuidePanel;
