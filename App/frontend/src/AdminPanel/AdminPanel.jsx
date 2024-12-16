import "./AdminPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const handleListCoordinatorsClick = () => {
    navigate("/adminPanel/listCoordinators");
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
  return (
    <div>
      <HeaderPanelGlobal name={"ADMIN PANEL"} />
      <div className="adminPanel">
        <div className="buttonAdminPanelSection">
          <div className="buttonAdminPanel">
            <button onClick={handleListCoordinatorsClick}>
              List Coordinators
            </button>
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
    </div>
  );
}
export default AdminPanel;
