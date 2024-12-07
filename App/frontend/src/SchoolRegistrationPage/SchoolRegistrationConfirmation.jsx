import React from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import { useLocation, useNavigate } from "react-router-dom";
import "./SchoolRegistrationPage.css";

function SchoolRegistrationConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize formData with all fields
  const formData = location.state?.formData || {};
  console.log("FORM RECIEVED: ", formData);
  const handleEdit = () => {
    // Navigate back to the registration page with the current formData
    navigate("/schoolRegistration", { state: { formData } });
  };

  // Function to handle the "Confirm" button click
  const confirmReg = () => {
    // Perform registration confirmation actions (e.g., send data to a server)
    console.log("Registration Confirmed:", formData);

    // Navigate to a success page or show a success message
    navigate("/successSchoolRegistration", { state: { formData } });
  };

  return (
    <div className="schoolRegistrationPage">
      <HeaderGlobal name={"Confirmation Page"}></HeaderGlobal>
      <div className="innerSchoolConfirmation">
        <div className="topInner">
          <div className="leftInner">
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
          <div className="rightInner">
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
export default SchoolRegistrationConfirmation;
