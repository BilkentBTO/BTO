import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "../SchoolRegistrationPage/SchoolRegistrationPage.css";

function FairConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize formData with all fields
  const formData = location.state?.formData || {};
  console.log("FORM RECEIVED: ", formData);

  const handleEdit = () => {
    // Navigate back to the registration page with the current formData
    navigate("/inviteBilkent", { state: { formData } });
  };

  // Function to handle the "Confirm" button click
  const confirmReg = async () => {
    setIsSubmitting(true); // Show loading state
    const convertDateToUTC = (dateString) => {
      if (!dateString) return null;
      const parsedDate = new Date(`${dateString}T00:00:00Z`);
      return parsedDate.toISOString();
    };

    const convertTimeToUTC = (dateString, timeString) => {
      if (!dateString || !timeString) return null;
      const combinedDateTime = `${dateString}T${timeString}:00Z`;
      const parsedDateTime = new Date(combinedDateTime);
      return parsedDateTime.toISOString();
    };

    try {
      const registrationRequest = {
        cityName: formData.cityName,
        schoolCode: formData.schoolCode,
        dateOfVisit: formData.dateOfVisit,
        superVisorName: formData.superVisorName,
        superVisorDuty: formData.superVisorDuty,
        superVisorPhoneNumber: formData.superVisorPhoneNumber,
        superVisorMailAddress: formData.superVisorMailAddress,
        notes: formData.notes,
      };

      const response = await fetch("/api/register/fair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(registrationRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("API Response:", responseText);

      // Navigate to the success page with the response
      navigate("/successInvite", {
        state: { successMessage: responseText },
      });
    } catch (error) {
      console.error("Error registering school:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setShowPopup(false);
    }
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
      <HeaderGlobal name={"Confirmation Page"} />
      <div className="innerSchoolConfirmation">
        <div className="topInnerSchool">
          <div className="leftInnerSchool">
            {/* Left Section */}
            <div className="infoLog">
              <div className="box">
                <p>City:</p>
              </div>
              <div className="info">
                <p>{formData.cityName}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>School Code:</p>
              </div>
              <div className="info">
                <p>{formData.schoolCode}</p>
              </div>
            </div>
            <div className="infoLogNote">
              <div className="box">
                <p>Notes:</p>
              </div>
              <div className="info">
                <p>{formData.notes || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="rightInnerSchool">
            {/* Right Section */}
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Name:</p>
              </div>
              <div className="info">
                <p>{formData.superVisorName}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Duty:</p>
              </div>
              <div className="info">
                <p>{formData.superVisorDuty}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Phone:</p>
              </div>
              <div className="info">
                <p>{formData.superVisorPhoneNumber}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Email:</p>
              </div>
              <div className="info">
                <p>{formData.superVisorMailAddress}</p>
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
              <button onClick={confirmReg} className="formPopupConfirmButton">
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

export default FairConfirmation;
