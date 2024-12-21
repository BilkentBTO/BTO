using System.Globalization;
using backend.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class SystemDbContext : DbContext
    {
        //Users
        public DbSet<User> Users { get; set; }

        //Registration
        public DbSet<School> Schools { get; set; }
        public DbSet<TourRegistration> TourRegistrations { get; set; }
        public DbSet<FairRegistration> FairRegistrations { get; set; }
        public DbSet<IndividualRegistration> IndividualRegistrations { get; set; }
        public DbSet<TourRegistirationRequest> TourRegistirationRequests { get; set; }

        //Guide Applications
        public DbSet<GuideTourApplication> GuideTourApplication { get; set; }

        //Scheduling
        public DbSet<TimeBlock> Schedule { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<Fair> Fairs { get; set; }

        //Credentials
        public DbSet<Credential> Credentials { get; set; }

        public SystemDbContext(DbContextOptions<SystemDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.ID);
            modelBuilder.Entity<User>().Property(u => u.ID).ValueGeneratedOnAdd();

            modelBuilder.Entity<School>().HasKey(s => s.SchoolName);

            modelBuilder.Entity<TourRegistration>().HasKey(r => r.Code);

            modelBuilder.Entity<TourRegistration>().HasIndex(r => r.Code).IsUnique();

            modelBuilder.Entity<FairRegistration>().HasKey(r => r.Code);

            modelBuilder.Entity<FairRegistration>().HasIndex(r => r.Code).IsUnique();

            modelBuilder.Entity<IndividualRegistration>().HasKey(r => r.Code);

            modelBuilder.Entity<IndividualRegistration>().HasIndex(r => r.Code).IsUnique();

            modelBuilder.Entity<GuideTourApplication>().HasKey(r => r.TourCode);

            modelBuilder.Entity<GuideTourApplication>().HasIndex(r => r.TourCode).IsUnique();

            modelBuilder.Entity<TimeBlock>().HasKey(t => t.ID);

            modelBuilder.Entity<Tour>().HasKey(t => t.TourRegistrationCode);

            modelBuilder.Entity<Fair>().HasKey(f => f.FairRegistrationCode);

            modelBuilder.Entity<Credential>().HasKey(c => c.Username);

            var schools = ReadSchoolsFromCsv("./Database/TurkeySchoolData.csv");
            modelBuilder.Entity<School>().HasData(schools);

            base.OnModelCreating(modelBuilder);
        }

        private List<School> ReadSchoolsFromCsv(string filePath)
        {
            var schools = new List<School>();
            using (var reader = new StreamReader(filePath))
            using (
                var csv = new CsvReader(
                    reader,
                    new CsvConfiguration(CultureInfo.InvariantCulture)
                    {
                        Delimiter = ";",
                        HeaderValidated = null,
                        MissingFieldFound = null,
                    }
                )
            )
            {
                csv.Context.RegisterClassMap<SchoolCsvMap>();
                schools = csv.GetRecords<School>().ToList();
            }
            foreach (School school in schools)
            {
                school.CalculatePriority();
            }
            return schools;
        }
    }

    public class SchoolCsvMap : ClassMap<School>
    {
        public SchoolCsvMap()
        {
            Map(m => m.SchoolCode).Name("School Code");
            Map(m => m.SchoolName).Name("School Name");
            Map(m => m.CityName).Name("City Name");
            Map(m => m.CityCode).Name("City Code");
        }
    }
}
