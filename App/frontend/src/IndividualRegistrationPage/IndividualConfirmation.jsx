import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import { parseISO, formatISO } from "date-fns";

// Helper functions

function IndividualConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const formData = location.state?.formData || {};

  const handleEdit = () => {
    //  Navigate back to the registration page with the current formData
    navigate("/individualRegistration", { state: { formData } });
  };

  const confirmReg = async () => {
    setIsSubmitting(true); // Show loading state
    console.log("Visit Date:", formData.visitDate);
    console.log("Visit Time:", formData.visitTime);
    const convertTimeToUTC = (dateString, timeString) => {
      if (!dateString || !timeString) {
        console.error("Missing date or time:", { dateString, timeString });
        return null;
      }

      const combinedDateTime = `${dateString}T${timeString}:00Z`;
      const parsedDateTime = new Date(combinedDateTime);

      if (isNaN(parsedDateTime.getTime())) {
        console.error("Invalid date-time string:", combinedDateTime);
        return null;
      }

      return parsedDateTime.toISOString();
    };

    const startTimeUTC = convertTimeToUTC(
      formData.visitDate,
      formData.visitTime
    );

    console.log("TIME: ", startTimeUTC);
    if (!startTimeUTC) {
      alert("Invalid visit time.");
      setIsSubmitting(false);
      return;
    }
    console.log("FORM DATA: ", formData);
    const registrationRequest = {
      dateOfVisit: startTimeUTC,
      individualName: formData.name,
      individualSurname: formData.surname,
      individualPreferredMajorCode: formData.individualMajorCode,
      individualPhoneNumber: formData.individualPhoneNumber,
      individualMailAddress: formData.individualMailAddress,
      notes: formData.notes,
    };

    console.log("REG DATA: ", registrationRequest);
    try {
      const response = await fetch("/api/register/individual", {
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

      // Navigate to the success page with the response
      navigate("/successIndividualRegistration", {
        state: { successMessage: responseText },
      });
    } catch (error) {
      console.error("Error registering individual:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setShowPopup(false);
    }
  };

  const handleConfirmClick = () => {
    setShowPopup(true); // Show the popup
  };

  const closePopup = () => {
    setShowPopup(false); // Hide the popup
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"Confirmation Page"}></HeaderGlobal>
      <div className="innerSchoolConfirmation">
        <div className="topInnerSchool">
          <div className="leftInnerSchool">
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
                <p>{formData.individualMajor}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Phone Number:</p>
              </div>
              <div className="info">
                <p>{formData.individualPhoneNumber}</p>
              </div>
            </div>
            <div className="infoLog">
              <div className="box">
                <p>Mail Address:</p>
              </div>
              <div className="info">
                <p>{formData.individualMailAddress}</p>
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
            {/* Add other fields here */}
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

export default IndividualConfirmation;
