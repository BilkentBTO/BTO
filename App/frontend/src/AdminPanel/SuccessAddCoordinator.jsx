import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import "./SuccessAddCoordinatorPage.css";

function SuccessAddCoordinator() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the submitted form data from the previous page
  const formData = location.state?.formData || {};
  console.log("Final Coordinator Data:", formData);

  useEffect(() => {
    // Perform additional operations with the formData here
    const performActions = async () => {
      try {
        // Example: Simulate saving the data to a server
        console.log("Saving coordinator data to the server...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulated delay
        console.log("Data saved successfully!");

        // After operations, navigate to AdminPanel
        navigate("/adminPanel");
      } catch (error) {
        console.error("Error while processing coordinator data:", error);
      }
    };

    performActions();
  }, [navigate, formData]);

  return (
    <div>
      <HeaderPanelGlobal name="ADMIN PANEL - Success" />
      <div className="successAddCoordinatorPage">
        <div className="successMessageContainer">
          <h1>Coordinator Added Successfully!</h1>
          <p>
            The coordinator{" "}
            <strong>
              {formData.name} {formData.surname}
            </strong>{" "}
            has been successfully added.
          </p>
          <p>Redirecting you to the Admin Panel...</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessAddCoordinator;
