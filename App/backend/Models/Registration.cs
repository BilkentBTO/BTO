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

        public string? CityName { get; set; }

        public int? SchoolCode { get; set; }

        public School? School { get; set; }

        public DateTime DateOfVisit { get; set; }

        public TimeBlock? PrefferedVisitTime { get; set; }

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
            this.Code = $"{this.CityName}{randomSuffix}";
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

    public class RegistrationRequest
    {
        public string? CityName { get; set; }
        public int? SchoolCode { get; set; }
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
