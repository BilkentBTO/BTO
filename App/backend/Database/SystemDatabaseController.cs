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

        public async Task<string> AddTourRegistration(TourRegistrationRequest request)
        {
            try
            {
                var school = await _context.Schools.FirstOrDefaultAsync(s =>
                    s.SchoolCode == request.SchoolCode
                );

                if (school == null)
                {
                    Console.WriteLine($"Error: School not found: '{request.SchoolCode}'");
                    return "";
                }

                var registration = new TourRegistration
                {
                    CityName = request.CityName,
                    SchoolCode = request.SchoolCode,
                    DateOfVisit = request.DateOfVisit,
                    PreferredVisitTime = request.PreferredVisitTime,
                    NumberOfVisitors = request.NumberOfVisitors,
                    SuperVisorName = request.SuperVisorName,
                    SuperVisorDuty = request.SuperVisorDuty,
                    SuperVisorPhoneNumber = request.SuperVisorPhoneNumber,
                    SuperVisorMailAddress = request.SuperVisorMailAddress,
                    Notes = request.Notes,
                    State = RegistrationState.Pending,
                };

                registration.GenerateCode();
                registration.FillSchool(school);

                _context.Registrations.Add(registration);

                var result = await _context.SaveChangesAsync();

                if (registration.Code == null)
                {
                    return "";
                }

                return registration.Code;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding registration: {ex.Message}");
                return "";
            }
        }

        public async Task<TourRegistration?> GetTourRegistration(string Code)
        {
            return await _context
                .Registrations.Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        public async Task<List<TourRegistration>> GetAllTourRegistrations()
        {
            return await _context
                .Registrations.Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .ToListAsync();
        }

        public async Task<List<TourRegistration>> GetAllTourRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _context
                .Registrations.Where(r => r.State == state)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .ToListAsync();
        }

        public async Task<bool> AcceptTourRegistration(string Code)
        {
            var registration = await _context.Registrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Accepted;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectTourRegistration(string Code)
        {
            var registration = await _context.Registrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Rejected;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> AddFairRegistration(FairRegistrationRequest request)
        {
            try
            {
                var school = await _context.Schools.FirstOrDefaultAsync(s =>
                    s.SchoolCode == request.SchoolCode
                );

                if (school == null)
                {
                    Console.WriteLine($"Error: School not found: '{request.SchoolCode}'");
                    return "";
                }

                var registration = new FairRegistration
                {
                    CityName = request.CityName,
                    SchoolCode = request.SchoolCode,
                    DateOfVisit = request.DateOfVisit,
                    SuperVisorName = request.SuperVisorName,
                    SuperVisorDuty = request.SuperVisorDuty,
                    SuperVisorPhoneNumber = request.SuperVisorPhoneNumber,
                    SuperVisorMailAddress = request.SuperVisorMailAddress,
                    Notes = request.Notes,
                    State = RegistrationState.Pending,
                };

                registration.GenerateCode();
                registration.FillSchool(school);

                _context.FairRegistrations.Add(registration);

                var result = await _context.SaveChangesAsync();

                if (registration.Code == null)
                {
                    return "";
                }
                return registration.Code;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding registration: {ex.Message}");
                return "";
            }
        }

        public async Task<List<FairRegistration>> GetAllFairRegistrations()
        {
            return await _context
                .FairRegistrations.OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .ToListAsync();
        }

        public async Task<List<FairRegistration>> GetAllFairRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _context
                .FairRegistrations.Where(r => r.State == state)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .ToListAsync();
        }

        public async Task<FairRegistration?> GetFairRegistration(string Code)
        {
            return await _context
                .FairRegistrations.Include(r => r.School)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        public async Task<bool> AcceptFairRegistration(string Code)
        {
            var registration = await _context.FairRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Accepted;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectFairRegistration(string Code)
        {
            var registration = await _context.FairRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Rejected;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> AddIndividualRegistration(IndividualRegistrationRequest request)
        {
            try
            {
                var registration = new IndividualRegistration
                {
                    DateOfVisit = request.DateOfVisit,
                    IndividualName = request.IndividualName,
                    IndividualMajorCode = request.IndividualPreferredMajorCode,
                    IndividualPhoneNumber = request.IndividualPhoneNumber,
                    IndividualMailAddress = request.IndividualMailAddress,
                    Notes = request.Notes,
                    State = RegistrationState.Pending,
                };

                registration.GenerateCode();

                _context.IndividualRegistrations.Add(registration);

                var result = await _context.SaveChangesAsync();
                if (registration.Code == null)
                {
                    return "";
                }
                return registration.Code;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding registration: {ex.Message}");
                return "";
            }
        }

        public async Task<List<IndividualRegistration>> GetAllIndividualRegistrations()
        {
            return await _context
                .IndividualRegistrations.OrderBy(static r => r.IndividualName)
                .ToListAsync();
        }

        public async Task<List<IndividualRegistration>> GetAllIndividualRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _context
                .IndividualRegistrations.Where(r => r.State == state)
                .OrderBy(r => r.IndividualName)
                .ToListAsync();
        }

        public async Task<IndividualRegistration?> GetIndividualRegistration(string Code)
        {
            return await _context.IndividualRegistrations.SingleOrDefaultAsync(r => r.Code == Code);
        }

        public async Task<bool> AcceptIndividualRegistration(string Code)
        {
            var registration = await _context.IndividualRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Accepted;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectIndividualRegistration(string Code)
        {
            var registration = await _context.IndividualRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Rejected;
            await _context.SaveChangesAsync();
            return true;
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

        public async Task<List<SchoolSuggestion>> GetSchoolSuggestionsWithFilterAsync(
            string query,
            string cityName
        )
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<SchoolSuggestion>();
            }

            var cityCode = CityData.Cities.FirstOrDefault(c =>
                c.name.Equals(cityName, StringComparison.OrdinalIgnoreCase)
            );

            if (cityCode.Equals(default))
            {
                return new List<SchoolSuggestion>();
            }

            var result = await _context
                .Schools.Where(s =>
                    s.CityCode == cityCode.cityCode
                    && s.SchoolName != null
                    && s.SchoolName.ToLower().Contains(query.ToLower())
                )
                .Distinct()
                .Take(10)
                .ToListAsync();

            return result
                .Select(s => new SchoolSuggestion
                {
                    SchoolName = s.SchoolName,
                    SchoolCode = s.SchoolCode,
                })
                .ToList();
        }

        public async Task<List<string?>> GetSchoolSuggestionsAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<string?>();
            }

            return await _context
                .Schools.Where(s =>
                    s.SchoolName != null
                    && EF.Functions.Like(s.SchoolName.ToLower(), $"{query.ToLower()}%")
                )
                .Select(s => s.SchoolName)
                .Distinct()
                .Take(10)
                .ToListAsync();
        }

        public async Task<School?> GetSchoolByName(string name)
        {
            return await _context.Schools.SingleOrDefaultAsync(s => s.SchoolName == name);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<User?> GetUserAsync(int id)
        {
            return await _context.Users.SingleOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<User>> GetUserFilteredAsync(UserType id)
        {
            return await _context.Users.Where(u => u.UserType == id).ToListAsync();
        }

        public async Task<User?> InsertUserAsync(User user)
        {
            bool userExists = await _context.Users.AnyAsync(u => u.Id == user.Id);
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
            bool userExists = await _context.Users.AnyAsync(u => u.Id == user.Id);
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
            bool userExists = await _context.Users.AnyAsync(u => u.Id == id);
            if (!userExists)
            {
                return false;
            }

            var user = await _context.Users.SingleOrDefaultAsync(c => c.Id == id);

            if (user == null)
            {
                return false;
            }
            _ = _context.Remove(user);

            try
            {
                return await _context.SaveChangesAsync() > 0 ? true : false;
            }
            catch (System.Exception exp)
            {
                _logger.LogError($"Error in {nameof(DeleteUserAsync)}: " + exp.Message);
            }
            return false;
        }

        public async Task<bool> MakeUserRegistrationRequest(UserCreateRequest request)
        {
            try
            {
                if (request.Name == null || request.Surname == null || request.Mail == null)
                {
                    return false;
                }
                var user = new User(request.Name, request.Surname, request.Mail)
                {
                    BilkentID = request.BilkentID,
                    MajorCode = request.MajorCode,
                    CurrentYear = request.CurrentYear,
                    UserType = UserType.Pending,
                };

                _context.Users.Add(user);

                var result = await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding registration: {ex.Message}");
                return false;
            }
        }

        public List<Major> GetAllMajors()
        {
            return Major.AllMajors;
        }
    }
}
