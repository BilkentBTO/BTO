using System.Net.Mail;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class Seeder
    {
        private readonly SystemDbSeeder _systemDbSeeder;

        public Seeder(SystemDbSeeder SystemDbSeeder)
        {
            _systemDbSeeder = SystemDbSeeder;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            await _systemDbSeeder.SeedAsync(serviceProvider);
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
                    if (!await SystemDbContext.Credentials.AnyAsync())
                    {
                        await InsertCredentialsSampleData(SystemDbContext);
                    }
                    /*
                    if (!await SystemDbContext.Tours.AnyAsync())
                    {
                        await InsertTourSampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Fairs.AnyAsync())
                    {
                        await InsertFairSampleData(SystemDbContext);
                    }
                    */
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
            User sampleUser1 = new User("Admin", "AdminSurname", "admin@gmail.com");
            sampleUser1.UserType = UserType.Admin;

            User sampleUser2 = new User("Coordinator", "CoordinatorSurname", "coord@gmail.com");
            sampleUser2.UserType = UserType.Coordinator;

            User sampleUser3 = new User("Advisor", "AdvisorrSurname", "advisor@gmail.com");
            sampleUser3.UserType = UserType.Advisor;

            User sampleUser4 = new User("Guide", "GuideSurname", "guide@gmail.com");
            sampleUser4.UserType = UserType.Guide;

            User sampleUser5 = new User("Candidate", "CandidateSurname", "candidate@gmail.com");
            sampleUser5.UserType = UserType.CandidateGuide;

            var users = new List<User>
            {
                sampleUser1,
                sampleUser2,
                sampleUser3,
                sampleUser4,
                sampleUser5,
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

        public async Task InsertCredentialsSampleData(SystemDbContext db)
        {
            var users = await db.Users.ToListAsync();
            var creds = users
                .Select(user => new Credential(user.Mail, "123", user.ID, user.UserType))
                .ToList();

            db.Credentials.AddRange(creds);
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
    }
}
