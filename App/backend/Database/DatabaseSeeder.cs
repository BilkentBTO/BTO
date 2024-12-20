using System.Net.Mail;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class Seeder
    {
        private readonly SystemDbSeeder _systemDbSeeder;
        private readonly CredentialDbSeeder _credentialDbSeeder;

        public Seeder(SystemDbSeeder userDbSeeder, CredentialDbSeeder credentialDbSeeder)
        {
            _systemDbSeeder = userDbSeeder;
            _credentialDbSeeder = credentialDbSeeder;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            await _systemDbSeeder.SeedAsync(serviceProvider);
            await _credentialDbSeeder.SeedAsync(serviceProvider);
        }
    }

    public class SystemDbSeeder
    {
        readonly ILogger _logger;

        public SystemDbSeeder(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger("SystemDbSeederLogger");
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using (
                var serviceScope = serviceProvider
                    .GetRequiredService<IServiceScopeFactory>()
                    .CreateScope()
            )
            {
                var SystemDbContext = serviceScope.ServiceProvider.GetService<SystemDbContext>();
                if (SystemDbContext == null)
                {
                    return;
                }
                if (await SystemDbContext.Database.EnsureCreatedAsync())
                {
                    if (!await SystemDbContext.Users.AnyAsync())
                    {
                        await InsertUsersSampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Tours.AnyAsync())
                    {
                        await InsertTourSampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Fairs.AnyAsync())
                    {
                        await InsertFairSampleData(SystemDbContext);
                    }
                }
            }
        }

        public async Task InsertUsersSampleData(SystemDbContext db)
        {
            var users = GetUsers();
            db.Users.AddRange(users);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbSeeder)}: " + exp.Message);
                throw;
            }
        }

        private List<User> GetUsers()
        {
            var users = new List<User>
            {
                new User("Ege", "Ertem", "ege@gmail.com"),
                new User("Bora", "Akoğuz", "bora@gmail.com"),
            };

            return users;
        }

        public async Task InsertFairSampleData(SystemDbContext db)
        {
            List<Fair> fairs = new List<Fair> { new Fair(), new Fair(), new Fair() };

            db.Fairs.AddRange(fairs);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbContext)}: " + exp.Message);
                throw;
            }
        }

        public async Task InsertTourSampleData(SystemDbContext db)
        {
            var sampleTourRegistration1 = new TourRegistration
            {
                Code = "T-Ankara4531",
                CityName = "Ankara",
                SchoolCode = 3438,
                DateOfVisit = DateTime.SpecifyKind(
                    DateTime.Parse("2024-12-20T16:34:45.327Z"),
                    DateTimeKind.Utc
                ),
                PreferredVisitTime = new TimeBlock(),
                NumberOfVisitors = 21,
                SuperVisorName = "Ahmet Yavuz",
                SuperVisorDuty = "Rehber",
                SuperVisorPhoneNumber = "05359594521",
                SuperVisorMailAddress = "mehmetyavuz@gmail.com",
                Notes = "İstek kabulunde telefonla arar mısınız?",
                State = RegistrationState.Accepted,
            };
            Tour sampleTour1 = new Tour
            {
                ID = 0,
                Time = sampleTourRegistration1.DateOfVisit,
                TourRegistrationCode = sampleTourRegistration1.Code,
                TourRegistirationInfo = sampleTourRegistration1,
            };
            List<Tour> tours = new List<Tour> { sampleTour1 };

            db.Tours.AddRange(tours);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbContext)}: " + exp.Message);
                throw;
            }
        }
    }

    public class CredentialDbSeeder
    {
        readonly ILogger _logger;

        public CredentialDbSeeder(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger("CredentialDbSeederLogger");
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using (
                var serviceScope = serviceProvider
                    .GetRequiredService<IServiceScopeFactory>()
                    .CreateScope()
            )
            {
                var credentialDb = serviceScope.ServiceProvider.GetService<CredentialDbContext>();
                if (credentialDb == null)
                {
                    return;
                }
                if (await credentialDb.Database.EnsureCreatedAsync())
                {
                    if (!await credentialDb.Credentials.AnyAsync())
                    {
                        await InsertCredentialsSampleData(credentialDb);
                    }
                }
            }
        }

        public async Task InsertCredentialsSampleData(CredentialDbContext db)
        {
            var creds = GetCredentials();
            db.Credentials.AddRange(creds);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(CredentialDbSeeder)}: " + exp.Message);
                throw;
            }
        }

        private List<Credential> GetCredentials()
        {
            var creds = new List<Credential>
            {
                new Credential("canga", "can123", UserType.Admin),
                new Credential("bora", "bora123", UserType.Guide),
                new Credential("advis", "123", UserType.Advisor),
                new Credential("guide", "123", UserType.Guide),
                new Credential("coord", "123", UserType.Coordinator),
                new Credential("admin", "123", UserType.Admin),
            };

            return creds;
        }
    }
}
