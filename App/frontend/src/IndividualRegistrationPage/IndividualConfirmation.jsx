import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "../SchoolRegistrationPage/SchoolRegistrationPage.css";

function IndividualConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  // Initialize formData with all fields
  const formData = location.state?.formData || {};
  console.log("FORM RECEIVED: ", formData);

  const handleEdit = () => {
    // Navigate back to the registration page with the current formData
    navigate("/individualRegistration", { state: { formData } });
  };

  // Function to handle the "Confirm" button click
  const confirmReg = () => {
    // Perform registration confirmation actions (e.g., send data to a server)
    console.log("Registration Confirmed:", formData);

    // Navigate to a success page or show a success message
    navigate("/successIndividualRegistration", { state: { formData } });
  };

  // Function to open the confirmation popup
  const handleConfirmClick = () => {
    setShowPopup(true); // Show the popup
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false); // Hide the popup
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"Confirmation Page"}></HeaderGlobal>
      <div className="innerSchoolConfirmation">
        <div className="topInner">
          <div className="leftInner">
            {/* Individual Info */}
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
                <p>Visit Date:</p>
              </div>
              <div className="info">
                <p>{formData.visitDate}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Visit Time:</p>
              </div>
              <div className="info">
                <p>{formData.visitTime}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Preferred Major:</p>
              </div>
              <div className="info">
                <p>{formData.major}</p>
              </div>
            </div>
            <div className="infoLogNote">
              <div className="box">
                <p>Notes:</p>
              </div>
              <div className="info">
                <p>{formData.notes}</p>
              </div>
            </div>
            <div className="buttonLayout">
              <button className="formEditButton" onClick={handleEdit}>
                Edit
              </button>
              <button
                className="formConfirmButton"
                onClick={handleConfirmClick}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
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

export default IndividualConfirmation;
