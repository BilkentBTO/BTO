import React, { useState } from "react";
import "./CreateSurvey.css";
import HeaderPanelGlobal from "../../GlobalClasses/HeaderPanelGlobal";

function CreateSurvey() {
  const [surveyName, setSurveyName] = useState(""); // Survey name
  const [questions, setQuestions] = useState([]); // List of questions
  const [newQuestion, setNewQuestion] = useState(""); // New question input

  // Handle survey name change
  const handleSurveyNameChange = (e) => {
    setSurveyName(e.target.value);
  };

  // Add a question to the list
  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      setQuestions((prev) => [...prev, newQuestion]);
      setNewQuestion(""); // Clear the input field
    }
  };

  // Delete a specific question
  const handleDeleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Save survey logic (to be implemented)
  const handleSaveSurvey = () => {
    if (surveyName.trim() === "" || questions.length === 0) {
      alert("Please provide a survey name and at least one question.");
      return;
    }

    // Example: Log survey to console
    const survey = {
      name: surveyName,
      questions,
    };
    console.log("Survey Created:", survey);

    // Clear form after saving
    setSurveyName("");
    setQuestions([]);
    alert("Survey created successfully!");
  };

  return (
    <div>
      <HeaderPanelGlobal name="Create Survey" />
      <div className="createSurveyPage">
        <div className="surveyForm">
          {/* Survey Name Input */}
          <div className="inputGroup">
            <label htmlFor="surveyName">Survey Name:</label>
            <input
              type="text"
              id="surveyName"
              value={surveyName}
              onChange={handleSurveyNameChange}
              placeholder="Enter survey name"
            />
          </div>

          {/* Add Question Section */}
          <div className="inputGroup">
            <label htmlFor="newQuestion">Add Question:</label>
            <input
              type="text"
              id="newQuestion"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter question"
            />
            <button onClick={handleAddQuestion} className="addButton">
              Add Question
            </button>
          </div>

          {/* Questions List */}
          <div className="questionsList">
            <h3>Questions:</h3>
            {questions.length === 0 ? (
              <p>No questions added yet.</p>
            ) : (
              <ul>
                {questions.map((question, index) => (
                  <li key={index} className="questionItem">
                    <span>{question}</span>
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="deleteButton"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Save Survey Button */}
          <button onClick={handleSaveSurvey} className="saveButton">
            Save Survey
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSurvey;
