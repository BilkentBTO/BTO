using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
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
                new User { Name = "Ege", id = 1},
                new User { Name = "Bora", id = 2 },
                new User { Name = "Can", id = 3 },
            };

            return users;
        }
    }
}