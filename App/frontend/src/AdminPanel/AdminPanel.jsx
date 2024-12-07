import MainRegButton from "../MainPage/MainRegButton";
import "./AdminPanel.css";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";

function AdminPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const lastAdminItem1 = "Item1";
  const lastAdminItem2 = "Item2";
  const lastAdminItem3 = "Item3";
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  return (
    <div className="adminPanel">
      <HeaderGlobal name={"ADMIN PANEL"} />
      <div className="buttonAdminPanelSection"></div>
      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}
export default AdminPanel;
