/// <summary>
/// This file defines two classes: `Survey` and `SurveyForm`. 
/// - The `Survey` class represents a completed survey with feedback, including ratings for the tour, 
///   guide, and Bilkent, as well as comments and an optional quiz code.
/// - The `SurveyForm` class represents the data required to submit or update a survey. 
///   It includes fields for ratings, a decision on applying to Bilkent, and any additional comments.
/// Both classes support properties that hold survey-related data, with specific constraints like rating ranges and required fields.
/// </summary>
namespace backend.Models
{
    /// <summary>
    /// Represents a completed survey submitted by a user, typically for feedback on a tour, guide, 
    /// and the Bilkent experience. Includes ratings for the guide, tour, and Bilkent, as well as comments. 
    /// The survey can optionally include a quiz code linking to a related quiz.
    /// Constraints:
    /// - Ratings (RateGuide, RateTour, RateBilkent) should be integers in the range of 1 to 5.
    /// - ApplyToBilkent is a binary choice (1 for Yes, 0 for No).
    /// - QuizCode is optional and can be null.
    /// </summary>
    public class Survey
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public int RateGuide { get; set; }
        public int RateTour { get; set; }
        public int RateBilkent { get; set; }
        public int ApplyToBilkent { get; set; }
        public string Comments { get; set; } = string.Empty;
        public string? QuizCode { get; set; }
        public Quiz? Quiz { get; set; } // Navigation property
    }

    /// <summary>
    /// Represents the data required to submit or update a survey, including ratings for the guide, tour, 
    /// and Bilkent, a decision to apply to Bilkent, and additional comments.
    /// Constraints:
    /// - Ratings (RateGuide, RateTour, RateBilkent) should be integers in the range of 1 to 5.
    /// - ApplyToBilkent is a binary choice (1 for Yes, 0 for No).
    /// </summary>
    public class SurveyForm
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public int RateGuide { get; set; }
        public int RateTour { get; set; }
        public int RateBilkent { get; set; }
        public int ApplyToBilkent { get; set; }
        public string Comments { get; set; } = string.Empty;
    }
}
