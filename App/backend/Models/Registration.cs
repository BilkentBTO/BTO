namespace backend.Models
{
    public class Registration()
    {
        public string? Code { get; set; }

        public string? CityName { get; set; }

        public string? SchoolName { get; set; }

        public School? School { get; set; }

        public DateTime DateOfVisit { get; set; }

        public TimeBlock? PrefferedVisitTime { get; set; }

        public int NumberOfVisitors { get; set; }

        public string? SuperVisorName { get; set; }

        public string? SuperVisorDuty { get; set; }

        public string? SuperVisorPhoneNumber { get; set; }

        public string? SuperVisorMailAddress { get; set; }

        public string? Notes { get; set; }

        public void GenerateCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            this.Code = $"{this.CityName}{randomSuffix}";
        }

        public void FillSchool(School school)
        {
            this.School = school;
        }
    }

    public class RegistrationRequest
    {
        public string? CityName { get; set; }
        public string? SchoolName { get; set; }
        public DateTime DateOfVisit { get; set; }
        public TimeBlock? PreferredVisitTime { get; set; }
        public int NumberOfVisitors { get; set; }
        public string? SuperVisorName { get; set; }
        public string? SuperVisorDuty { get; set; }
        public string? SuperVisorPhoneNumber { get; set; }
        public string? SuperVisorMailAddress { get; set; }
        public string? Notes { get; set; }
    }
}