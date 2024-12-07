import MainRegButton from "../MainPage/MainRegButton";
import "./AdminPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";

function AdminPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastAdminItem1 = "Item1";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  return (
    <div className="adminPanel">
      <HeaderPanelGlobal name={"ADMIN PANEL"} />
      <div className="buttonAdminPanelSection">
        <div className="buttonAdminPanel">
          <MainRegButton name="List Coordinators" link="/listCoordinators" />
          <p className="lastAdminItem">{lastAdminItem1}</p>
        </div>
        <div className="buttonAdminPanel">
          <MainRegButton name="Access Data Panel" link="/dataPanel" />
        </div>
        <div className="buttonAdminPanel">
          <MainRegButton name="Add Coordinator" link="/addCoordinator" />
        </div>
      </div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default AdminPanel;
