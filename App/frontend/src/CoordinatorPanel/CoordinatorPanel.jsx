import "./CoordinatorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";

function CoordinatorPanel() {
  const navigate = useNavigate();

  const handleManageFairRequestsClick = () => {
    // Implement Later
  };

  const handleAssignGuideToFairsClick = () => {
    // Implement Later
  };

  const handleListAllUsersClick = () => {
    // Implement Later
  };

  const handleAddUserClick = () => {
    // Implement Later
  };

  const handleManageSurveysClick = () => {
    // Implement Later
  };

  const handleAccessAdvisorPanelClick = () => {
    console.log("Access to Advisor Panel button clicked");
    navigate("/advisorPanel");
  };

  return (
    <div className="coordinatorPanel">
      <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
      <div className="buttonCoordinatorPanelSection">
        <div className="buttonCoordinatorPanel">
          <button onClick={handleListAllUsersClick}>List All Users</button>
        </div>
        <div className="buttonCoordinatorPanel">
          <button onClick={handleAssignGuideToFairsClick}>
            Assign Guide To Fairs
          </button>
        </div>
        <div className="buttonCoordinatorPanel">
          <button onClick={handleManageFairRequestsClick}>
            Manage Fair Requests
          </button>
        </div>
        <div className="buttonCoordinatorPanel">
          <button onClick={handleAddUserClick}>Add User</button>
        </div>
        <div className="buttonCoordinatorPanel">
          <button onClick={handleManageSurveysClick}>Manage Surveys</button>
        </div>
        <div className="buttonCoordinatorPanel">
          <button onClick={handleAccessAdvisorPanelClick}>
            Access to Advisor Panel
          </button>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default CoordinatorPanel;
