/// <summary>
/// Represents the database context for the application, inheriting from <see cref="DbContext"/>. It defines DbSet properties
/// for each entity, such as users, registrations, guides, scheduling, and survey data. The context is responsible for managing
/// the connection to the PostgreSQL database and provides methods for CRUD operations on these entities.
/// </summary>
using System.Globalization;
using backend.Models;
using BTO.Setting;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Database
{
    /// Constraints:
    /// - The <see cref="User"/> entity uses a primary key on the "ID" property, which is automatically generated when a new user is created.
    /// - The <see cref="School"/> entity uses a primary key on the "SchoolName" property.
    /// - The <see cref="TourRegistration"/>, <see cref="FairRegistration"/>, and <see cref="IndividualRegistration"/> entities
    ///   use a primary key on the "Code" property, which is also indexed to ensure uniqueness.
    /// - The <see cref="GuideTourApplication"/> entity uses a primary key on the "GuideUID" property, and this is indexed to ensure uniqueness.
    /// - The <see cref="TimeBlock"/> entity uses a primary key on the "Time" property.
    /// - The <see cref="Tour"/> entity uses a primary key on the "TourRegistrationCode" property.
    /// - The <see cref="Fair"/> entity uses a primary key on the "FairRegistrationCode" property.
    /// - The <see cref="Credential"/> entity uses a primary key on the "Username" property.
    /// - The <see cref="Survey"/> entity uses a primary key on the "ID" property.
    /// - The <see cref="Quiz"/> entity uses a primary key on the "Code" property.
    /// - The <see cref="GuideData"/> entity uses a primary key on the "UID" property.
    /// - The <see cref="SchoolData"/> entity uses a primary key on the "SchoolCode" property.
    /// - The "Code" properties in <see cref="TourRegistration"/>, <see cref="FairRegistration"/>, and <see cref="IndividualRegistration"/>
    ///   are indexed to ensure uniqueness for these records.
    /// - The relationship between <see cref="Quiz"/> and <see cref="Survey"/> is one-to-many, where each quiz can be associated with multiple surveys.
    /// - The schools' data is loaded into the database from a CSV file, ensuring that school records are correctly populated upon application startup.
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

        // Surveys
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<GuideData> GuideData { get; set; }
        public DbSet<SchoolData> SchoolData { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SystemDbContext"/> class, passing the options to the base <see cref="DbContext"/> constructor.
        /// This constructor is used to configure the database context options, such as connection strings or other settings for the Entity Framework.
        /// </summary>
        /// <param name="options">Options to configure the <see cref="SystemDbContext"/> class, including the database provider and connection information.</param>
        public SystemDbContext(DbContextOptions<SystemDbContext> options)
            : base(options) { }

        /// <summary>
        /// Configures the model for the database using the specified <see cref="ModelBuilder"/>. This method is used to define how entities are mapped to database tables,
        /// including relationships between entities, primary keys, indexes, and seeding data.
        /// </summary>
        /// <param name="modelBuilder">The <see cref="ModelBuilder"/> used to configure the entity model for the database.</param>
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

            modelBuilder.Entity<SchoolData>().HasKey(s => s.SchoolCode);

            // Defining relationships between entities
            modelBuilder
                .Entity<Quiz>()
                .HasMany(q => q.Surveys)
                .WithOne(s => s.Quiz)
                .HasForeignKey(s => s.QuizCode);

            // Seeding data for schools and settings
            var schools = ReadSchoolsFromCsv("./Database/TurkeySchoolData.csv");
            modelBuilder.Entity<School>().HasData(schools);
            modelBuilder
                .Entity<Setting>()
                .HasData(new Setting { Id = 1, AllowedConcurrentTourCount = 2 });

            // Calling the base method to ensure proper model building
            base.OnModelCreating(modelBuilder);
        }

        /// <summary>
        /// Reads school data from a CSV file and maps it to a list of <see cref="School"/> objects. Each record is processed and priority is calculated for each school.
        /// </summary>
        /// <param name="filePath">The path to the CSV file containing school data.</param>
        /// <returns>A list of <see cref="School"/> objects representing the data read from the CSV file.</returns>
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

            // Calculate priority for each school after reading the data
            foreach (School school in schools)
            {
                school.CalculatePriority();
            }
            return schools;
        }
    }

    /// <summary>
    /// A class map that defines the mapping between CSV file columns and the <see cref="School"/> entity properties.
    /// </summary>
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
