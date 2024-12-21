import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "./SchoolRegistrationPage.css";

function SchoolRegistrationConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize formData with all fields
  const formData = location.state?.formData || {};
  console.log("FORM RECEIVED: ", formData);

  const handleEdit = () => {
    // Navigate back to the registration page with the current formData
    navigate("/schoolRegistration", { state: { formData } });
  };

  // Function to handle the "Confirm" button click
  const handleConfirmClick = () => {
    setShowPopup(true); // Show the popup
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false); // Hide the popup
  };

  const confirmReg = async () => {
    setIsSubmitting(true); // Show loading state

    const convertTimeToUTC = (dateString, timeString) => {
      if (!dateString || !timeString) return null;
      const combinedDateTime = `${dateString}T${timeString}:00Z`;
      const parsedDateTime = new Date(combinedDateTime);
      return parsedDateTime.toISOString();
    };

    try {
      const startTimeUTC = convertTimeToUTC(
        formData.visitDate,
        formData.visitTime
      );
      if (!startTimeUTC) {
        alert("Invalid visit time.");
        return;
      }
      console.log("START TIME: ", startTimeUTC);

      const registrationRequest = {
        cityName: formData.city,
        schoolCode: formData.schoolID,
        dateOfVisit: startTimeUTC,
        numberOfVisitors: parseInt(formData.visitorCount, 10),
        superVisorName: formData.supervisorName,
        superVisorDuty: formData.supervisorDuty,
        superVisorPhoneNumber: formData.supervisorPhone,
        superVisorMailAddress: formData.supervisorEmail,
        notes: formData.notes,
      };

      console.log(registrationRequest);
      const response = await fetch("/api/register/tour", {
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
      navigate("/successSchoolRegistration", {
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

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"Confirmation Page"}></HeaderGlobal>
      <div className="innerSchoolConfirmation">
        <div className="topInnerSchool">
          <div className="leftInnerSchool">
            <div className="infoLog">
              <div className="box">
                <p>City:</p>
              </div>
              <div className="info">
                <p>{formData.city}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>School:</p>
              </div>
              <div className="info">
                <p>{formData.school}</p>
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
                <p>Visitor Count:</p>
              </div>
              <div className="info">
                <p>{formData.visitorCount}</p>
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
          </div>
          <div className="rightInnerSchool">
            {/* Right Side Info */}
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Name:</p>
              </div>
              <div className="info">
                <p>{formData.supervisorName}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Duty:</p>
              </div>
              <div className="info">
                <p>{formData.supervisorDuty}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Phone:</p>
              </div>
              <div className="info">
                <p>{formData.supervisorPhone}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Supervisor Email:</p>
              </div>
              <div className="info">
                <p>{formData.supervisorEmail}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonLayout">
          <button className="formEditButton" onClick={handleEdit}>
            Edit
          </button>
          <button
            className="formConfirmButton"
            onClick={handleConfirmClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h2>Confirm Registration</h2>
            <p>Are you sure you want to confirm this registration?</p>
            <div className="popupActions">
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

export default SchoolRegistrationConfirmation;
