/// <summary>
/// This file defines the models for managing quizzes and visitor answers
/// within the backend system. It includes the Quiz class to handle quiz
/// data and the VisitorAnswer class for storing visitor responses.
/// </summary>
namespace backend.Models
{
    public class Quiz
    {
        public string? Code { get; set; }
        public int? SchoolCode { get; set; }
        public List<Survey> Surveys { get; set; } = new List<Survey>();
    }
}
