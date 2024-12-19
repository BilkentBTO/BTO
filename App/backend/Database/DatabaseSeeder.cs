using System.Net.Mail;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class Seeder
    {
        private readonly SystemDbSeeder _systemDbSeeder;
        private readonly CredentialDbSeeder _credentialDbSeeder;
        private readonly ScheduleDbSeeder _scheduleDbSeeder;

        public Seeder(SystemDbSeeder userDbSeeder, CredentialDbSeeder credentialDbSeeder, ScheduleDbSeeder scheduleDbSeeder)
        {
            _systemDbSeeder = userDbSeeder;
            _credentialDbSeeder = credentialDbSeeder;
            _scheduleDbSeeder = scheduleDbSeeder;
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
                var userDb = serviceScope.ServiceProvider.GetService<SystemDbContext>();
                if (userDb == null)
                {
                    return;
                }
                if (await userDb.Database.EnsureCreatedAsync())
                {
                    if (!await userDb.Users.AnyAsync())
                    {
                        await InsertUsersSampleData(userDb);
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

    public class ScheduleDbSeeder
    {
        readonly ILogger _logger;

        public ScheduleDbSeeder(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger("ScheduleDbSeederLogger");
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using (
                var serviceScope = serviceProvider
                    .GetRequiredService<IServiceScopeFactory>()
                    .CreateScope()
            )
            {
                var scheduleDb = serviceScope.ServiceProvider.GetService<ScheduleDbContext>();
                if (scheduleDb == null)
                {
                    return;
                }
                if (await scheduleDb.Database.EnsureCreatedAsync())
                {
                    if (!await scheduleDb.Tours.AnyAsync())
                    {
                        await InsertFairSampleData(scheduleDb);
                    }
                    if (!await scheduleDb.Fairs.AnyAsync())
                    {
                        await InsertTourSampleData(scheduleDb);
                    }
                }
            }
        }

        public async Task InsertFairSampleData(ScheduleDbContext db)
        {
            List<Fair> fairs = new List<Fair>
            {
                new Fair(new School(), "x fair", new DateTime(2025, 1, 22)),
                new Fair(new School(), "y fair", new DateTime(2025, 1, 13)),
                new Fair(new School(), "z fair", new DateTime(2025, 1, 18)),
            };

            db.Fairs.AddRange(fairs);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(ScheduleDbSeeder)}: " + exp.Message);
                throw;
            }
        }

        public async Task InsertTourSampleData(ScheduleDbContext db)
        {
            List<Tour> tours = new List<Tour>
            {
                new Tour(
                    new DateTime(2024, 12, 25),
                    new TourRegistirationInfo(new School(), "amogus@dijkstra.com", 32)
                ),
                new Tour(
                    new DateTime(2024, 11, 27),
                    new TourRegistirationInfo(new School(), "amogsus@dijkstra.com", 26)
                ),
            };
            Schedule weeklySchedule = new Schedule();
            weeklySchedule.AddTour(tours[0], 15);
            weeklySchedule.AddTour(tours[1], 17);

            db.Tours.AddRange(tours);
            db.Schedules.Add(weeklySchedule);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(ScheduleDbSeeder)}: " + exp.Message);
                throw;
            }
        }
    }
}
