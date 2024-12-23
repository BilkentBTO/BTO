/// <summary>
/// This file defines the models for managing quizzes and visitor answers
/// within the backend system. It includes the Quiz class to handle quiz
/// data and the VisitorAnswer class for storing visitor responses.
/// </summary>
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    /// <summary>
    /// Represents a quiz with a unique code, an associated school, and a list of related surveys.
    /// Constraints:
    /// - Code is optional and can be null.
    /// - SchoolCode is optional and can be null.
    /// - UID is the unique identifier for the user associated with the quiz.
    /// </summary>
    public class Quiz
    {
        public string? Code { get; set; }
        public int? SchoolCode { get; set; }
        public int UID { get; set; }
        public List<Survey> Surveys { get; set; } = new List<Survey>();
    }

    /// <summary>
    /// Represents data associated with a guide, including the guide's user ID,
    /// the average points they have earned, and the number of completed tours.
    /// Constraints:
    /// - UID is the unique identifier for the guide (user).
    /// - AveragePoints and CompletedTours are floating-point values representing the guide's performance.
    /// </summary>
    public class GuideData
    {
        public int UID { get; set; }

        [NotMapped]
        public User? Guide { get; set; }
        public float AveragePoints { get; set; }
        public float CompletedTours { get; set; }
    }

    /// <summary>
    /// Represents data associated with a school, including the school code, 
    /// the total number of tours, and ratings for the tour and Bilkent.
    /// Constraints:
    /// - SchoolCode is optional and can be null.
    /// - TotalTours, RateTour, RateBilkent, and ApplyToBilkent are floating-point values.
    /// </summary>
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
