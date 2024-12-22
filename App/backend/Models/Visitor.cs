/// <summary>
/// This file defines the data models for managing visitor-related information 
/// in the backend. It includes an enum for visitor types and a class for 
/// storing detailed visitor data.
/// </summary>
namespace backend.Models
{
    public enum VisitorType
    {
        School = 0, // School visitor
        Individual = 1, // Individual visitor
        Summer = 2, // Summer program visitor
    }

    /// <summary>
    /// Represents a visitor with details like type, name, city, and associated guide.
    /// Constraints:
    /// - 'type' must match one of the VisitorType enum values.
    /// - 'Name', 'Surname', 'City', and 'School' can be null.
    /// - 'GuideUID' must correspond to a valid guide in the system.
    /// </summary>
    public class Visitor
    {
        public int ID { get; set; }
        public int type { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? City { get; set; }
        public string? School { get; set; }
        public int GuideUID { get; set; } 
    }
}
