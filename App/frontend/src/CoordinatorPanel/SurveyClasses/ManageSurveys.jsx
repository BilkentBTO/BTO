import React, { useState } from "react";
import HeaderPanelGlobal from "../../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../../GlobalClasses/TableWithButtons";
import "./ManageSurveys.css";

function ManageSurveys() {
  const [surveys, setSurveys] = useState([
    ["Survey #1"],
    ["Survey #2"],
    ["Survey #3"],
    ["Survey #4"],
    ["Survey #5"],
  ]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newSurveyName, setNewSurveyName] = useState("");
  const [showManagePopup, setShowManagePopup] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const headers = ["Survey Name"];

  // Handle "Create Survey" popup
  const handleCreateSurvey = () => {
    setShowCreatePopup(true);
  };

  const handleAddSurvey = () => {
    if (newSurveyName.trim() !== "") {
      setSurveys((prev) => [...prev, [newSurveyName]]);
      setNewSurveyName("");
      setShowCreatePopup(false);
    }
  };

  // Handle "Manage" button click
  const handleManageSurvey = (survey) => {
    setSelectedSurvey(survey);
    setShowManagePopup(true);
  };

  const handleCloseManagePopup = () => {
    setShowManagePopup(false);
    setSelectedSurvey(null);
  };

  return (
    <div>
      <HeaderPanelGlobal name="Survey Panel" />
      <div className="surveyPanel">
        {/* TableWithButtons */}
        <TableWithButtons
          headers={headers}
          data={surveys}
          onButtonClick={handleManageSurvey}
          buttonName="Manage"
          buttonStyle={{ backgroundColor: "#4CAF50" }}
        />

        {/* Create Survey Popup */}
        {showCreatePopup && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Create New Survey</h2>
              <input
                type="text"
                placeholder="Enter survey name"
                value={newSurveyName}
                onChange={(e) => setNewSurveyName(e.target.value)}
                className="popupInput"
              />
              <div className="popupActions">
                <button onClick={handleAddSurvey} className="confirmButton">
                  Add Survey
                </button>
                <button
                  onClick={() => setShowCreatePopup(false)}
                  className="cancelButton"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Survey Popup */}
        {showManagePopup && selectedSurvey && (
          <div className="popupOverlay">
            <div className="popupContent">
              <h2>Manage {selectedSurvey[0]}</h2>
              <p>Here you can manage the survey details.</p>
              <div className="popupActions">
                <button
                  onClick={handleCloseManagePopup}
                  className="confirmButton"
                >
                  Start
                </button>
                <button
                  onClick={handleCloseManagePopup}
                  className="confirmButton"
                >
                  Edit
                </button>
                <button
                  onClick={handleCloseManagePopup}
                  className="confirmButton"
                >
                  Delete
                </button>
                <button
                  onClick={handleCloseManagePopup}
                  className="confirmButton"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSurveys;
