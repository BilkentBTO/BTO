namespace backend.Models
{
    public class Survey
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<Question> Questions { get; set; } = new List<Question>();
    }

    public class Question
    {
        public int ID { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public List<Option> Options { get; set; } = new List<Option>();
        public List<string> CorrectAnswers { get; set; } = new List<string>();
        public int TimeLimitInSeconds { get; set; }
    }

    public class Option
    {
        public int ID { get; set; }
        public string OptionText { get; set; } = string.Empty;
        public string OptionLabel { get; set; } = string.Empty; // A, B, C, D
    }
}
