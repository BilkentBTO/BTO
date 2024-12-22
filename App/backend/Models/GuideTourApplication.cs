namespace backend.Models
{
    public class GuideTourApplication()
    {
        public string? TourCode { get; set; }
        public Tour? Tour { get; set; }
        public int GuideUID { get; set; }
        public User? Guide { get; set; }
    }

    public class GuideTourApplicationRequest()
    {
        public string? TourCode { get; set; }
        public int GuideUID { get; set; }
    }
}
