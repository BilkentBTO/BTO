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

        public async Task<ErrorTypes> AddGuideTourApplication(GuideTourApplicationRequest request)
        {
            string? tourCode = request.TourCode;
            int guideUID = request.GuideUID;

            if (string.IsNullOrEmpty(tourCode))
            {
                return ErrorTypes.InvalidTourCode;
            }
            if (guideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            bool applicationExists = await _SystemContext.GuideTourApplication.AnyAsync(a =>
                a.GuideUID == guideUID
            );

            if (applicationExists)
            {
                return ErrorTypes.GuideAlreadyAppliedToTour;
            }

            bool tourExists = await _SystemContext.Tours.AnyAsync(t =>
                t.TourRegistrationCode == tourCode
            );

            if (!tourExists)
            {
                return ErrorTypes.TourNotFound;
            }

            bool guideExists = await _SystemContext.Users.AnyAsync(u => u.ID == guideUID);

            if (!guideExists)
            {
                return ErrorTypes.UserNotFound;
            }
            GuideTourApplication application = new GuideTourApplication
            {
                TourCode = tourCode,
                GuideUID = guideUID,
            };

            await _SystemContext.GuideTourApplication.AddAsync(application);
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        public async Task<ErrorTypes> AddGuideToTour(string TourCode, int GuideUID)
        {
            if (string.IsNullOrEmpty(TourCode))
            {
                return ErrorTypes.InvalidTourCode;
            }

            if (GuideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            Tour? Tour = await _SystemContext.Tours.SingleOrDefaultAsync(t =>
                t.TourRegistrationCode == TourCode
            );

            if (Tour == null)
            {
                return ErrorTypes.TourNotFound;
            }

            User? user = await _SystemContext.Users.SingleOrDefaultAsync(u => u.ID == GuideUID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            User foundGuide = user;

            Tour.AssignGuide(foundGuide);

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        public async Task<List<GuideTourApplication>> GetAllGuideTourApplications()
        {
            var applications = await _SystemContext
                .GuideTourApplication.Include(a => a.Tour)
                .Include(g => g.Guide)
                .ToListAsync();

            List<GuideTourApplication> result = new List<GuideTourApplication>();
            foreach (var application in applications)
            {
                if (string.IsNullOrEmpty(application.TourCode))
                {
                    continue;
                }
                Tour? linkedTour = await GetTour(application.TourCode);
                if (linkedTour == null)
                {
                    continue;
                }
                User? linkedUser = await GetUserAsync(application.GuideUID);
                if (linkedUser == null)
                {
                    continue;
                }
                application.Tour = linkedTour;
                application.Guide = linkedUser;
                result.Add(application);
            }

            return result;
        }

        public async Task<ErrorTypes> AcceptGuideTourApplication(int guideUID)
        {
            if (guideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            GuideTourApplication? guideTourApplication =
                await _SystemContext.GuideTourApplication.SingleOrDefaultAsync(a =>
                    a.GuideUID == guideUID
                );

            if (guideTourApplication == null)
            {
                return ErrorTypes.UserNotFound;
            }

            if (guideTourApplication.TourCode == null)
            {
                return ErrorTypes.TourNotFound;
            }

            var result = await AddGuideToTour(
                guideTourApplication.TourCode,
                guideTourApplication.GuideUID
            );

            if (result == ErrorTypes.Success)
            {
                _SystemContext.Remove(guideTourApplication);
                await _SystemContext.SaveChangesAsync();
            }
            return result;
        }

        public async Task<ErrorTypes> RejectGuideTourApplication(int guideUID)
        {
            if (guideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            GuideTourApplication? guideTourApplication =
                await _SystemContext.GuideTourApplication.SingleOrDefaultAsync(a =>
                    a.GuideUID == guideUID
                );

            if (guideTourApplication == null)
            {
                return ErrorTypes.UserNotFound;
            }

            _SystemContext.GuideTourApplication.Remove(guideTourApplication);
            await _SystemContext.SaveChangesAsync();
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
                        .Include(r => r.TimeBlock)
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

        public async Task<ErrorTypes> CancelGeneralRegistration(string Code)
        {
            if (string.IsNullOrEmpty(Code))
            {
                return ErrorTypes.InvalidCode;
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
                    return ErrorTypes.InvalidCode;
            }
        }

        public async Task<string> AddTourRegistration(TourRegistrationRequest request)
        {
            try
            {
                var SchoolExists = _SystemContext.Schools.Any(r =>
                    r.SchoolCode == request.SchoolCode
                );
                if (!SchoolExists)
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
                    Time = request.DateOfVisit,
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

                if (string.IsNullOrEmpty(registration.Code) || registration.School == null)
                {
                    return "";
                }

                bool TimeBlockExists = await _SystemContext.TimeBlocks.AnyAsync(tb =>
                    tb.Time == request.DateOfVisit
                );

                TimeBlock? TimeBlock;
                if (!TimeBlockExists)
                {
                    TimeBlock = new TimeBlock() { Time = request.DateOfVisit };
                }
                else
                {
                    TimeBlock = await _SystemContext.TimeBlocks.FirstOrDefaultAsync(tb =>
                        tb.Time == request.DateOfVisit
                    );
                }

                if (TimeBlock == null)
                {
                    return "";
                }

                TimeBlock.AddTour(registration.Code);

                registration.FillTimeBlock(TimeBlock);

                if (!TimeBlockExists)
                {
                    _SystemContext.TimeBlocks.Add(TimeBlock);
                }

                _SystemContext.TourRegistrations.Add(registration);

                await _SystemContext.SaveChangesAsync();

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
                .Include(r => r.TimeBlock)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        public async Task<ErrorTypes> CancelTourRegistration(string Code)
        {
            if (string.IsNullOrEmpty(Code))
            {
                return ErrorTypes.InvalidTourCode;
            }

            var tourRegistration = await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .SingleOrDefaultAsync(r => r.Code == Code);

            if (tourRegistration == null)
            {
                return ErrorTypes.TourRegistrationNotFound;
            }

            if (tourRegistration.TimeBlock != null)
            {
                tourRegistration.TimeBlock.RemoveTour(Code);
            }

            _SystemContext.TourRegistrations.Remove(tourRegistration);

            var tour = await _SystemContext.Tours.FirstOrDefaultAsync(t =>
                t.TourRegistrationCode == Code
            );

            if (tour != null)
            {
                _SystemContext.Tours.Remove(tour);
            }

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        public async Task<List<TourRegistration>> GetAllTourRegistrations()
        {
            return await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
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
                .Include(r => r.TimeBlock)
                .ToListAsync();
        }

        public async Task<ErrorTypes> AcceptTourRegistration(string Code)
        {
            if (await _SystemContext.Tours.AnyAsync(t => t.TourRegistrationCode == Code))
            {
                return ErrorTypes.TourAlreadyAccepted;
            }

            TourRegistration? TourRegistration = await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .FirstOrDefaultAsync(t => t.Code == Code);

            if (TourRegistration == null)
            {
                return ErrorTypes.TourRegistrationNotFound;
            }

            if (TourRegistration.School == null)
            {
                return ErrorTypes.TourRegistrationNotLinkedWithSchool;
            }

            TourRegistration.State = RegistrationState.Accepted;

            Tour newTour = new Tour
            {
                TourRegistrationCode = Code,
                TourRegistirationInfo = TourRegistration,
                Priority = TourRegistration.School.Priority,
            };

            await _SystemContext.Tours.AddAsync(newTour);
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        public async Task<ErrorTypes> MarkConflictAsSolved(string tourCode)
        {
            if (string.IsNullOrEmpty(tourCode))
            {
                return ErrorTypes.InvalidTourCode;
            }

            TourRegistration? TourRegistration = await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .FirstOrDefaultAsync(t => t.Code == tourCode);

            if (TourRegistration == null)
            {
                return ErrorTypes.TourNotFound;
            }

            if (TourRegistration.TimeBlock == null)
            {
                return ErrorTypes.TourNotFound;
            }

            TourRegistration.TimeBlock.ConflictSolved = true;

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
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

        public async Task<ErrorTypes> CancelFairRegistration(string Code)
        {
            if (string.IsNullOrEmpty(Code))
            {
                return ErrorTypes.InvalidFairCode;
            }
            var fairRegistration = await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .SingleOrDefaultAsync(r => r.Code == Code);

            if (fairRegistration == null)
            {
                return ErrorTypes.FairRegistrationNotFound;
            }
            var fair = await _SystemContext.Fairs.FirstOrDefaultAsync(f =>
                f.FairRegistrationCode == Code
            );

            if (fair != null)
            {
                _SystemContext.Fairs.Remove(fair);
            }
            _SystemContext.FairRegistrations.Remove(fairRegistration);

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        public async Task<ErrorTypes> AcceptFairRegistration(string Code)
        {
            if (await _SystemContext.Fairs.AnyAsync(t => t.FairRegistrationCode == Code))
            {
                return ErrorTypes.FairAlreadyAccepted;
            }

            FairRegistration? FairRegistration = await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .FirstOrDefaultAsync(t => t.Code == Code);

            if (FairRegistration == null)
            {
                return ErrorTypes.FairRegistrationNotFound;
            }

            if (FairRegistration.School == null)
            {
                return ErrorTypes.FairRegistrationNotLinkedWithSchool;
            }

            FairRegistration.State = RegistrationState.Accepted;

            Fair newFair = new Fair
            {
                FairRegistrationCode = Code,
                FairRegistirationInfo = FairRegistration,
            };

            await _SystemContext.Fairs.AddAsync(newFair);
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
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
                    IndividualSurname = request.IndividualSurname,
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

        public async Task<ErrorTypes> CancelIndividualRegistration(string Code)
        {
            if (string.IsNullOrEmpty(Code))
            {
                return ErrorTypes.InvalidIndividualCode;
            }
            var individualRegistration =
                await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(r =>
                    r.Code == Code
                );

            if (individualRegistration == null)
            {
                return ErrorTypes.IndividualRegistrationNotFound;
            }

            _SystemContext.IndividualRegistrations.Remove(individualRegistration);

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
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
            return await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == id);
        }

        public async Task<List<User>> GetUserFilteredAsync(UserType id)
        {
            return await _SystemContext.Users.Where(u => u.UserType == id).ToListAsync();
        }

        public async Task<ErrorTypes> AddUserAsync(UserCreate userCreate)
        {
            if (string.IsNullOrEmpty(userCreate.Name) || string.IsNullOrEmpty(userCreate.Username))
            {
                return ErrorTypes.InvalidUserName;
            }
            if (string.IsNullOrEmpty(userCreate.Mail))
            {
                return ErrorTypes.InvalidMail;
            }
            if (string.IsNullOrEmpty(userCreate.Surname))
            {
                return ErrorTypes.InvalidSurname;
            }

            string username = userCreate.Username;

            if (_SystemContext.Credentials.Any(c => c.Username == username))
            {
                return ErrorTypes.UserAlreadyExists;
            }

            User newUser;

            if (userCreate.UserType == UserType.Guide)
            {
                newUser = new Guide(userCreate.Name, userCreate.Surname, userCreate.Mail)
                {
                    BilkentID = userCreate.BilkentID,
                    MajorCode = userCreate.MajorCode,
                    CurrentYear = userCreate.CurrentYear,
                    UserType = userCreate.UserType,
                };
            }
            else if (userCreate.UserType == UserType.Advisor)
            {
                newUser = new Advisor(userCreate.Name, userCreate.Surname, userCreate.Mail)
                {
                    BilkentID = userCreate.BilkentID,
                    MajorCode = userCreate.MajorCode,
                    CurrentYear = userCreate.CurrentYear,
                    UserType = userCreate.UserType,
                };
            }
            else
            {
                newUser = new User(userCreate.Name, userCreate.Surname, userCreate.Mail)
                {
                    BilkentID = userCreate.BilkentID,
                    MajorCode = userCreate.MajorCode,
                    CurrentYear = userCreate.CurrentYear,
                    UserType = userCreate.UserType,
                };
            }

            await _SystemContext.Users.AddAsync(newUser);

            string randomPassword = GenerateRandomPassword();

            Credential newCredential = new Credential(
                username,
                randomPassword,
                newUser.ID,
                userCreate.UserType
            );

            await _SystemContext.Credentials.AddAsync(newCredential);

            await _SystemContext.SaveChangesAsync();

            //TODO ADD MAIL TO USER
            return ErrorTypes.Success;
        }

        public async Task<ErrorTypes> UpdateUserAsync(UserEdit userEdit)
        {
            if (userEdit.ID < 0)
            {
                return ErrorTypes.InvalidUserName;
            }
            var user = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == userEdit.ID);
            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            if (userEdit.CurrentYear != 0 && userEdit.CurrentYear != user.CurrentYear)
            {
                user.CurrentYear = userEdit.CurrentYear;
            }
            if (userEdit.MajorCode != 0 && userEdit.MajorCode != user.MajorCode)
            {
                user.MajorCode = userEdit.MajorCode;
            }
            if (userEdit.UserType != UserType.Invalid && userEdit.UserType != user.UserType)
            {
                user.UserType = userEdit.UserType;
            }
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            bool userExists = await _SystemContext.Users.AnyAsync(u => u.ID == id);
            if (!userExists)
            {
                return false;
            }

            var user = await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == id);

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

        public async Task<bool> DeleteUserRegisterRequestAsync(int UID)
        {
            bool userExists = await _SystemContext.Users.AnyAsync(u => u.ID == UID);
            if (!userExists)
            {
                return false;
            }

            var user = await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == UID);

            if (user == null)
            {
                return false;
            }

            if (user.UserType != UserType.Pending)
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

        public List<Major> GetAllMajors()
        {
            return Major.AllMajors;
        }

        public async Task<int> GetAllowedConcurrentTourCount()
        {
            var setting = await _SystemContext.Setting.FirstOrDefaultAsync();
            if (setting != null)
            {
                return setting.AllowedConcurrentTourCount;
            }
            return 2;
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string validChars =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
            var random = new Random();
            return new string(
                Enumerable
                    .Repeat(validChars, length)
                    .Select(s => s[random.Next(s.Length)])
                    .ToArray()
            );
        }

        private async Task<Tour?> GetTour(string tourCode)
        {
            Tour? foundTour = await _SystemContext.Tours.FirstOrDefaultAsync(t =>
                t.TourRegistrationCode == tourCode
            );
            if (foundTour == null)
            {
                return null;
            }
            TourRegistration? TourRegistration = await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .FirstOrDefaultAsync(t => t.Code == tourCode);
            if (TourRegistration == null)
            {
                return null;
            }
            foundTour.FillTourRegistrationInfo(TourRegistration);
            return foundTour;
        }
    }
}
