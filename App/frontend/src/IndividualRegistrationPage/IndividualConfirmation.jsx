import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "../SchoolRegistrationPage/SchoolRegistrationPage.css";
import { parseISO, formatISO } from "date-fns";

// Helper functions
const convertDateToUTC = (dateString) => {
  if (!dateString) return null;
  const parsedDate = parseISO(`${dateString}T00:00:00Z`);
  return formatISO(parsedDate, { representation: "complete" });
};

const convertTimeToUTC = (dateString, timeString) => {
  if (!dateString || !timeString) return null;
  const combinedDateTime = `${dateString}T${timeString}:00Z`;
  const parsedDateTime = parseISO(combinedDateTime);
  return formatISO(parsedDateTime, { representation: "complete" });
};

function IndividualConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const formData = location.state?.formData || {};
  console.log("FORM RECEIVED: ", formData);

  const handleEdit = () => {
    // Navigate back to the registration page with the current formData
    navigate("/individualRegistration", { state: { formData } });
  };

  const confirmReg = async () => {
    setIsSubmitting(true); // Show loading state

    const dateOfVisitUTC = convertDateToUTC(formData.visitDate);
    if (!dateOfVisitUTC) {
      alert("Invalid visit date.");
      setIsSubmitting(false);
      return;
    }

    const startTimeUTC = convertTimeToUTC(
      formData.visitDate,
      formData.visitTime
    );
    if (!startTimeUTC) {
      alert("Invalid visit time.");
      setIsSubmitting(false);
      return;
    }

    const endTime = new Date(startTimeUTC);
    endTime.setHours(endTime.getHours() + 2);
    const endTimeUTC = formatISO(endTime, { representation: "complete" });
    console.log("FORM DATA: ", formData);
    const registrationRequest = {
      dateOfVisit: dateOfVisitUTC,
      prefferedVisitTime: {
        id: 0,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
      },
      individualName: formData.name,
      individualSurname: formData.surname,
      individualMajorCode: formData.individualMajorCode,
      individualMajor: formData.individualMajor,
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
