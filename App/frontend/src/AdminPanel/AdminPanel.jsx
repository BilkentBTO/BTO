import "./AdminPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const handleListCoordinatorsClick = () => {
    // Implement Later
  };

  const handleAddCoordinatorClick = () => {
    // Implement Later
  };

  const handleAccessDataPanelClick = () => {
    // Implement Later
  };

  const handleAccessCoordinatorPanelClick = () => {
    console.log("Access Coordinator Panel button clicked");
    navigate("/coordinatorPanel");
  };

  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastAdminItem1 = "Item1";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  return (
    <div className="adminPanel">
      <HeaderPanelGlobal name={"ADMIN PANEL"} />
      <div className="buttonAdminPanelSection">
        <div className="buttonAdminPanel">
          <button onClick={handleListCoordinatorsClick}>
            List Coordinators
          </button>
          <p className="lastAdminItem">{lastAdminItem1}</p>
        </div>
        <div className="buttonAdminPanel">
          <button onClick={handleAccessDataPanelClick}>
            Access to Data Panel
          </button>
        </div>
        <div className="buttonAdminPanel">
          <button onClick={handleAddCoordinatorClick}>Add Coordinator</button>
        </div>
        <div className="buttonAdminPanel">
          <button onClick={handleAccessCoordinatorPanelClick}>
            Access to Coordinator Panel
          </button>
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default AdminPanel;
