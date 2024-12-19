import "./AdminPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const handleListCoordinatorsClick = () => {
    navigate("/adminPanel/listCoordinators");
  };

  const handleAddCoordinatorClick = () => {
    navigate("/adminPanel/addCoordinator");
  };

  const handleAccessDataPanelClick = () => {
    navigate("/adminPanel/dataPanel");
  };

  const handleAccessCoordinatorPanelClick = () => {
    console.log("Access Coordinator Panel button clicked");
    navigate("/coordinatorPanel");
  };
  return (
    <div className="adminPanel">
      <HeaderPanelGlobal name={"ADMIN PANEL"} />
      <div className="innerAdmin">
        <div className="buttonAdminPanelSection">
          <button onClick={handleListCoordinatorsClick}>
            List Coordinators
          </button>

          <button onClick={handleAccessDataPanelClick}>
            Access to Data Panel
          </button>

          <button onClick={handleAddCoordinatorClick}>Add Coordinator</button>

          <button onClick={handleAccessCoordinatorPanelClick}>
            Access to Coordinator Panel
          </button>
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>
    </div>
  );
}
export default AdminPanel;
