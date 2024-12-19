namespace backend.Models
{
    public class GuideTourApplication()
    {
        public string? Code { get; set; }
        public int TourID { get; set; }
        public Tour? Tour { get; set; }
        public int GuideUID { get; set; }
        public Guide? Guide { get; set; }
    }

    public class GuideTourApplicationRequest()
    {
        public int? TourID { get; set; }
        public int GuideUID { get; set; }
    }
}
