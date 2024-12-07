import MainRegButton from "../MainPage/MainRegButton";
import "./AdvisorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";

function AdvisorPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastAdvisorItem1 = "Item1";
  const lastAdvisorItem2 = "Item2";
  const lastAdvisorItem3 = "Item3";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  return (
    <div className="advisorPanel">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <div className="buttonAdvisorPanelSection">
        <div className="buttonAdvisorPanel">
          <MainRegButton name="Tours and Guides" link="/toursAndGuides" />
          <p className="lastAdvisorItem">{lastAdvisorItem1}</p>
        </div>
        <div className="buttonAdvisorPanel">
          <MainRegButton name="Guide Requests" link="/guideRequests" />
          <p className="lastAdvisorItem">{lastAdvisorItem2}</p>
        </div>
        <div className="buttonAdvisorPanel">
          <MainRegButton name="Access to Guide Panel" link="/guidePanel" />
        </div>
        <div className="buttonAdvisorPanel">
          <MainRegButton name="Access to Message Panel" link="/messagePanel" />
        </div>
        <div className="buttonAdvisorPanelTour">
          <MainRegButton
            name="Evaluate Tour Requests"
            link="/evaluateTourRequests"
          />
        </div>
        <div className="buttonAdvisorPanel">
          <MainRegButton name="Tours Responsible" link="/toursResponsible" />
          <p className="lastAdvisorItem">{lastAdvisorItem3}</p>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default AdvisorPanel;
