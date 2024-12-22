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
        public int ID { get; set; }
        public string? Code { get; set; }
        public int SurveyID { get; set; }
        public bool IsStarted { get; set; }
        public bool IsFinished { get; set; }
        public List<VisitorAnswer> VisitorAnswer { get; set; } = new List<VisitorAnswer>();

    }

    /// <summary>
    /// Represents a visitor's answers and comments for a quiz.
    /// Constraints:
    /// - 'VisitorId' must match a valid visitor in the system.
    /// - 'answers' list must contain valid response IDs.
    /// - 'comment' can be an empty string but should not exceed character limits (if applicable).
    /// </summary>
    public class VisitorAnswer
    {
        public int ID { get; set; }
        public int VisitorId { get; set; }
        public List<int> answers { get; set; } = new List<int>();
        public string comment { get; set; } = string.Empty;
    }
}
