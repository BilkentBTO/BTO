import React, { useState } from "react";
import HeaderPanelGlobal from "../GlobalClasses/HeaderPanelGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "./AddCoordinatorPage.css"; // Reuse styles or create a new file

function ConfirmCoordinatorAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Retrieve formData from the previous page's state
  const formData = location.state?.formData || {};
  console.log("Coordinator Data Received: ", formData);

  // Navigate back to the Add Coordinator page for edits
  const handleEdit = () => {
    navigate("/adminPanel/addCoordinator", { state: { formData } });
  };

  // Confirm and finalize the addition
  const confirmAddition = () => {
    console.log("Coordinator Confirmed:", formData);
    // Perform any additional actions like saving data to a server
    navigate("/adminPanel/successCoordinatorAdd", { state: { formData } });
  };

  const handleConfirmClick = () => {
    setShowPopup(true); // Show confirmation popup
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <div className="addCoordinatorPage">
      <HeaderPanelGlobal name="ADMIN PANEL - Confirm Coordinator" />
      <div className="innerAddCoordinatorPage">
        <div className="topInner">
          <div className="leftInner">
            {/* Coordinator Info */}
            <div className="infoLog">
              <div className="box">
                <p>Name:</p>
              </div>
              <div className="info">
                <p>{formData.name}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Surname:</p>
              </div>
              <div className="info">
                <p>{formData.surname}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Username:</p>
              </div>
              <div className="info">
                <p>{formData.username}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Email:</p>
              </div>
              <div className="info">
                <p>{formData.email}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="buttonLayout">
              <button onClick={handleEdit} className="editButton">
                Edit
              </button>
              <button onClick={handleConfirmClick} className="confirmButton">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Confirm Coordinator Addition</h2>
            <p>Are you sure you want to confirm adding this coordinator?</p>
            <div className="popupActions">
              <button onClick={confirmAddition} className="confirmButton">
                Yes, Confirm
              </button>
              <button onClick={closePopup} className="cancelButton">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmCoordinatorAdd;
