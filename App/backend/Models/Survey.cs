/// <summary>
/// This file defines the model for a survey, including its unique ID, title, and the list of questions.
/// The `Survey` class is used to manage survey data within the backend system.
/// </summary>
namespace backend.Models
{
    /// <summary>
    /// Represents a survey with a unique ID, title, and a list of questions.
    /// Constraints:
    /// - 'Title' should be a non-empty string.
    /// - 'Questions' must contain a list of valid question strings.
    /// </summary>
    public class Survey
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Questions { get; set; } = new List<string>();
    }
}
