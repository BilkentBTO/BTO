import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import { useNavigate } from "react-router-dom";
import "./RegCode.css";
import returnButton from "../assets/return.png";

function RegCodePage() {
  const [registrationCode, setRegistrationCode] = useState(""); // Input field state
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // Popup message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Function to fetch registration data
  const handleViewRegistration = async () => {
    if (!registrationCode.trim()) {
      setPopupMessage("Please enter a valid registration code.");
      setIsPopupVisible(true);
      return;
    }

    setIsLoading(true); // Show loading state
    try {
      const response = await fetch(
        `api/register/general?Code=${registrationCode}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the API response

      // Navigate to the next page with the API response
      navigate("/viewRegistrationDetails", {
        state: { registrationData: data },
      });
    } catch (error) {
      console.error("Error fetching registration:", error);
      setPopupMessage(
        "Failed to retrieve registration. Please check the code."
      );
      setIsPopupVisible(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Hide the pop-up
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="regCodePage">
      <HeaderGlobal name={"VIEW YOUR REGISTRATION"}></HeaderGlobal>
      <div className="regCodePageInputSection">
        <div className="regCodePageContainer">
          <h2 className="regCodePageInputTitle">
            Enter Your Registration Code
          </h2>
          <input
            type="text"
            className="regCodePageInputField"
            placeholder="Type Code"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
          />
          <button
            className="regCodePageInputButton"
            onClick={handleViewRegistration}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View Registration"}
          </button>
          <button
            className="regCodePageBackButton"
            onClick={handleBackClick}
            disabled={isLoading}
          >
            Back
          </button>
        </div>
        <div className="contactSection">
          <p className="contactInfo"></p>
        </div>
      </div>

      {/* Pop-up for error message */}
      {isPopupVisible && (
        <div className="regCodePagePopup">
          <div className="regCodePagePopupContent">
            <p>{popupMessage}</p>
            <button className="regCodePagePopupButton" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegCodePage;
