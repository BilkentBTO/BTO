using System.Globalization;
using backend.Models;
using BTO.Setting;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using Npgsql;

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

        //Guide Applications
        public DbSet<GuideTourApplication> GuideTourApplication { get; set; }

        //Scheduling
        public DbSet<TimeBlock> TimeBlocks { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<Fair> Fairs { get; set; }

        public DbSet<Tour> PastTours { get; set; }
        public DbSet<Tour> PastFairs { get; set; }

        //Credentials
        public DbSet<Credential> Credentials { get; set; }

        //Settings
        public DbSet<Setting> Setting { get; set; }

        // Surveys and related entities
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<GuideData> GuideData { get; set; }

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

            modelBuilder.Entity<GuideTourApplication>().HasKey(r => r.GuideUID);

            modelBuilder.Entity<GuideTourApplication>().HasIndex(r => r.GuideUID).IsUnique();

            modelBuilder.Entity<TimeBlock>().HasKey(t => t.Time);

            modelBuilder.Entity<Tour>().HasKey(t => t.TourRegistrationCode);

            modelBuilder.Entity<Fair>().HasKey(f => f.FairRegistrationCode);

            modelBuilder.Entity<Credential>().HasKey(c => c.Username);

            modelBuilder.Entity<Survey>().HasKey(s => s.ID);

            modelBuilder.Entity<Quiz>().HasKey(s => s.Code);

            modelBuilder.Entity<GuideData>().HasKey(g => g.UID);

            modelBuilder
                .Entity<Quiz>()
                .HasMany(q => q.Surveys)
                .WithOne(s => s.Quiz)
                .HasForeignKey(s => s.QuizCode);

            var schools = ReadSchoolsFromCsv("./Database/TurkeySchoolData.csv");
            modelBuilder.Entity<School>().HasData(schools);
            modelBuilder
                .Entity<Setting>()
                .HasData(new Setting { Id = 1, AllowedConcurrentTourCount = 2 });

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
