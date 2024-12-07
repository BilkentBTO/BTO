import MainRegButton from "../MainPage/MainRegButton";
import "./CoordinatorPanel.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";

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
      <HeaderGlobal name={"COORDINATOR PANEL"} />
      <div className="buttonCoordinatorPanelSection"></div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default CoordinatorPanel;
