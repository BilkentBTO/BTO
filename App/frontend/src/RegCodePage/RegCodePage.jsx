import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./RegCode.css";

function RegCodePage() {
  const [registrationCode, setRegistrationCode] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleViewRegistration = () => {
    // Validate registration code
    // TEMPORARY INFORMATION IS USED !!!!!!!!!!
    if (registrationCode !== "CANGA123") {
      // TEMPORARY INFORMATION IS USED !!!!!!!!!!
      setPopupMessage("Error: Invalid registration code entered.");
      setIsPopupVisible(true);
      return;
    }

    // Navigate to the registration page if the code is valid
    navigate("/yourRegistration", {
      state: {
        // TEMPORARY INFORMATION IS USED !!!!!!!!!!
        registrationCode: "CANGA123",
        schoolName: "Bilkent",
        city: "Ankara",
        visitDate: "01/02/2025",
        preferedDate: "01/02/2025",
        visitorNum: "15",
        supervisor: "Can",
        supervisorDuty: "Headmaster",
        supervisorPhoneNum: "0342352",
        supervisorMail: "kutuk@mail.com",
        notes: "5 min late",
        // TEMPORARY INFORMATION IS USED !!!!!!!!!!
      },
    });
  };
  useEffect(() => {
    document.title = "View Registration Code - BTO"; // Set the tab title
  }, []);

  const closePopup = () => {
    setIsPopupVisible(false); // Hide the pop-up
  };

  return (
    <div className="regCodePage">
      <HeaderGlobal name={"VIEW YOUR REGISTRATION"}></HeaderGlobal>
      <div className="inputSection">
        <h2 className="inputTitle">Enter Your Registration Code</h2>
        <input
          type="text"
          className="inputField"
          placeholder="Type Code"
          value={registrationCode}
          onChange={(e) => setRegistrationCode(e.target.value)}
        />
        <button className="inputButton" onClick={handleViewRegistration}>
          View
        </button>
        <ButtonHeaderGlobal
          name={"Go to home page"}
          link="/"
        ></ButtonHeaderGlobal>
      </div>

      {/* Pop-up for error message */}
      <div id="popup" className={`popup ${isPopupVisible ? "" : "hidden"}`}>
        <div className="popup-content">
          <p id="popup-message">{popupMessage}</p>
          <button
            id="close-popup"
            className="popup-button"
            onClick={closePopup}
          >
            Close
          </button>
        </div>
      </div>

      <div className="contactSection">
        <p className="contactInfo"></p>
      </div>
    </div>
  );
}

export default RegCodePage;
