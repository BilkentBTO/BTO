    namespace backend.Models
    {
        public class Survey
        {
            public int ID { get; set; }
            public string Title { get; set; } = string.Empty;
            public List<string> Questions { get; set; } = new List<string>();
        }
    }
