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

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.surname ||
      !formData.bilkentID ||
      !formData.majorCode ||
      !formData.currentYear ||
      !formData.mail
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Build the request body with correct key names
    const payload = {
      Name: formData.name, // Correct capitalization
      Surname: formData.surname,
      bilkentID: parseInt(formData.bilkentID, 10),
      majorCode: formData.majorCode,
      currentYear: parseInt(formData.currentYear, 10), // Ensure it's a number
      Mail: formData.mail,
    };

    try {
      console.log("Payload being sent: ", JSON.stringify(payload));
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send fixed payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.title || "Failed to register user.");
      }

      // Navigate to success page
      console.log("Registration successful");
      navigate("/successJoin", { state: { formData } });
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Registration failed: ${error.message}`);
    }
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
                <p>{formData.bilkentID}</p>
              </div>
            </div>
            <div className="infoLogNote">
              <div className="box">
                <p>Email:</p>
              </div>
              <div className="info">
                <p>{formData.mail}</p>
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
                <p>{formData.majorCode}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Current Year:</p>
              </div>
              <div className="info">
                <p>{formData.currentYear}</p>
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
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="formPopupOverlay">
          <div className="formPopupContent">
            <h2>Confirm Registration</h2>
            <p>Are you sure you want to confirm this registration?</p>
            <div className="formPopupActions">
              <button onClick={handleSubmit} className="formPopupConfirmButton">
                Confirm
              </button>
              <button onClick={closePopup} className="formPopupCancelButton">
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
