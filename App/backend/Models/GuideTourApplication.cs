/// <summary>
/// This file contains models for guide tour applications, including the application data and request structure.
/// </summary>
namespace backend.Models
{
    /// <summary>
    /// Represents a guide tour application with associated details.
    /// Constraints: The GuideUID must be a valid identifier. TourCode and related objects may be null.
    /// </summary>
    public class GuideTourApplication()
    {
        public string? TourCode { get; set; }
        public Tour? Tour { get; set; }
        public int GuideUID { get; set; }
        public User? Guide { get; set; }
    }

    /// <summary>
    /// Represents a request to submit a guide tour application.
    /// Constraints: The GuideUID must be a valid identifier. TourCode may be null.
    /// </summary>
    public class GuideTourApplicationRequest()
    {
        public string? TourCode { get; set; }
        public int GuideUID { get; set; }
    }

    public class GuideIndividualTourApplication()
    {
        public string? IndividualTourCode { get; set; }
        public IndividualTour? IndividualTour { get; set; }
        public int GuideUID { get; set; }
        public User? Guide { get; set; }
    }

    public class GuideIndividualTourApplicationRequest()
    {
        public string? IndividualTourCode { get; set; }
        public int GuideUID { get; set; }
    }
}
