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

    public class Advisor : User
    {
        public Advisor(int id, string name, UserType userType)
            : base(id, name, userType) { }
    }

    public class Coordinator : User
    {
        public Coordinator(int id, string name, UserType userType)
            : base(id, name, userType) { }
    }

    public class Admin : User
    {
        public Admin(int id, string name, UserType userType)
            : base(id, name, userType) { }
    }
}
