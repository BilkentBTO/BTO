using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Quiz
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public int SurveyID { get; set; }

        public bool IsStarted { get; set; }
        public bool IsFinished { get; set; }
        public List<VisitorAnswer> VisitorAnswer { get; set; } = new List<VisitorAnswer>();

    }


    public class VisitorAnswer
    {
        public int ID { get; set; }
        public int VisitorId { get; set; }
        public List<int> answers { get; set; } = new List<int>();
        public string comment { get; set; } = string.Empty;
    }


}
