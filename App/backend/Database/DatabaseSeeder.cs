/// <summary>
/// This file contains the Seeder class, which is responsible for seeding the database with initial data.
/// It includes methods to populate the database with predefined data for various models, such as schools, guides, and other essential entities.
/// The seeder ensures that the application has the necessary data for initial operation and testing purposes.
/// </summary>
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

            Guide sampleUser4 = new Guide("Guide", "GuideSurname", "guide@gmail.com");
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
