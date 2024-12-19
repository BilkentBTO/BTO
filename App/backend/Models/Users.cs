using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mail;

namespace backend.Models
{
    public enum UserType
    {
        Admin = 0,
        Coordinator = 1,
        Advisor = 2,
        Guide = 3,
        CandidateGuide = 4,
        Pending = 5,
        Invalid = 6,
    }

    public class Major
    {
        public string Name { get; }
        public int Id { get; }

        private Major(string name, int id)
        {
            Name = name;
            Id = id;
        }

        public static readonly List<Major> AllMajors = new List<Major>
        {
            new Major("Primary Education", 1),
            new Major("Educational Sciences", 2),
            new Major("Teacher Training", 3),
            new Major("Teaching English as a Foreign Language", 4),
            new Major("Physics", 5),
            new Major("Chemistry", 6),
            new Major("Mathematics", 7),
            new Major("Molecular Biology and Genetics", 8),
            new Major("Graphic Design", 9),
            new Major("Fine Arts", 10),
            new Major("Interior Architecture and Environmental Design", 11),
            new Major("Communication and Design", 12),
            new Major("Urban Design and Landscape Architecture", 13),
            new Major("Architecture", 14),
            new Major("Economics", 15),
            new Major("Psychology", 16),
            new Major("Political Science and Public Administration", 17),
            new Major("History", 18),
            new Major("International Relations", 19),
            new Major("American Culture and Literature", 20),
            new Major("Archaeology", 21),
            new Major("Philosophy", 22),
            new Major("English Language and Literature", 23),
            new Major("English and French Translation and Interpretation", 24),
            new Major("Turkish Literature", 25),
            new Major("Business Administration", 26),
            new Major("Law", 27),
            new Major("Computer Engineering", 28),
            new Major("Electrical and Electronics Engineering", 29),
            new Major("Industrial Engineering", 30),
            new Major("Mechanical Engineering", 31),
            new Major("Music", 32),
            new Major("Theatre", 33),
            new Major("Information Systems and Technologies", 34),
            new Major("Tourism and Hotel Management", 35),
        };

        public override string ToString()
        {
            return $"{Name} (ID: {Id})";
        }
    }

    public class User(string Name, string Surname, string Mail)
    {
        public int Id { get; set; }
        public string Name { get; set; } = Name;
        public string Surname { get; set; } = Surname;
        public string Mail { get; set; } = Mail;
        public int? BilkentID { get; set; }
        public int MajorCode { get; set; }

        [NotMapped]
        public Major? Major => Major.AllMajors.FirstOrDefault(m => m.Id == MajorCode);
        public int? CurrentYear { get; set; }
        public int WorkHours { get; set; } = 0;
        public UserType UserType { get; set; }
    }

    public class Guide : User
    {
        public bool IsCandidate { get; private set; }
        public Availability Schedule { get; private set; }

        public Guide(string Name, string Surname, string Mail, bool isCandidate = false)
            : base(Name, Surname, Mail)
        {
            IsCandidate = isCandidate;
            Schedule = new Availability();
        }
    }

    public class Advisor : User
    {
        public Advisor(string Name, string Surname, string Mail)
            : base(Name, Surname, Mail) { }
    }

    public class Coordinator : User
    {
        public Coordinator(string Name, string Surname, string Mail)
            : base(Name, Surname, Mail) { }
    }

    public class Admin : User
    {
        public Admin(string Name, string Surname, string Mail)
            : base(Name, Surname, Mail) { }
    }

    public class UserCreateRequest
    {
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public int? BilkentID { get; set; }
        public int MajorCode { get; set; }
        public int? CurrentYear { get; set; }
        public string? Mail { get; set; }
    }
}
