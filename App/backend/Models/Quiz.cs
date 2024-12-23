using System.ComponentModel.DataAnnotations.Schema;

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
        public int UID { get; set; }
        public List<Survey> Surveys { get; set; } = new List<Survey>();
    }

    public class GuideData
    {
        public int UID { get; set; }

        [NotMapped]
        public User? Guide { get; set; }
        public float AveragePoints { get; set; }
        public float CompletedTours { get; set; }
    }

    public class SchoolData
    {
        public int? SchoolCode { get; set; }

        [NotMapped]
        public School? School { get; set; }
        public float TotalTours { get; set; }
        public float RateTour { get; set; }
        public float RateBilkent { get; set; }
        public float ApplyToBilkent { get; set; }
    }
}
