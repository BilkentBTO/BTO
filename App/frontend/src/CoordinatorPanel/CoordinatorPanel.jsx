import MainRegButton from "../MainPage/MainRegButton";
import "./CoordinatorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";

function CoordinatorPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastCoordinatorItem1 = "Item1";
  const lastCoordinatorItem2 = "Item2";
  const lastCoordinatorItem3 = "Item3";
  const lastCoordinatorItem4 = "Item4";
  const lastCoordinatorItem5 = "Item5";
  const lastCoordinatorItem6 = "Item6";
  const lastCoordinatorItem7 = "Item7";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
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
