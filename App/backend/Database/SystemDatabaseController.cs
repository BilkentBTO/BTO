using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class SystemDatabaseController
    {
        private readonly SystemDbContext _context;
        private readonly ILogger _logger;

        public SystemDatabaseController(SystemDbContext context, ILoggerFactory loggerFactory)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("SystemDatabaseController");
        }

        public List<string?> GetAllCityNames()
        {
            var cityNames = _context
                .Schools.Select(s => s.CityName)
                .Distinct()
                .OrderBy(name => name)
                .ToList();

            return cityNames;
        }

        public List<string> GetSchoolSuggestionsWithFilter(string query, string cityName)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<string>();
            }

            var suggestions = _context
                .Schools.Where(s =>
                    s.CityName.ToLower() == cityName.ToLower()
                    && EF.Functions.Like(s.SchoolName.ToLower(), $"{query.ToLower()}%")
                )
                .Select(s => s.SchoolName)
                .Distinct()
                .Take(10)
                .ToList();

            return suggestions;
        }

        public List<string?> GetSchoolSuggestions(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<string?>();
            }

            var suggestions = _context
                .Schools.Where(s =>
                    EF.Functions.Like(s.SchoolName.ToLower(), $"{query.ToLower()}%")
                )
                .Select(s => s.SchoolName)
                .Distinct()
                .Take(10)
                .ToList();

            return suggestions;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<User> GetUserAsync(int id)
        {
            return await _context.Users.SingleOrDefaultAsync(c => c.id == id);
        }

        public async Task<User?> InsertUserAsync(User user)
        {
            bool userExists = await _context.Users.AnyAsync(u => u.id == user.id);
            if (userExists)
            {
                return null;
            }

            _context.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (System.Exception exp)
            {
                _logger.LogError($"Error in {nameof(InsertUserAsync)}: " + exp.Message);
            }

            return user;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            bool userExists = await _context.Users.AnyAsync(u => u.id == user.id);
            if (!userExists)
            {
                return false;
            }

            _context.Users.Attach(user);
            _context.Entry(user).State = EntityState.Modified;
            try
            {
                return (await _context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(UpdateUserAsync)}: " + exp.Message);
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            bool userExists = await _context.Users.AnyAsync(u => u.id == id);
            if (!userExists)
            {
                return false;
            }

            var user = await _context.Users.SingleOrDefaultAsync(c => c.id == id);

            _ = _context.Remove(user);

            try
            {
                return (await _context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (System.Exception exp)
            {
                _logger.LogError($"Error in {nameof(DeleteUserAsync)}: " + exp.Message);
            }
            return false;
        }
    }
}
