import React, { useState } from "react";
import HeaderPanelGlobal from "../../GlobalClasses/HeaderPanelGlobal";
import TableWithButtons from "../../GlobalClasses/TableWithButtons";
import "./ManageSurveys.css";
import { useNavigate } from "react-router-dom";

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

  // Open Create Survey popup
  const handleCreateSurvey = () => {
    setShowCreatePopup(true);
  };

  // Add a new survey and trigger re-render
  const handleAddSurvey = () => {
    if (newSurveyName.trim() !== "") {
      setSurveys((prev) => {
        const updatedSurveys = [...prev, [newSurveyName]];
        return updatedSurveys.sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically
      });
      setNewSurveyName("");
      setShowCreatePopup(false);
    }
  };

  // Open Manage Survey popup
  const handleManageSurvey = (survey) => {
    setSelectedSurvey(survey);
    setShowManagePopup(true);
  };

  // Close the Manage Survey popup
  const handleCloseManagePopup = () => {
    setShowManagePopup(false);
    setSelectedSurvey(null);
  };

  // Delete the selected survey and trigger re-render
  const handleDeleteSurvey = () => {
    setSurveys((prevSurveys) =>
      prevSurveys.filter((survey) => survey[0] !== selectedSurvey[0])
    );
    handleCloseManagePopup();
  };

  return (
    <div className="manageSurveys">
      <HeaderPanelGlobal name="Survey Panel" />
      <div className="surveyPanel">
        {/* Create Survey Button */}
        <div className="createSurveySection">
          <button onClick={handleCreateSurvey} className="createSurveyButton">
            Create Survey
          </button>
        </div>

        {/* TableWithButtons */}
        <TableWithButtons
          key={surveys.length} // Unique key to trigger re-render
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
                  onClick={() => alert(`Starting ${selectedSurvey[0]}`)}
                  className="confirmButton"
                >
                  Start
                </button>
                <button
                  onClick={() => alert(`Editing ${selectedSurvey[0]}`)}
                  className="confirmButton"
                >
                  Edit
                </button>
                <button onClick={handleDeleteSurvey} className="deleteButton">
                  Delete
                </button>
                <button
                  onClick={handleCloseManagePopup}
                  className="closeButton"
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
