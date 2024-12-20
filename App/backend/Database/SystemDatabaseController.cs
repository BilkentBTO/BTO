using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class SystemDatabaseController
    {
        private readonly SystemDbContext _SystemContext;
        private readonly ILogger _logger;

        public SystemDatabaseController(SystemDbContext SystemContext, ILoggerFactory loggerFactory)
        {
            _SystemContext = SystemContext;
            _logger = loggerFactory.CreateLogger("SystemDatabaseController");
        }

        public async Task<ErrorTypes> AddGuideTourApplication(int TourID, int GuideUID)
        {
            if (TourID < 0)
            {
                return ErrorTypes.InvalidTourID;
            }

            if (GuideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            Tour? Tour = await _SystemContext.Tours.SingleOrDefaultAsync(t => t.ID == TourID);

            if (Tour == null)
            {
                return ErrorTypes.TourNotFound;
            }

            User? user = await _SystemContext.Users.SingleOrDefaultAsync(u => u.Id == GuideUID);

            if (user == null || user.UserType != UserType.Guide)
            {
                return ErrorTypes.UserNotFound;
            }

            Guide foundGuide = (Guide)user;

            Tour.AssignGuide(foundGuide);

            return ErrorTypes.Success;
        }

        public async Task<Registration?> GetGeneralRegistration(string Code)
        {
            if (string.IsNullOrEmpty(Code))
            {
                return null;
            }

            var type = Code[0];
            switch (type)
            {
                case 'T':
                    return await _SystemContext
                        .TourRegistrations.Include(r => r.School)
                        .Include(r => r.PreferredVisitTime)
                        .SingleOrDefaultAsync(r => r.Code == Code);
                case 'F':
                    return await _SystemContext
                        .FairRegistrations.Include(r => r.School)
                        .SingleOrDefaultAsync(r => r.Code == Code);
                case 'I':
                    return await _SystemContext
                        .IndividualRegistrations.Include(r => r.PreferredVisitTime)
                        .SingleOrDefaultAsync(r => r.Code == Code);
                default:
                    return null;
            }
        }

        public async Task<bool> CancelGeneralRegistration(string Code)
        {
            if (string.IsNullOrEmpty(Code))
            {
                return false;
            }

            var type = Code[0];
            switch (type)
            {
                case 'T':
                    return await CancelTourRegistration(Code);
                case 'F':
                    return await CancelFairRegistration(Code);
                case 'I':
                    return await CancelIndividualRegistration(Code);
                default:
                    return false;
            }
        }

        public async Task<string> AddTourRegistration(TourRegistrationRequest request)
        {
            try
            {
                var DoesSchoolExist = _SystemContext.TourRegistrations.Any(r =>
                    r.SchoolCode == request.SchoolCode
                );
                if (DoesSchoolExist)
                {
                    return "";
                }
                var School = await _SystemContext.Schools.FirstOrDefaultAsync(s =>
                    s.SchoolCode == request.SchoolCode
                );

                if (School == null)
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
                registration.FillSchool(School);

                _SystemContext.TourRegistrations.Add(registration);

                var result = await _SystemContext.SaveChangesAsync();

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
            return await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        public async Task<bool> CancelTourRegistration(string Code)
        {
            var tourRegistration = await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .SingleOrDefaultAsync(r => r.Code == Code);

            if (tourRegistration == null)
            {
                return false;
            }

            _SystemContext.TourRegistrations.Remove(tourRegistration);

            await _SystemContext.SaveChangesAsync();

            return true;
        }

        public async Task<List<TourRegistration>> GetAllTourRegistrations()
        {
            return await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .ToListAsync();
        }

        public async Task<List<TourRegistration>> GetAllTourRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _SystemContext
                .TourRegistrations.Where(r => r.State == state)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
                .ToListAsync();
        }

        public async Task<bool> AcceptTourRegistration(string Code)
        {
            var registration = await _SystemContext.TourRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Accepted;
            await _SystemContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectTourRegistration(string Code)
        {
            var registration = await _SystemContext.TourRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Rejected;
            await _SystemContext.SaveChangesAsync();
            return true;
        }

        public async Task<string> AddFairRegistration(FairRegistrationRequest request)
        {
            try
            {
                var school = await _SystemContext.Schools.FirstOrDefaultAsync(s =>
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

                _SystemContext.FairRegistrations.Add(registration);

                var result = await _SystemContext.SaveChangesAsync();

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
            return await _SystemContext
                .FairRegistrations.OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .ToListAsync();
        }

        public async Task<List<FairRegistration>> GetAllFairRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _SystemContext
                .FairRegistrations.Where(r => r.State == state)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .ToListAsync();
        }

        public async Task<FairRegistration?> GetFairRegistration(string Code)
        {
            return await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        public async Task<bool> CancelFairRegistration(string Code)
        {
            var fairRegistration = await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .SingleOrDefaultAsync(r => r.Code == Code);

            if (fairRegistration == null)
            {
                return false;
            }

            _SystemContext.FairRegistrations.Remove(fairRegistration);

            await _SystemContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AcceptFairRegistration(string Code)
        {
            var registration = await _SystemContext.FairRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Accepted;
            await _SystemContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectFairRegistration(string Code)
        {
            var registration = await _SystemContext.FairRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Rejected;
            await _SystemContext.SaveChangesAsync();
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

                _SystemContext.IndividualRegistrations.Add(registration);

                var result = await _SystemContext.SaveChangesAsync();
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
            return await _SystemContext
                .IndividualRegistrations.OrderBy(static r => r.IndividualName)
                .ToListAsync();
        }

        public async Task<List<IndividualRegistration>> GetAllIndividualRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _SystemContext
                .IndividualRegistrations.Where(r => r.State == state)
                .OrderBy(r => r.IndividualName)
                .ToListAsync();
        }

        public async Task<IndividualRegistration?> GetIndividualRegistration(string Code)
        {
            return await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );
        }

        public async Task<bool> CancelIndividualRegistration(string Code)
        {
            var individualRegistration =
                await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(r =>
                    r.Code == Code
                );

            if (individualRegistration == null)
            {
                return false;
            }

            _SystemContext.IndividualRegistrations.Remove(individualRegistration);

            await _SystemContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AcceptIndividualRegistration(string Code)
        {
            var registration = await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(
                r => r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Accepted;
            await _SystemContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectIndividualRegistration(string Code)
        {
            var registration = await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(
                r => r.Code == Code
            );

            if (registration == null)
            {
                return false;
            }
            registration.State = RegistrationState.Rejected;
            await _SystemContext.SaveChangesAsync();
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

            var result = await _SystemContext
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

            return await _SystemContext
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
            return await _SystemContext.Schools.SingleOrDefaultAsync(s => s.SchoolName == name);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _SystemContext.Users.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<User?> GetUserAsync(int id)
        {
            return await _SystemContext.Users.SingleOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<User>> GetUserFilteredAsync(UserType id)
        {
            return await _SystemContext.Users.Where(u => u.UserType == id).ToListAsync();
        }

        public async Task<User?> InsertUserAsync(User user)
        {
            bool userExists = await _SystemContext.Users.AnyAsync(u => u.Id == user.Id);
            if (userExists)
            {
                return null;
            }

            _SystemContext.Add(user);
            try
            {
                await _SystemContext.SaveChangesAsync();
            }
            catch (System.Exception exp)
            {
                _logger.LogError($"Error in {nameof(InsertUserAsync)}: " + exp.Message);
            }

            return user;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            bool userExists = await _SystemContext.Users.AnyAsync(u => u.Id == user.Id);
            if (!userExists)
            {
                return false;
            }

            _SystemContext.Users.Attach(user);
            _SystemContext.Entry(user).State = EntityState.Modified;
            try
            {
                return (await _SystemContext.SaveChangesAsync() > 0 ? true : false);
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(UpdateUserAsync)}: " + exp.Message);
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            bool userExists = await _SystemContext.Users.AnyAsync(u => u.Id == id);
            if (!userExists)
            {
                return false;
            }

            var user = await _SystemContext.Users.SingleOrDefaultAsync(c => c.Id == id);

            if (user == null)
            {
                return false;
            }
            _ = _SystemContext.Remove(user);

            try
            {
                return await _SystemContext.SaveChangesAsync() > 0 ? true : false;
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

                _SystemContext.Users.Add(user);

                var result = await _SystemContext.SaveChangesAsync();

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
