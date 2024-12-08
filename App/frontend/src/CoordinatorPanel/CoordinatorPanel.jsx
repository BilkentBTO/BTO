import MainRegButton from "../MainPage/MainRegButton";
import "./CoordinatorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";

function CoordinatorPanel() {
  return (
    <div className="coordinatorPanel">
      <HeaderPanelGlobal name={"COORDINATOR PANEL"} />
      <div className="buttonCoordinatorPanelSection">
        <div className="buttonCoordinatorPanel">
          <MainRegButton name="List All Users" link="/listAllUsers" />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton
            name="Assign Guide to Fairs"
            link="/assignGuideToFairs"
          />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton
            name="Manage Fair Requests"
            link="/manageFairRequests"
          />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton name="Add Candidate Guide" link="/addCandidateGuide" />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton name="Add Guide" link="/addGuide" />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton name="Add Advisor" link="/addAdvisor" />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton name="Manage Surveys" link="/manageSurveys" />
        </div>
        <div className="buttonCoordinatorPanel">
          <MainRegButton name="Access to Advisor Panel" link="/advisorPanel" />
        </div>
        {/* Add an empty cell for the unused space */}
        <div className="emptyCell"></div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default CoordinatorPanel;
