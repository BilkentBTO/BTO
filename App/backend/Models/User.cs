namespace backend.Models
{
    public enum UserType
    {
        Admin = 0,
        Coordinator = 1,
        Advisor = 2,
        Guide = 3,
        CandidateGuide = 4,
        Invalid = 5,
    }

    public class User(int id, string name, UserType userType)
    {
        public int id { get; set; } = id;
        public string Name { get; set; } = name;
        public int WorkHours { get; set; } = 0;
        public UserType UserType { get; set; } = userType;
    }

    public class Guide : User
    {
        public Guide(int id, string name, UserType userType)
            : base(id, name, userType) { }
    }
}
