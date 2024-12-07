using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class Seeder
    {
        private readonly UserDbSeeder _userDbSeeder;
        private readonly CredentialDbSeeder _credentialDbSeeder;

        public Seeder(UserDbSeeder userDbSeeder, CredentialDbSeeder credentialDbSeeder)
        {
            _userDbSeeder = userDbSeeder;
            _credentialDbSeeder = credentialDbSeeder;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            await _userDbSeeder.SeedAsync(serviceProvider);
            await _credentialDbSeeder.SeedAsync(serviceProvider);
        }
    }
    public class UserDbSeeder
    {
        readonly ILogger _logger;

        public UserDbSeeder(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger("UserDbSeederLogger");
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var userDb = serviceScope.ServiceProvider.GetService<UserDbContext>();
                if(userDb == null){
                    return;
                }
                if (await userDb.Database.EnsureCreatedAsync())
                {
                    if (!await userDb.Users.AnyAsync()) {
                      await InsertUsersSampleData(userDb);
                    }
                }
            }
        }

        public async Task InsertUsersSampleData(UserDbContext db)
        {
            var users = GetUsers();
            db.Users.AddRange(users);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {                
                _logger.LogError($"Error in {nameof(UserDbSeeder)}: " + exp.Message);
                throw; 
            }
        }

        private List<User> GetUsers() {
            var users = new List<User> 
            {
                new User(1, "Ege", UserType.Guide),
                new User(2, "Bora", UserType.Admin),
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
            using (var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var credentialDb = serviceScope.ServiceProvider.GetService<CredentialDbContext>();
                if(credentialDb == null){
                    return;
                }
                if (await credentialDb.Database.EnsureCreatedAsync())
                {
                    if (!await credentialDb.Credentials.AnyAsync()) {
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

        private List<Credential> GetCredentials() {
            var creds = new List<Credential> 
            {
                new Credential("canga", "can123"),
                new Credential("borabora", "bora123"),
            };

            return creds;
        }
    }
}