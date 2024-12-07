namespace backend.Models
{
    public enum UserType
    {
        Admin = 0,
        Coordinator = 1,
        Advisor = 2,
        Guide = 3,
        CandidateGuide = 4
    }
    public class User
    {
        public int id { get; set; }
        public required string Name { get; set; }
        public int WorkHours { get; set; }
        public UserType UserType{ get; set; }

    }

    public class Guide : User{
        
    }
}
