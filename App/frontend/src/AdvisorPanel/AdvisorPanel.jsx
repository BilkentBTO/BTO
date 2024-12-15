import MainRegButton from "../MainPage/MainRegButton";
import "./AdvisorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function AdvisorPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastAdvisorItem1 = "Item1";
  const lastAdvisorItem2 = "Item2";
  const lastAdvisorItem3 = "Item3";
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

  const handleAccessMessagePanelClick = () => {};

  const handleAccessGuidePanelClick = () => {
    console.log("Guide Panel button clicked");
    navigate("/guidePanel");
  };

  const handleResponsibleToursClick = () => {
    console.log("Responsible Tours button clicked");
    navigate("/advisorPanel/responsibleTours");
  };

  return (
    <div className="advisorPanel">
      <HeaderPanelGlobal name={"ADVISOR PANEL"} />
      <div className="buttonAdvisorPanelSection">
        <div className="buttonAdvisorPanel">
          <button onClick={handleToursAndGuidesClick}>Tours and Guides</button>
          <p className="lastAdvisorItem">{lastAdvisorItem1}</p>
        </div>
        <div className="buttonAdvisorPanel">
          <button onClick={handleGuideRequestsClick}>Guide Requests</button>
          <p className="lastAdvisorItem">{lastAdvisorItem2}</p>
        </div>
        <div className="buttonAdvisorPanel">
          <button onClick={handleEvaluateTourRequestsClick}>
            Evaluate Tour Requests
          </button>
        </div>
        <div className="buttonAdvisorPanel">
          <button onClick={handleAccessMessagePanelClick}>
            Access Message Panel
          </button>
        </div>
        <div className="buttonAdvisorPanelTour">
          <button onClick={handleAccessGuidePanelClick}>
            Access Guide Panel
          </button>
        </div>
        <div className="buttonAdvisorPanel">
          <button onClick={handleResponsibleToursClick}>
            Responsible Tours
          </button>
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
