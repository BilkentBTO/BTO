namespace backend.Models
{
    public enum VisitorType
    {
        School = 0,
        Individual = 1,
        Summer = 2,
    }
    public class Visitor
    {
        public int ID { get; set; }
        public int type { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? City { get; set; }
        public string? School { get; set; }
        public string? GuideName { get; set; }
        public int GuideRating { get; set; }
        public string? Comment { get; set; }
    }
}
