using System.Globalization;
using backend.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class SystemDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<School> Schools { get; set; }

        public SystemDbContext(DbContextOptions<SystemDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.id);

            modelBuilder.Entity<School>().HasKey(c => c.SchoolName);

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
            return schools;
        }
    }

    public class CredentialDbContext : DbContext
    {
        public DbSet<Credential> Credentials { get; set; }

        public CredentialDbContext(DbContextOptions<CredentialDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Credential>().HasKey(c => c.Username);
        }
    }

    public class SchoolCsvMap : ClassMap<School>
    {
        public SchoolCsvMap()
        {
            Map(m => m.SchoolCode).Name("School code");
            Map(m => m.SchoolName).Name("School Name");
            Map(m => m.CityName).Name("City Name");
            Map(m => m.CityCode).Name("City Code");
        }
    }
}
