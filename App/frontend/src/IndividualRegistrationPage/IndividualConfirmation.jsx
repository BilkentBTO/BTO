import React from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "../SchoolRegistrationPage/SchoolRegistrationPage.css";

function IndividualConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize formData with all fields
  const formData = location.state?.formData || {};
  console.log("FORM RECIEVED: ", formData);
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

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"Confirmation Page"}></HeaderGlobal>
      <div className="innerSchoolConfirmation">
        <div className="topInner">
          <div className="leftInner">
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
              <button onClick={handleEdit}>Edit</button>
              <button onClick={confirmReg}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default IndividualConfirmation;
