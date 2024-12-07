import MainRegButton from "../MainPage/MainRegButton";
import "./AdvisorPanel.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";

function AdvisorPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastAdvisorItem1 = "Item1";
  const lastAdvisorItem2 = "Item2";
  const lastAdvisorItem3 = "Item3";
  const lastAdvisorItem4 = "Item4";
  const lastAdvisorItem5 = "Item5";
  const lastAdvisorItem6 = "Item6";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  return (
    <div className="advisorPanel">
      <HeaderGlobal name={"ADVISOR PANEL"} />
      <div className="buttonAdvisorPanelSection"></div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default AdvisorPanel;
