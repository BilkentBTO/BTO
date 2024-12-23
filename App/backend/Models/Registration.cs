/// <summary>
/// This file defines various registration classes for different types of registrations including Tour, Fair, and Individual registrations.
/// It also includes request classes for these registrations, which help manage and generate codes, store details, and calculate priorities.
/// </summary>

using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    /// <summary>
    /// Enum for registration states.
    /// It represents the possible states of a registration: Pending, Accepted, and Rejected.
    /// </summary>
    public enum RegistrationState
    {
        Pending = 0,
        Accepted = 1,
        Rejected = 2,
    }

    /// <summary>
    /// Base class for all types of registrations. Contains the basic properties like Code, Type, and Time.
    /// </summary>
    public class Registration()
    {
        // Registration code
        public string? Code { get; set; }

        // Type of registration (e.g., Tour, Fair, Individual)
        public string? Type { get; set; }

        // The time of the registration
        public DateTime Time { get; set; }
    }

    /// <summary>
    /// Represents a tour registration. Inherits from the Registration class and includes additional properties related to the tour.
    /// </summary>
    public class TourRegistration : Registration
    {
        // Constructor sets the Type to "Tour"
        public TourRegistration() => this.Type = "Tour";

        // City where the tour is taking place
        public string? CityName { get; set; }

        // School code related to the tour
        public int? SchoolCode { get; set; }

        // The school associated with the tour
        public School? School { get; set; }

        // Time block for the tour
        public TimeBlock? TimeBlock { get; set; }

        // Number of visitors for the tour
        public int NumberOfVisitors { get; set; }

        // Supervisor's name
        public string? SuperVisorName { get; set; }

        // Supervisor's duty
        public string? SuperVisorDuty { get; set; }

        // Supervisor's phone number
        public string? SuperVisorPhoneNumber { get; set; }

        // Supervisor's email address
        public string? SuperVisorMailAddress { get; set; }

        // Additional notes for the tour
        public string? Notes { get; set; }

        // State of the registration (Pending, Accepted, Rejected)
        public RegistrationState State { get; set; }

        /// <summary>
        /// Generates a unique code for the tour registration using the city name and a random suffix.
        /// </summary>
        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"T-{this.CityName}{randomSuffix}";
        }

        /// <summary>
        /// Fills in the school details for the tour registration.
        /// </summary>
        public void FillSchool(School school)
        {
            this.School = school;
        }

        /// <summary>
        /// Fills in the time block details for the tour registration.
        /// </summary>
        public void FillTimeBlock(TimeBlock timeBlock)
        {
            this.TimeBlock = timeBlock;
        }

        /// <summary>
        /// Gets the priority of the tour registration based on the associated school.
        /// </summary>
        public int GetPriority()
        {
            if (this.School == null)
            {
                return 0;
            }
            return this.School.GetPriority();
        }
    }

    /// <summary>
    /// Represents a fair registration. Inherits from the Registration class and includes properties related to fairs.
    /// </summary>
    public class FairRegistration : Registration
    {
        // Constructor sets the Type to "Fair"
        public FairRegistration() => this.Type = "Fair";

        // City where the fair is taking place
        public string? CityName { get; set; }

        // School code related to the fair
        public int? SchoolCode { get; set; }

        // The school associated with the fair
        public School? School { get; set; }

        // Supervisor's name
        public string? SuperVisorName { get; set; }

        // Supervisor's duty
        public string? SuperVisorDuty { get; set; }

        // Supervisor's phone number
        public string? SuperVisorPhoneNumber { get; set; }

        // Supervisor's email address
        public string? SuperVisorMailAddress { get; set; }

        // Additional notes for the fair
        public string? Notes { get; set; }

        // State of the registration (Pending, Accepted, Rejected)
        public RegistrationState State { get; set; }

        /// <summary>
        /// Generates a unique code for the fair registration using the city name and a random suffix.
        /// </summary>
        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"F-{this.CityName}{randomSuffix}";
        }

        /// <summary>
        /// Fills in the school details for the fair registration.
        /// </summary>
        public void FillSchool(School school)
        {
            Console.WriteLine("Filled: ", school.Priority);
            this.School = school;
        }

        /// <summary>
        /// Gets the priority of the fair registration based on the associated school.
        /// </summary>
        public int GetPriority()
        {
            if (this.School == null)
            {
                return 0;
            }
            return this.School.GetPriority();
        }
    }

    /// <summary>
    /// Represents an individual registration. Inherits from the Registration class and includes properties for individual registrations.
    /// </summary>
    public class IndividualRegistration : Registration
    {
        // Constructor sets the Type to "Individual"
        public IndividualRegistration() => this.Type = "Individual";

        // Preferred visit time for the individual
        public TimeBlock? TimeBlock { get; set; }

        // Name of the individual
        public string? IndividualName { get; set; }

        // Surname of the individual
        public string? IndividualSurname { get; set; }

        // Major code of the individual
        public int? IndividualMajorCode { get; set; }

        // Fetch the major based on the major code
        [NotMapped]
        public Major? IndividualMajor =>
            Major.AllMajors.FirstOrDefault(m => m.Id == IndividualMajorCode);

        // Phone number of the individual
        public string? IndividualPhoneNumber { get; set; }

        // Email address of the individual
        public string? IndividualMailAddress { get; set; }

        // Additional notes for the individual
        public string? Notes { get; set; }

        // State of the registration (Pending, Accepted, Rejected)
        public RegistrationState State { get; set; }

        /// <summary>
        /// Generates a unique code for the individual registration using the individual's surname and a random suffix.
        /// </summary>
        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"I-{this.IndividualSurname}{randomSuffix}";
        }
    }

    /// <summary>
    /// Represents a request for a tour registration. Contains the necessary details to request a tour registration.
    /// </summary>
    public class TourRegistrationRequest
    {
        // City for the tour registration request
        public string? CityName { get; set; }

        // School code for the tour request
        public int? SchoolCode { get; set; }

        // Date of the visit for the tour
        public DateTime DateOfVisit { get; set; }

        // Number of visitors for the tour
        public int NumberOfVisitors { get; set; }

        // Supervisor's name for the tour
        public string? SuperVisorName { get; set; }

        // Supervisor's duty for the tour
        public string? SuperVisorDuty { get; set; }

        // Supervisor's phone number for the tour
        public string? SuperVisorPhoneNumber { get; set; }

        // Supervisor's email address for the tour
        public string? SuperVisorMailAddress { get; set; }

        // Additional notes for the tour registration request
        public string? Notes { get; set; }
    }

    /// <summary>
    /// Represents a request for a fair registration. Contains the necessary details to request a fair registration.
    /// </summary>
    public class FairRegistrationRequest
    {
        // City for the fair registration request
        public string? CityName { get; set; }

        // School code for the fair request
        public int? SchoolCode { get; set; }

        // Date of the visit for the fair
        public DateTime DateOfVisit { get; set; }

        // Supervisor's name for the fair
        public string? SuperVisorName { get; set; }

        // Supervisor's duty for the fair
        public string? SuperVisorDuty { get; set; }

        // Supervisor's phone number for the fair
        public string? SuperVisorPhoneNumber { get; set; }

        // Supervisor's email address for the fair
        public string? SuperVisorMailAddress { get; set; }

        // Additional notes for the fair registration request
        public string? Notes { get; set; }
    }

    /// <summary>
    /// Represents a request for an individual registration. Contains the necessary details to request an individual registration.
    /// </summary>
    public class IndividualRegistrationRequest
    {
        // Date of the visit for the registration request
        public DateTime DateOfVisit { get; set; }

        // Preferred visit time for the registration request
        public TimeBlock? PreferredVisitTime { get; set; }

        // Name of the individual for the registration request
        public string? IndividualName { get; set; }

        // Surname of the individual for the registration request
        public string? IndividualSurname { get; set; }

        // Major code of the individual for the registration request
        public int? IndividualPreferredMajorCode { get; set; }

        // Phone number of the individual
        public string? IndividualPhoneNumber { get; set; }

        // Email address of the individual
        public string? IndividualMailAddress { get; set; }

        // Additional notes for the individual registration request
        public string? Notes { get; set; }
    }
}
