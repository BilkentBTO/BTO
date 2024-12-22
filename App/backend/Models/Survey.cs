namespace backend.Models
{
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
