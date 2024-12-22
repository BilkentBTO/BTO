/// <summary>
/// This file defines the models for managing quizzes and visitor answers 
/// within the backend system. It includes the Quiz class to handle quiz 
/// data and the VisitorAnswer class for storing visitor responses.
/// </summary>
namespace backend.Models
{

    /// <summary>
    /// Represents a quiz with a unique code, associated survey, and its state.
    /// Constraints:
    /// - 'Code' can be null, but it should be a valid, non-empty string if provided.
    /// - 'SurveyID' must correspond to a valid survey in the system.
    /// - 'VisitorAnswer' list must contain valid visitor responses.
    /// </summary>
    public class Quiz
    {
        public string? Code { get; set; }
        public int? SchoolCode { get; set; }
        public List<Survey> Surveys { get; set; } = new List<Survey>();
    }
}
