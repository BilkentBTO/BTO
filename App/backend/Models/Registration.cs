using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum RegistrationState
    {
        Pending = 0,
        Accepted = 1,
        Rejected = 2,
    }

    public class Registration()
    {
        public string? Code { get; set; }
        public string? Type { get; set; }
    }

    public class TourRegistration : Registration
    {
        public TourRegistration() => this.Type = "Tour";

        public string? CityName { get; set; }

        public int? SchoolCode { get; set; }

        public School? School { get; set; }

        public DateTime Time { get; set; }

        public TimeBlock? TimeBlock { get; set; }

        public int NumberOfVisitors { get; set; }

        public string? SuperVisorName { get; set; }

        public string? SuperVisorDuty { get; set; }

        public string? SuperVisorPhoneNumber { get; set; }

        public string? SuperVisorMailAddress { get; set; }

        public string? Notes { get; set; }

        public RegistrationState State { get; set; }

        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"T-{this.CityName}{randomSuffix}";
        }

        public void FillSchool(School school)
        {
            this.School = school;
        }

        public void FillTimeBlock(TimeBlock timeBlock)
        {
            this.TimeBlock = timeBlock;
        }

        public int GetPriority()
        {
            if (this.School == null)
            {
                return 0;
            }
            return this.School.GetPriority();
        }
    }

    public class FairRegistration : Registration
    {
        public FairRegistration() => this.Type = "Fair";

        public string? CityName { get; set; }

        public int? SchoolCode { get; set; }

        public School? School { get; set; }

        public DateTime Time { get; set; }

        public string? SuperVisorName { get; set; }

        public string? SuperVisorDuty { get; set; }

        public string? SuperVisorPhoneNumber { get; set; }

        public string? SuperVisorMailAddress { get; set; }

        public string? Notes { get; set; }

        public RegistrationState State { get; set; }

        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"F-{this.CityName}{randomSuffix}";
        }

        public void FillSchool(School school)
        {
            Console.WriteLine("Filled: ", school.Priority);
            this.School = school;
        }

        public int GetPriority()
        {
            if (this.School == null)
            {
                return 0;
            }
            return this.School.GetPriority();
        }
    }

    public class IndividualRegistration : Registration
    {
        public IndividualRegistration() => this.Type = "Individual";

        public DateTime DateOfVisit { get; set; }

        public TimeBlock? PreferredVisitTime { get; set; }

        public string? IndividualName { get; set; }

        public string? IndividualSurname { get; set; }

        public int? IndividualMajorCode { get; set; }

        [NotMapped]
        public Major? IndividualMajor =>
            Major.AllMajors.FirstOrDefault(m => m.Id == IndividualMajorCode);

        public string? IndividualPhoneNumber { get; set; }

        public string? IndividualMailAddress { get; set; }

        public string? Notes { get; set; }

        public RegistrationState State { get; set; }

        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"I-{this.IndividualSurname}{randomSuffix}";
        }
    }

    public class TourRegistrationRequest
    {
        public string? CityName { get; set; }
        public int? SchoolCode { get; set; }
        public DateTime DateOfVisit { get; set; }
        public int NumberOfVisitors { get; set; }
        public string? SuperVisorName { get; set; }
        public string? SuperVisorDuty { get; set; }
        public string? SuperVisorPhoneNumber { get; set; }
        public string? SuperVisorMailAddress { get; set; }
        public string? Notes { get; set; }
    }

    public class FairRegistrationRequest
    {
        public string? CityName { get; set; }
        public int? SchoolCode { get; set; }
        public DateTime DateOfVisit { get; set; }
        public string? SuperVisorName { get; set; }
        public string? SuperVisorDuty { get; set; }
        public string? SuperVisorPhoneNumber { get; set; }
        public string? SuperVisorMailAddress { get; set; }
        public string? Notes { get; set; }
    }

    public class IndividualRegistrationRequest
    {
        public DateTime DateOfVisit { get; set; }
        public TimeBlock? PreferredVisitTime { get; set; }
        public string? IndividualName { get; set; }
        public string? IndividualSurname { get; set; }
        public int? IndividualPreferredMajorCode { get; set; }
        public string? IndividualPhoneNumber { get; set; }
        public string? IndividualMailAddress { get; set; }
        public string? Notes { get; set; }
    }
}
