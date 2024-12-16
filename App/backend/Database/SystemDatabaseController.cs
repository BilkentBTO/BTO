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

        public async Task<bool> AddRegistration(RegistrationRequest request)
        {
            try
            {
                var school = await _context.Schools.FirstOrDefaultAsync(s =>
                    s.SchoolName == request.SchoolName
                );

                if (school == null)
                {
                    Console.WriteLine("Error: School not found.");
                    return false;
                }

                var registration = new Registration
                {
                    CityName = request.CityName,
                    SchoolName = request.SchoolName,
                    DateOfVisit = request.DateOfVisit,
                    PrefferedVisitTime = request.PrefferedVisitTime,
                    NumberOfVisitors = request.NumberOfVisitors,
                    SuperVisorName = request.SuperVisorName,
                    SuperVisorDuty = request.SuperVisorDuty,
                    SuperVisorPhoneNumber = request.SuperVisorPhoneNumber,
                    SuperVisorMailAddress = request.SuperVisorMailAddress,
                    Notes = request.Notes,
                };

                registration.GenerateCode();
                registration.FillSchool(school);

                _context.Registrations.Add(registration);

                var result = await _context.SaveChangesAsync();

                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding registration: {ex.Message}");
                return false;
            }
        }

        public async Task<Registration?> GetRegistration(string Code)
        {
            return await _context.Registrations.SingleOrDefaultAsync(r => r.Code == Code);
        }

        public List<string> GetAllCityNames()
        {
            List<string> cityNames = new List<string>();
            foreach (var city in CityData.Cities)
            {
                cityNames.Add(city.name);
            }
            return cityNames;
        }

        public async Task<List<string?>> GetSchoolSuggestionsWithFilterAsync(
            string query,
            string cityName
        )
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<string?>();
            }

            var cityCode = CityData.Cities.FirstOrDefault(c =>
                c.name.Equals(cityName, StringComparison.OrdinalIgnoreCase)
            );

            return await _context
                .Schools.Where(s =>
                    s.CityCode == cityCode.cityCode
                    && s.SchoolName.ToLower().Contains(query.ToLower())
                )
                .Select(s => s.SchoolName)
                .Distinct()
                .Take(10)
                .ToListAsync();
        }

        public async Task<List<string?>> GetSchoolSuggestionsAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<string?>();
            }

            return await _context
                .Schools.Where(s =>
                    EF.Functions.Like(s.SchoolName.ToLower(), $"{query.ToLower()}%")
                )
                .Select(s => s.SchoolName)
                .Distinct()
                .Take(10)
                .ToListAsync();
        }

        public async Task<School> GetSchoolByName(string name)
        {
            return await _context.Schools.SingleOrDefaultAsync(s => s.SchoolName == name);
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
