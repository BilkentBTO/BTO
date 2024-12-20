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
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
              maxWidth: "120px",
              textAlign: "center",
              transition: "background-color 0.3s ease, transform 0.2s ease",
            }}
            onClick={handleCreateSurvey}
            className="createSurveyButton"
          >
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
          buttonStyle={{
            padding: "8px 16px",
            backgroundColor: "#1e1e64",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            width: "100%",
            maxWidth: "120px",
            textAlign: "center",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
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
                <button
                  onClick={handleAddSurvey}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  className="confirmButton"
                >
                  Add Survey
                </button>
                <button
                  onClick={() => setShowCreatePopup(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
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
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onClick={() => alert(`Starting ${selectedSurvey[0]}`)}
                >
                  Start
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#1e1e64",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onClick={() => alert(`Editing ${selectedSurvey[0]}`)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onClick={handleDeleteSurvey}
                >
                  Delete
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "grey",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    maxWidth: "120px",
                    textAlign: "center",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onClick={handleCloseManagePopup}
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
