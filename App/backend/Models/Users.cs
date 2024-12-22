/// <summary>
/// This file defines various user-related models, including different user roles (Admin, Coordinator, Advisor, Guide) and their properties.
/// The `Major` class is also included to manage and display the available majors in the system.
/// Constraints:
/// - The `User` class and its derived classes (Guide, Advisor, Coordinator, Admin) share common properties like Name, Surname, Mail, and Major.
/// - The `UserCreateRequest`, `UserCreate`, and `UserEdit` classes are used for creating and editing users.
/// </summary>
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mail;

namespace backend.Models
{
    /// <summary>
    /// Enum representing different types of users in the system.
    /// </summary>
    public enum UserType
    {
        Invalid = 0,
        Admin = 1,
        Coordinator = 2,
        Advisor = 3,
        Guide = 4,
        CandidateGuide = 5,
        Pending = 6,
    }

    /// <summary>
    /// Represents a major with a name and unique ID.
    /// Provides a static list of all available majors.
    /// Constraints:
    /// - Major names are predefined and immutable.
    /// </summary>
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

    /// <summary>
    /// Base class representing a user in the system with common properties like Name, Surname, Mail, and Major.
    /// Constraints:
    /// - All users must have a unique ID, Name, and Mail.
    /// - The MajorCode must correspond to a valid major in the system.
    /// </summary>
    public class User(string Name, string Surname, string Mail)
    {
        public int ID { get; set; }
        public string Name { get; set; } = Name;
        public string Surname { get; set; } = Surname;
        public string Mail { get; set; } = Mail;
        public int? BilkentID { get; set; }
        public int MajorCode { get; set; }
        public string? AssignedTourCode { get; set; }
        public string? AssignedFairCode { get; set; }
        public List<DateTime> AvailableHours { get; set; } = new List<DateTime>();

        [NotMapped]
        public Major? Major => Major.AllMajors.FirstOrDefault(m => m.Id == MajorCode);
        public int? CurrentYear { get; set; }
        public int WorkHours { get; set; } = 0;
        public UserType UserType { get; set; }
    }

    /// <summary>
    /// Represents a Guide user, which is a specific type of User with an additional property indicating if they are a candidate.
    /// Constraints:
    /// - Guide can either be a regular Guide or a Candidate Guide.
    /// </summary>
    public class Guide : User
    {
        public bool IsCandidate { get; private set; }

        public Guide(string Name, string Surname, string Mail, bool isCandidate = false)
            : base(Name, Surname, Mail)
        {
            IsCandidate = isCandidate;
        }
    }

    /// <summary>
    /// Represents an Advisor user, a type of User without additional properties.
    /// </summary>
    public class Advisor : User
    {
        public Advisor(string Name, string Surname, string Mail)
            : base(Name, Surname, Mail) { }
    }

    /// <summary>
    /// Represents a Coordinator user, a type of User without additional properties.
    /// </summary>
    public class Coordinator : User
    {
        public Coordinator(string Name, string Surname, string Mail)
            : base(Name, Surname, Mail) { }
    }

    /// <summary>
    /// Represents an Admin user, a type of User without additional properties.
    /// </summary>
    public class Admin : User
    {
        public Admin(string Name, string Surname, string Mail)
            : base(Name, Surname, Mail) { }
    }

    /// <summary>
    /// Class used for creating a user with required properties such as Name, Surname, MajorCode, and Mail.
    /// </summary>
    public class UserCreateRequest
    {
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public int? BilkentID { get; set; }
        public int MajorCode { get; set; }
        public int? CurrentYear { get; set; }
        public string? Mail { get; set; }
    }

    /// <summary>
    /// Class used for creating a user with a UserType and additional properties.
    /// </summary>
    public class UserCreate
    {
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public int? BilkentID { get; set; }
        public int MajorCode { get; set; }
        public int? CurrentYear { get; set; }
        public string? Mail { get; set; }
        public UserType UserType { get; set; }
    }

    /// <summary>
    /// Class used for editing an existing user's information.
    /// </summary>
    public class UserEdit
    {
        public int? ID { get; set; }
        public int? CurrentYear { get; set; }
        public int MajorCode { get; set; }
        public UserType UserType { get; set; }
    }

    /// <summary>
    /// Class representing the available hours of a user.
    /// </summary>
    public class UserAvailableHours
    {
        public List<DateTime> AvailableHours { get; set; } = new List<DateTime>();
    }
}
