import "./AdminPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import GlobalSidebar from "../GlobalClasses/GlobalSidebar";

function AdminPanel() {
  const navigate = useNavigate();

  console.log();

  const handleListCoordinatorsClick = () => {
    navigate("/adminPanel/listCoordinators");
  };

  const handleAddCoordinatorClick = () => {
    navigate("/adminPanel/addCoordinator");
  };

  const handleAccessCoordinatorPanelClick = () => {
    console.log("Access Coordinator Panel button clicked");
    navigate("/coordinatorPanel");
  };
  return (
    <div className="adminPanel">
      <div className="innerAdmin">
        <GlobalSidebar />

        <div className="buttonAdminPanelSection">
          <button onClick={handleListCoordinatorsClick}>
            List Coordinators
          </button>

          <button onClick={handleAddCoordinatorClick}>Add Coordinator</button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default AdminPanel;
