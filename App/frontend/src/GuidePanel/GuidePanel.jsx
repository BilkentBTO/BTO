import MainRegButton from "../MainPage/MainRegButton";
import "./GuidePanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";

function GuidePanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastGuideItem1 = "Item1";
  const lastGuideItem2 = "Item2";
  const lastGuideItem3 = "Item3";
  const lastGuideItem4 = "Item4";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  return (
    <div className="guidePanel">
      <HeaderPanelGlobal name={"GUIDE PANEL"} />
      <div className="buttonGuidePanelSection">
        <div className="buttonGuidePanel">
          <MainRegButton name="Available Tours" link="/availableTours" />
          <p className="lastGuideItem">{lastGuideItem1}</p>
        </div>
        <div className="buttonGuidePanel">
          <MainRegButton name="Assigned Fairs" link="/assignedFairs" />
          <p className="lastGuideItem">{lastGuideItem2}</p>
        </div>
        <div className="buttonGuidePanel">
          <MainRegButton name="Assigned Tours" link="/assignedTours" />
          <p className="lastGuideItem">{lastGuideItem3}</p>
        </div>
        <div className="buttonGuidePanel">
          <MainRegButton
            name="Edit Available Hours"
            link="/editAvailableHours"
          />
          <p className="lastGuideItem">{lastGuideItem4}</p>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default GuidePanel;
