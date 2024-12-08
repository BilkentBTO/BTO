import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "../SchoolRegistrationPage/SchoolRegistrationPage.css";

function JoinConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Initialize formData with all fields
  const formData = location.state?.formData || {};
  console.log("FORM RECEIVED: ", formData);

  const handleEdit = () => {
    // Navigate back to the registration page with the current formData
    navigate("/joinBTO", { state: { formData } });
  };

  const confirmReg = () => {
    console.log("Registration Confirmed:", formData);
    navigate("/successJoin", { state: { formData } });
  };

  const handleConfirmClick = () => setShowPopup(true); // Show the popup
  const closePopup = () => setShowPopup(false); // Hide the popup

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"Confirmation Page"} />
      <div className="innerSchoolConfirmation">
        <div className="topInner">
          <div className="leftInner">
            {/* Left Section */}
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
            <div className="infoLogNote">
              <div className="box">
                <p>Bilkent ID:</p>
              </div>
              <div className="info">
                <p>{formData.id}</p>
              </div>
            </div>
          </div>
          <div className="rightInner">
            {/* Right Section */}
            <div className="infoLog">
              <div className="box">
                <p>Major:</p>
              </div>
              <div className="info">
                <p>{formData.major}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Current Year:</p>
              </div>
              <div className="info">
                <p>{formData.year}</p>
              </div>
            </div>
            <div className="buttonLayout">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleConfirmClick}>Confirm</button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Confirm Registration</h2>
            <p>Are you sure you want to confirm this registration?</p>
            <div className="popupActions">
              <button onClick={confirmReg} className="confirmButton">
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

export default JoinConfirmation;
