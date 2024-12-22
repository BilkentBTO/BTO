import React, { useState } from "react";
import HeaderGlobal from "../GlobalClasses/HeaderGlobal";
import ButtonHeaderGlobal from "../GlobalClasses/ButtonHeaderGlobal";
import { useNavigate } from "react-router-dom";
import "./SurveyCodePage.css";
import returnButton from "../assets/return.png";

function SurveyCodePage() {
  const [surveyCode, setSurveyCode] = useState(""); // Input field state
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // Popup message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Function to fetch survey data
  const handleViewSurvey = async () => {
    // TEST IF CLAUSE, DELETE LATER
    if (true) {
      navigate("/viewSchoolSurvey");
    } else {
      navigate("/viewIndividualSurvey");
    }
    /*
    if (!surveyCode.trim()) {
      setPopupMessage("Please enter a valid survey code.");
      setIsPopupVisible(true);
      return;
    }

    setIsLoading(true); // Show loading state
    try {
      const response = await fetch(
        `api/register/general?Code=${surveyCode}` // CHANGE ACCORDING TO ERTUGRUL
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (true) { // CHANGE ACCORDING TO ERTUGRUL
        navigate("/viewSchoolSurvey", {
          state: { surveyData: data },
        });
      } else {
        navigate("/viewIndividualSurvey", {
          state: { surveyData: data },
        });
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
      setPopupMessage("Failed to retrieve survey. Please check the code.");
      setIsPopupVisible(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
    */
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Hide the pop-up
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="regCodePage">
      <HeaderGlobal name={"VIEW SURVEY"}></HeaderGlobal>
      <div className="regCodePageInputSection">
        <div className="regCodePageContainer">
          <h2 className="regCodePageInputTitle">Enter Your Survey Code</h2>
          <input
            type="text"
            className="regCodePageInputField"
            placeholder="Type Code"
            value={surveyCode}
            onChange={(e) => setSurveyCode(e.target.value)}
          />
          <button
            className="regCodePageInputButton"
            onClick={handleViewSurvey}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View Survey"}
          </button>
          <button
            className="regCodePageBackButton"
            onClick={handleBackClick}
            disabled={isLoading}
          >
            Back
          </button>
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

export default SurveyCodePage;
