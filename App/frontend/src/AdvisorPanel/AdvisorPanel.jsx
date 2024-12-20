import "./AdvisorPanel.css";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function AdvisorPanel() {
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  //TEMPORARY VALUES !!!!!!!!!!!!!!
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(""); // State to hold the user's role

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("TOKEN: ", token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        // Extract the role claim (adjust based on your JWT structure)
        const roleClaim =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || decodedToken.role; // Use "role" if no namespace is used
        setUserRole(roleClaim || "User");

        console.log("Decoded Token:", decodedToken);
        console.log("Role:", roleClaim);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    } else {
      console.log("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  // Sidebar navigation based on role
  const sidebarOptions = {
    Admin: [
      { label: "Admin Panel", path: "/adminPanel" },
      { label: "Coordinator Panel", path: "/coordinatorPanel" },
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Coordinator: [
      { label: "Coordinator Panel", path: "/coordinatorPanel" },
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Advisor: [
      { label: "Advisor Panel", path: "/advisorPanel" },
      { label: "Guide Panel", path: "/guidePanel" },
    ],
    Guide: [{ label: "Guide Panel", path: "/guidePanel" }],
  };

  const navigateToSection = (path) => {
    navigate(path);
  };

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
      <div className="innerAdvisor">
        <div className="leftSideAdvisor">
          <div className="sidebar">
            <h3>Navigation</h3>
            <ul>
              {sidebarOptions[userRole]?.map((option, index) => (
                <li
                  key={index}
                  onClick={() => navigateToSection(option.path)}
                  style={{
                    border: "1px solid white",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="buttonAdvisorPanelSection">
          <button onClick={handleToursAndGuidesClick}>Tours and Guides</button>

          <button onClick={handleGuideRequestsClick}>Guide Requests</button>

          <button onClick={handleEvaluateTourRequestsClick}>
            Evaluate Tour Requests
          </button>

          <button onClick={handleAccessMessagePanelClick}>
            Access Message Panel
          </button>

          <button onClick={handleResponsibleToursClick}>
            Responsible Tours
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default AdvisorPanel;
