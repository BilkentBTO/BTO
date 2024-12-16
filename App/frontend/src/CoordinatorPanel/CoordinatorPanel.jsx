import "./CoordinatorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";

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
