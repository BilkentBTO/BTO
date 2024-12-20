import "./AdvisorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profile_image.png";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AdvisorPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const navigate = useNavigate();

  const handleToursAndGuidesClick = () => {
    console.log("Tours and Guides button clicked");
    navigate("/advisorPanel/toursResponsibleByGuides");
  };

  const handleGuideRequestsClick = () => {
    console.log("Guide Requests button clicked");
    navigate("/advisorPanel/guideRequests");
  };

  const handleEvaluateTourRequestsClick = () => {
    console.log("Evaluate Tour Requests button clicked");
    navigate("/advisorPanel/evaluateTourRequests");
  };

  const handleResponsibleToursClick = () => {
    console.log("Responsible Tours button clicked");
    navigate("/advisorPanel/responsibleTours");
  };

  return (
    <div className="advisorPanel">
      <div className="innerAdvisor">
        <GlobalSidebar />
        <div className="buttonAdvisorPanelSection">
          <button onClick={handleToursAndGuidesClick}>Tours and Guides</button>

          <button onClick={handleGuideRequestsClick}>Guide Requests</button>

          <button onClick={handleEvaluateTourRequestsClick}>
            Evaluate Tour Requests
          </button>

          <button onClick={handleResponsibleToursClick}>
            Responsible Tours
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default AdvisorPanel;
