import "./GuidePanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function GuidePanel() {
  const navigate = useNavigate();

  // Button click handlers
  const handleAvailableToursClick = () => {
    console.log("Available Tours button clicked");
    navigate("/guidePanel/availableTours");
    // Add logic here (e.g., navigate to a specific page)
  };

  const handleAssignedFairsClick = () => {
    console.log("Assigned Fairs button clicked");
    navigate("/guidePanel/assignedFairs");

    // Add logic here
  };

  const handleAssignedToursClick = () => {
    console.log("Assigned Tours button clicked");
    navigate("/guidePanel/assignedTours");

    // Add logic here
  };

  const handleEditAvailableHoursClick = () => {
    console.log("Edit Available Hours button clicked");
    navigate("/guidePanel/editAvailableHours");

    // Add logic here
  };

  return (
    <div className="guidePanel">
      <HeaderPanelGlobal name={"GUIDE PANEL"} />
      <div className="innerGuide">
        <div className="buttonGuidePanelSection">
          <div className="buttonGuidePanel">
            <button onClick={handleAvailableToursClick}>Available Tours</button>
          </div>
          <div className="buttonGuidePanel">
            <button onClick={handleAssignedFairsClick}>Assigned Fairs</button>
          </div>
          <div className="buttonGuidePanel">
            <button onClick={handleAssignedToursClick}>Assigned Tours</button>
          </div>
          <div className="buttonGuidePanel">
            <button onClick={handleEditAvailableHoursClick}>
              Edit Available Hours
            </button>
          </div>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
      <Outlet />
    </div>
  );
}

export default GuidePanel;
