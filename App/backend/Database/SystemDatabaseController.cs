/// <summary>
/// This class provides various user management functionalities within the system.
/// It includes operations for creating, updating, deleting, and managing users,
/// as well as handling specific user-related tasks such as assigning responsible days,
/// managing available hours, and updating work hours.
/// </summary>
///
/// <remarks>
/// The class interacts with the system's data context (_SystemContext) to access and modify user-related data.
/// It includes methods for user registration, user detail updates, and managing the responsibilities of users
/// such as assigning specific days of the week for responsibility, tracking the user's work hours, and managing
/// their available hours for tour guiding duties.
///
/// Key Features:
/// - Add, update, and delete users based on unique user IDs.
/// - Assign and update a user's responsible day (for tour or advisory duties).
/// - Add and remove available hours for tour guides.
/// - Create user registration requests and handle user removal requests.
/// - Retrieve information about the user's concurrent tour limits, available majors, and specific tours a user is responsible for.
/// - Manage system-wide settings such as the number of concurrent tours allowed.
///
/// Methods:
/// - `UpdateUserAsync`: Updates the details of an existing user (e.g., major, current year, user type).
/// - `ChangeResponsibleDayOfUser`: Changes the responsible day for a user based on their ID.
/// - `GetResponsibleToursOfUser`: Retrieves the tours a specific user is responsible for, based on their responsible day.
/// - `GetResponsibleAdvisors`: Retrieves a list of advisors who are responsible for each day of the week.
/// - `AddWorkHoursToUser`: Adds a specified number of work hours to a user's record.
/// - `DeleteUserAsync`: Deletes a user from the system by their ID.
/// - `AddAvailableHoursToGuide`: Adds available hours to a guide's schedule, ensuring no duplicates.
/// - `RemoveAvailableHoursFromGuide`: Removes specific available hours from a guide's schedule.
/// - `MakeUserRegistrationRequest`: Handles the creation of a user registration request with pending status.
/// - `DeleteUserRegisterRequestAsync`: Deletes a pending user registration request based on their ID.
/// - `GetAllMajors`: Retrieves a list of all majors available in the system.
/// - `GetAllowedConcurrentTourCount`: Retrieves the number of concurrent tours allowed for a user based on system settings.
/// - `GenerateRandomPassword`: Generates a random password with a specified length for user accounts.
/// - `GetTour`: Retrieves a specific tour by its code, including relevant registration and time block details.
/// - `GenerateSurveyCode`: Generates a random survey code for a user's survey registration.
/// </remarks>
using System.Drawing;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    /// <summary>
    /// The SystemDatabaseController class provides methods for managing tours, guides, and guide applications.
    /// It handles the operations related to adding guides to tours, processing guide tour applications, and retrieving application data.
    /// </summary>
    public class SystemDatabaseController
    {
        private readonly SystemDbContext _SystemContext;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes the SystemDatabaseController with a given database context and logger.
        /// </summary>
        /// <param name="SystemContext">The database context for interacting with the system data.</param>
        /// <param name="loggerFactory">The factory used for creating loggers.</param>
        public SystemDatabaseController(SystemDbContext SystemContext, ILoggerFactory loggerFactory)
        {
            _SystemContext = SystemContext;
            _logger = loggerFactory.CreateLogger("SystemDatabaseController");
        }

        /// <summary>
        /// Adds a new guide tour application to the database.
        /// Verifies the validity of the provided tour code and guide user ID, checks for existing applications,
        /// and ensures that the guide and tour exist before creating the application.
        /// </summary>
        /// <param name="request">The request containing the tour code and guide user ID.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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
            bool applicationExistsOnIndividual =
                await _SystemContext.GuideIndividualTourApplication.AnyAsync(a =>
                    a.GuideUID == guideUID
                );

            if (applicationExists || applicationExistsOnIndividual)
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

        public async Task<ErrorTypes> AddGuideIndividualTourApplication(
            GuideIndividualTourApplicationRequest request
        )
        {
            string? tourCode = request.IndividualTourCode;
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
            bool applicationExistsOnIndividual =
                await _SystemContext.GuideIndividualTourApplication.AnyAsync(a =>
                    a.GuideUID == guideUID
                );

            if (applicationExists || applicationExistsOnIndividual)
            {
                return ErrorTypes.GuideAlreadyAppliedToTour;
            }

            bool tourExists = await _SystemContext.IndividualTours.AnyAsync(t =>
                t.IndividualTourRegistrationCode == tourCode
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
            GuideIndividualTourApplication application = new GuideIndividualTourApplication
            {
                IndividualTourCode = tourCode,
                GuideUID = guideUID,
            };

            await _SystemContext.GuideIndividualTourApplication.AddAsync(application);
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Adds a guide to a specific tour by assigning the guide to the tour and updating the guide's assigned tour code.
        /// Verifies the existence of the tour and guide before making the assignment.
        /// </summary>
        /// <param name="TourCode">The registration code of the tour to assign the guide to.</param>
        /// <param name="GuideUID">The ID of the guide to be assigned to the tour.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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
            foundGuide.AssignedTourCode = Tour.TourRegistrationCode;
            Quiz? quiz = await _SystemContext.Quizzes.FirstOrDefaultAsync(q =>
                q.Code == Tour.QuizCode
            );
            if (quiz != null)
            {
                quiz.UID = foundGuide.ID;
            }
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        public async Task<ErrorTypes> AddGuideToIndividualTour(string TourCode, int GuideUID)
        {
            if (string.IsNullOrEmpty(TourCode))
            {
                return ErrorTypes.InvalidTourCode;
            }

            if (GuideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            IndividualTour? IndividualTour =
                await _SystemContext.IndividualTours.SingleOrDefaultAsync(t =>
                    t.IndividualTourRegistrationCode == TourCode
                );

            if (IndividualTour == null)
            {
                return ErrorTypes.TourNotFound;
            }

            User? user = await _SystemContext.Users.SingleOrDefaultAsync(u => u.ID == GuideUID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            User foundGuide = user;

            IndividualTour.AssignGuide(foundGuide);
            foundGuide.AssignedTourCode = IndividualTour.IndividualTourRegistrationCode;

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Retrieves a list of all guide tour applications, including details about the associated tour and guide.
        /// </summary>
        /// <returns>A list of GuideTourApplication objects that include the tour and guide details.</returns>
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

        public async Task<
            List<GuideIndividualTourApplication>
        > GetAllGuideIndividualTourApplications()
        {
            var applications = await _SystemContext
                .GuideIndividualTourApplication.Include(a => a.IndividualTour)
                .Include(g => g.Guide)
                .ToListAsync();

            List<GuideIndividualTourApplication> result =
                new List<GuideIndividualTourApplication>();
            foreach (var application in applications)
            {
                if (string.IsNullOrEmpty(application.IndividualTourCode))
                {
                    continue;
                }
                IndividualTour? linkedTour = await GetIndividualTour(
                    application.IndividualTourCode
                );
                if (linkedTour == null)
                {
                    continue;
                }
                User? linkedUser = await GetUserAsync(application.GuideUID);
                if (linkedUser == null)
                {
                    continue;
                }
                application.IndividualTour = linkedTour;
                application.Guide = linkedUser;
                result.Add(application);
            }

            return result;
        }

        /// <summary>
        /// Accepts a guide's tour application and assigns them to the associated tour.
        /// The application is removed after successful assignment.
        /// </summary>
        /// <param name="guideUID">The ID of the guide whose application is to be accepted.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
        public async Task<ErrorTypes> AcceptGuideTourApplication(int guideUID)
        {
            if (guideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            // Retrieve both types of applications
            var guideTourApplication =
                await _SystemContext.GuideTourApplication.SingleOrDefaultAsync(a =>
                    a.GuideUID == guideUID
                );

            var guideIndividualTourApplication =
                await _SystemContext.GuideIndividualTourApplication.SingleOrDefaultAsync(a =>
                    a.GuideUID == guideUID
                );

            // Handle the case where neither application exists
            if (guideTourApplication == null && guideIndividualTourApplication == null)
            {
                return ErrorTypes.UserNotFound;
            }

            // Determine which application to process
            if (guideTourApplication != null)
            {
                // Validate the TourCode for GuideTourApplication
                if (guideTourApplication.TourCode == null)
                {
                    return ErrorTypes.TourNotFound;
                }

                // Process GuideTourApplication
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
            else if (guideIndividualTourApplication != null)
            {
                // Validate the TourCode for GuideIndividualTourApplication
                if (guideIndividualTourApplication.IndividualTourCode == null)
                {
                    return ErrorTypes.TourNotFound;
                }

                // Process GuideIndividualTourApplication
                var result = await AddGuideToIndividualTour(
                    guideIndividualTourApplication.IndividualTourCode,
                    guideIndividualTourApplication.GuideUID
                );

                if (result == ErrorTypes.Success)
                {
                    _SystemContext.Remove(guideIndividualTourApplication);
                    await _SystemContext.SaveChangesAsync();
                }

                return result;
            }

            return ErrorTypes.TourNotFound;
        }

        /// <summary>
        /// Rejects a guide's tour application and removes it from the database.
        /// </summary>
        /// <param name="guideUID">The ID of the guide whose application is to be rejected.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
        public async Task<ErrorTypes> RejectGuideTourApplication(int guideUID)
        {
            if (guideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            // Retrieve both types of applications
            var guideTourApplication =
                await _SystemContext.GuideTourApplication.SingleOrDefaultAsync(a =>
                    a.GuideUID == guideUID
                );

            var guideIndividualTourApplication =
                await _SystemContext.GuideIndividualTourApplication.SingleOrDefaultAsync(a =>
                    a.GuideUID == guideUID
                );

            // Handle the case where neither application exists
            if (guideTourApplication == null && guideIndividualTourApplication == null)
            {
                return ErrorTypes.UserNotFound;
            }

            // Remove the application that exists
            if (guideTourApplication != null)
            {
                _SystemContext.GuideTourApplication.Remove(guideTourApplication);
            }
            else if (guideIndividualTourApplication != null)
            {
                _SystemContext.GuideIndividualTourApplication.Remove(
                    guideIndividualTourApplication
                );
            }

            // Save changes
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Retrieves a general registration (tour, fair, or individual) by its unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the registration.</param>
        /// <returns>Returns the registration details if found, or null if the code is invalid.</returns>
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
                        .IndividualRegistrations.Include(r => r.TimeBlock)
                        .SingleOrDefaultAsync(r => r.Code == Code);
                default:
                    return null;
            }
        }

        /// <summary>
        /// Cancels a general registration (tour, fair, or individual) by its unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the registration.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

        /// <summary>
        /// Adds a new tour registration to the database.
        /// It validates the school, time block, and other registration details before creating the registration.
        /// </summary>
        /// <param name="request">The request containing the tour registration details.</param>
        /// <returns>Returns the generated registration code if successful, or an empty string if unsuccessful.</returns>
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

        /// <summary>
        /// Retrieves a tour registration by its unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the tour registration.</param>
        /// <returns>Returns the tour registration details if found, or null if the code is invalid.</returns>
        public async Task<TourRegistration?> GetTourRegistration(string Code)
        {
            return await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        /// <summary>
        /// Cancels a tour registration by its unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the tour registration to cancel.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

        /// <summary>
        /// Retrieves a list of all tour registrations, sorted by school priority.
        /// </summary>
        /// <returns>A list of all tour registrations.</returns>
        public async Task<List<TourRegistration>> GetAllTourRegistrations()
        {
            return await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a filtered list of tour registrations based on their state.
        /// </summary>
        /// <param name="state">The state of the tour registrations to filter by.</param>
        /// <returns>A list of tour registrations with the specified state.</returns>
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

        /// <summary>
        /// Accepts a tour registration and creates a corresponding tour, marking the registration as accepted.
        /// </summary>
        /// <param name="Code">The unique code representing the tour registration to accept.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

            newTour.QuizCode = GenerateSurveyCode();

            Quiz quiz = new Quiz();
            quiz.Code = newTour.QuizCode;
            quiz.SchoolCode = newTour.TourRegistirationInfo.SchoolCode;

            await _SystemContext.Quizzes.AddAsync(quiz);
            await _SystemContext.Tours.AddAsync(newTour);
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Marks a conflict related to a specific tour as solved. This is done by setting the ConflictSolved flag
        /// in the associated TimeBlock to true.
        /// </summary>
        /// <param name="tourCode">The unique code of the tour whose conflict needs to be resolved.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

        /// <summary>
        /// Rejects a tour registration by changing its state to 'Rejected'. This action signifies that the registration
        /// is no longer accepted.
        /// </summary>
        /// <param name="Code">The unique code representing the tour registration to reject.</param>
        /// <returns>Returns a boolean indicating the success or failure of the rejection operation.</returns>
        public async Task<ErrorTypes> RejectTourRegistration(string Code)
        {
            var registration = await _SystemContext.TourRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );

            if (registration == null)
            {
                return ErrorTypes.TourRegistrationNotFound;
            }
            registration.State = RegistrationState.Rejected;
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Adds a new fair registration to the system. The registration is associated with a specific school and includes
        /// details such as the city name, supervisor information, and visit date. The registration is marked as pending until
        /// it is processed.
        /// </summary>
        /// <param name="request">The request containing the fair registration details.</param>
        /// <returns>Returns the generated registration code if successful, or an empty string if the registration fails.</returns>
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
                    Time = request.DateOfVisit,
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

        /// <summary>
        /// Retrieves a list of all fair registrations, ordered by school priority.
        /// </summary>
        /// <returns>Returns a list of all fair registrations.</returns>
        public async Task<List<FairRegistration>> GetAllFairRegistrations()
        {
            return await _SystemContext
                .FairRegistrations.OrderBy(r => r.School != null ? r.School.Priority : int.MaxValue)
                .Include(r => r.School)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a list of fair registrations filtered by their state, ordered by school priority.
        /// </summary>
        /// <param name="state">The state of the fair registrations to filter by.</param>
        /// <returns>Returns a list of fair registrations matching the specified state.</returns>
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

        /// <summary>
        /// Retrieves the fair registration details associated with the provided unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the fair registration.</param>
        /// <returns>Returns the fair registration details if found, or null if the code is invalid.</returns>
        public async Task<FairRegistration?> GetFairRegistration(string Code)
        {
            return await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .SingleOrDefaultAsync(r => r.Code == Code);
        }

        /// <summary>
        /// Cancels a fair registration by its unique code, removing both the registration and the associated fair if present.
        /// </summary>
        /// <param name="Code">The unique code representing the fair registration to cancel.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

        /// <summary>
        /// Accepts a fair registration by changing its state to 'Accepted' and creates a new Fair entry.
        /// </summary>
        /// <param name="Code">The unique code representing the fair registration to accept.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

        /// <summary>
        /// Rejects a fair registration by changing its state to 'Rejected'.
        /// </summary>
        /// <param name="Code">The unique code representing the fair registration to reject.</param>
        /// <returns>Returns a boolean indicating the success or failure of the rejection operation.</returns>
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

        /// <summary>
        /// Adds a new individual registration based on the provided request details. The registration is marked as pending until
        /// it is processed.
        /// </summary>
        /// <param name="request">The request containing the individual registration details.</param>
        /// <returns>Returns the generated registration code if successful, or an empty string if the registration fails.</returns>
        public async Task<string> AddIndividualRegistration(IndividualRegistrationRequest request)
        {
            try
            {
                var registration = new IndividualRegistration
                {
                    Time = request.DateOfVisit,
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

        /// <summary>
        /// Retrieves a list of all individual registrations, ordered by individual name.
        /// </summary>
        /// <returns>Returns a list of all individual registrations.</returns>
        public async Task<List<IndividualRegistration>> GetAllIndividualRegistrations()
        {
            return await _SystemContext
                .IndividualRegistrations.OrderBy(static r => r.IndividualName)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a list of individual registrations filtered by their state, ordered by individual name.
        /// </summary>
        /// <param name="state">The state of the individual registrations to filter by.</param>
        /// <returns>Returns a list of individual registrations matching the specified state.</returns>
        public async Task<List<IndividualRegistration>> GetAllIndividualRegistrationsFiltered(
            RegistrationState state
        )
        {
            return await _SystemContext
                .IndividualRegistrations.Where(r => r.State == state)
                .OrderBy(r => r.IndividualName)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves the individual registration details associated with the provided unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the individual registration.</param>
        /// <returns>Returns the individual registration details if found, or null if the code is invalid.</returns>
        public async Task<IndividualRegistration?> GetIndividualRegistration(string Code)
        {
            return await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(r =>
                r.Code == Code
            );
        }

        /// <summary>
        /// Cancels an individual registration by its unique code.
        /// </summary>
        /// <param name="Code">The unique code representing the individual registration to cancel.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
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

        /// <summary>
        /// Accepts an individual registration by changing its state to 'Accepted'.
        /// </summary>
        /// <param name="Code">The unique code representing the individual registration to accept.</param>
        /// <returns>Returns a boolean indicating the success or failure of the acceptance operation.</returns>
        public async Task<ErrorTypes> AcceptIndividualRegistration(string Code)
        {
            if (
                await _SystemContext.IndividualTours.AnyAsync(t =>
                    t.IndividualTourRegistrationCode == Code
                )
            )
            {
                return ErrorTypes.TourAlreadyAccepted;
            }
            IndividualRegistration? registration = await _SystemContext
                .IndividualRegistrations.Include(t => t.TimeBlock)
                .FirstOrDefaultAsync(r => r.Code == Code);

            if (registration == null)
            {
                return ErrorTypes.TourRegistrationNotFound;
            }
            registration.State = RegistrationState.Accepted;

            IndividualTour newIndividualTour = new IndividualTour
            {
                IndividualTourRegistrationCode = Code,
                TourRegistirationInfo = registration,
            };

            await _SystemContext.IndividualTours.AddAsync(newIndividualTour);

            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Rejects an individual registration by changing its state to 'Rejected'.
        /// </summary>
        /// <param name="Code">The unique code representing the individual registration to reject.</param>
        /// <returns>Returns a boolean indicating the success or failure of the rejection operation.</returns>
        public async Task<ErrorTypes> RejectIndividualRegistration(string Code)
        {
            var registration = await _SystemContext.IndividualRegistrations.SingleOrDefaultAsync(
                r => r.Code == Code
            );

            if (registration == null)
            {
                return ErrorTypes.TourRegistrationNotFound;
            }
            registration.State = RegistrationState.Rejected;
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Retrieves a list of all city names from the CityData.
        /// </summary>
        /// <returns>Returns a list of city names.</returns>
        public List<string> GetAllCityNames()
        {
            List<string> cityNames = new List<string>();
            foreach (var city in CityData.Cities)
            {
                cityNames.Add(city.name);
            }
            return cityNames;
        }

        /// <summary>
        /// Retrieves a list of school suggestions based on the provided query and city name. Filters the schools
        /// by the specified query and city code.
        /// </summary>
        /// <param name="query">The search query used to filter the schools by name.</param>
        /// <param name="cityName">The name of the city to filter the schools by.</param>
        /// <returns>Returns a list of school suggestions that match the query and city name.</returns>
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

        /// <summary>
        /// Retrieves a list of school suggestions based on the provided search query. The schools are filtered by name,
        /// and only the first 10 matches are returned.
        /// </summary>
        /// <param name="query">The search query to filter schools by name.</param>
        /// <returns>Returns a list of distinct school names that match the query.</returns>
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

        /// <summary>
        /// Retrieves a list of all users, ordered by their name.
        /// </summary>
        /// <returns>Returns a list of all users.</returns>
        public async Task<List<User>> GetUsersAsync()
        {
            return await _SystemContext.Users.OrderBy(c => c.Name).ToListAsync();
        }

        /// <summary>
        /// Retrieves a specific user by their unique ID.
        /// </summary>
        /// <param name="id">The ID of the user to retrieve.</param>
        /// <returns>Returns the user if found, or null if no user exists with the given ID.</returns>
        public async Task<User?> GetUserAsync(int id)
        {
            return await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == id);
        }

        /// <summary>
        /// Retrieves the tour associated with a specific user by their ID.
        /// </summary>
        /// <param name="id">The ID of the user whose tour is being requested.</param>
        /// <returns>Returns the user's tour if found, or null if the user has no assigned tour.</returns>
        public async Task<Tour?> GetTourOfUser(int id)
        {
            var User = await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == id);

            if (User == null || User.AssignedTourCode == null)
            {
                return null;
            }

            var Tour = await _SystemContext.Tours.SingleOrDefaultAsync(t =>
                t.TourRegistrationCode == User.AssignedTourCode
            );

            if (Tour == null)
            {
                return null;
            }

            TourRegistration? TourRegistration = await _SystemContext
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.TimeBlock)
                .FirstOrDefaultAsync(t => t.Code == Tour.TourRegistrationCode);

            if (TourRegistration == null)
            {
                return null;
            }

            Tour.FillTourRegistrationInfo(TourRegistration);

            return Tour;
        }

        /// <summary>
        /// Retrieves the fair associated with a specific user by their ID.
        /// </summary>
        /// <param name="id">The ID of the user whose fair is being requested.</param>
        /// <returns>Returns the user's fair if found, or null if the user has no assigned fair.</returns>
        public async Task<Fair?> GetFairOfUser(int id)
        {
            var User = await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == id);

            if (User == null || User.AssignedFairCode == null)
            {
                return null;
            }

            var Fair = await _SystemContext.Fairs.SingleOrDefaultAsync(t =>
                t.FairRegistrationCode == User.AssignedFairCode
            );

            if (Fair == null)
            {
                return null;
            }

            var fairRegistration = await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .FirstOrDefaultAsync(r => r.Code == Fair.FairRegistrationCode);

            if (fairRegistration == null)
            {
                return null;
            }
            Fair.FillFairRegistrationInfo(fairRegistration);
            return Fair;
        }

        /// <summary>
        /// Retrieves a list of users filtered by their user type.
        /// </summary>
        /// <param name="id">The user type to filter by.</param>
        /// <returns>Returns a list of users that match the specified user type.</returns>
        public async Task<List<User>> GetUserFilteredAsync(UserType id)
        {
            return await _SystemContext.Users.Where(u => u.UserType == id).ToListAsync();
        }

        /// <summary>
        /// Adds a new user to the system based on the provided user creation details.
        /// </summary>
        /// <param name="userCreate">The details for the new user to be created.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the user creation operation.</returns>
        public async Task<string> AddUserAsync(UserCreate userCreate)
        {
            //ALL RETURN TYPES ARE ADJUSTED FOR DEMO PURPOSES
            //THIS IS NOT THE MAIN FUNCTIONALITY OF THE METHOD
            //IT SHOULD SEND THE MAIL ACCORDINGLY WHICH IS AGAIN
            //REMOVED SINCE FREE PLAN IS OVER FOR OUR MAIL API
            if (string.IsNullOrEmpty(userCreate.Name) || string.IsNullOrEmpty(userCreate.Username))
            {
                return "";
                //return ErrorTypes.InvalidUserName;
            }
            if (string.IsNullOrEmpty(userCreate.Mail))
            {
                return "";
                //return ErrorTypes.InvalidMail;
            }
            if (string.IsNullOrEmpty(userCreate.Surname))
            {
                return "";
                //return ErrorTypes.InvalidSurname;
            }

            string username = userCreate.Username;

            if (_SystemContext.Credentials.Any(c => c.Username == username))
            {
                return "";
                //return ErrorTypes.UserAlreadyExists;
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
            else if (userCreate.UserType == UserType.Coordinator)
            {
                newUser = new Coordinator(userCreate.Name, userCreate.Surname, userCreate.Mail)
                {
                    BilkentID = userCreate.BilkentID,
                    MajorCode = userCreate.MajorCode,
                    CurrentYear = userCreate.CurrentYear,
                    UserType = userCreate.UserType,
                };
            }
            else if (userCreate.UserType == UserType.Admin)
            {
                newUser = new Admin(userCreate.Name, userCreate.Surname, userCreate.Mail)
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
            return randomPassword;
            //return ErrorTypes.Success;
        }

        /// <summary>
        /// Updates the details of a specific user based on the provided user edit information.
        /// </summary>
        /// <param name="userEdit">The details to update for the user.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the update operation.</returns>
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

        /// <summary>
        /// Changes the responsible day for a user. This is the day the user is assigned to be responsible for.
        /// </summary>
        /// <param name="UID">The ID of the user to update.</param>
        /// <param name="day">The new responsible day for the user.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
        public async Task<ErrorTypes> ChangeResponsibleDayOfUser(int UID, DayOfWeek day)
        {
            if (UID < 0)
            {
                return ErrorTypes.InvalidUserName;
            }
            var user = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);
            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            user.ResponsibleDay = day;
            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Retrieves all tours for a specific user that they are responsible for, based on the user's responsible day.
        /// </summary>
        /// <param name="UID">The ID of the user whose responsible tours are to be fetched.</param>
        /// <returns>Returns a list of tours the user is responsible for, or an empty list if none are found.</returns>
        public async Task<List<Tour>> GetResponsibleToursOfUser(int UID)
        {
            if (UID < 0)
            {
                return new List<Tour>();
            }
            var user = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);
            if (user == null)
            {
                return new List<Tour>();
            }

            List<Tour> allTours = await _SystemContext.Tours.ToListAsync();

            List<Tour> responsibleTours = new List<Tour>();

            foreach (var tour in allTours)
            {
                TourRegistration? TourRegistration = await _SystemContext
                    .TourRegistrations.Include(r => r.School)
                    .Include(r => r.TimeBlock)
                    .FirstOrDefaultAsync(t => t.Code == tour.TourRegistrationCode);
                if (TourRegistration == null)
                {
                    continue;
                }
                if (TourRegistration.TimeBlock == null)
                {
                    continue;
                }
                if (TourRegistration.TimeBlock.Time.DayOfWeek != user.ResponsibleDay)
                {
                    continue;
                }
                tour.FillTourRegistrationInfo(TourRegistration);
                responsibleTours.Add(tour);
            }
            return responsibleTours;
        }

        /// <summary>
        /// Retrieves a list of advisors who are responsible for each day of the week.
        /// </summary>
        /// <returns>Returns a list of lists of users, where each sublist contains the advisors responsible for a particular day.</returns>
        public async Task<List<List<User>>> GetResponsibleAdvisors()
        {
            List<List<User>> responsibles = new List<List<User>>();

            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                var usersForDay = await _SystemContext
                    .Users.Where(u => u.ResponsibleDay == day && u.UserType == UserType.Advisor)
                    .ToListAsync();

                responsibles.Add(usersForDay);
            }

            return responsibles;
        }

        /// <summary>
        /// Adds work hours to a specific user's record.
        /// </summary>
        /// <param name="UID">The ID of the user to update.</param>
        /// <param name="hours">The number of work hours to add to the user's total.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
        public async Task<ErrorTypes> AddWorkHoursToUser(int UID, int hours)
        {
            if (UID < 0)
            {
                return ErrorTypes.InvalidUserName;
            }
            if (hours < 0)
            {
                return ErrorTypes.InvalidWorkHours;
            }
            var user = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);
            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            user.WorkHours += hours;

            await _SystemContext.SaveChangesAsync();
            return ErrorTypes.Success;
        }

        /// <summary>
        /// Deletes a user from the system based on their unique ID.
        /// </summary>
        /// <param name="id">The ID of the user to delete.</param>
        /// <returns>Returns true if the user was successfully deleted, false otherwise.</returns>
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

        /// <summary>
        /// Adds available hours for a guide user, preventing duplicates.
        /// </summary>
        /// <param name="UID">The ID of the guide user to update.</param>
        /// <param name="availability">The available hours to add to the guide's schedule.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
        public async Task<ErrorTypes> AddAvailableHoursToGuide(
            int UID,
            UserAvailableHours availability
        )
        {
            var user = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            var newDates = availability
                .AvailableHours.Where(d => !user.AvailableHours.Contains(d))
                .ToList();

            user.AvailableHours.AddRange(newDates);

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Removes specific available hours from a guide user's schedule.
        /// </summary>
        /// <param name="UID">The ID of the guide user to update.</param>
        /// <param name="availability">The available hours to remove from the guide's schedule.</param>
        /// <returns>Returns an ErrorTypes value indicating the success or failure of the operation.</returns>
        public async Task<ErrorTypes> RemoveAvailableHoursFromGuide(
            int UID,
            UserAvailableHours availability
        )
        {
            var user = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            user.AvailableHours.RemoveAll(d => availability.AvailableHours.Contains(d));

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Handles a user registration request, adding the user as pending until approved.
        /// </summary>
        /// <param name="request">The user registration request details.</param>
        /// <returns>Returns true if the registration was successfully added, false otherwise.</returns>
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

        /// <summary>
        /// Deletes a user registration request if the user is still pending.
        /// </summary>
        /// <param name="UID">The ID of the pending user to delete.</param>
        /// <returns>Returns true if the registration request was successfully deleted, false otherwise.</returns>
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

        /// <summary>
        /// Retrieves all majors from a predefined list of majors.
        /// </summary>
        /// <returns>Returns a list of all majors.</returns>
        public List<Major> GetAllMajors()
        {
            return Major.AllMajors;
        }

        /// <summary>
        /// Retrieves the number of concurrent tours allowed based on system settings.
        /// </summary>
        /// <returns>Returns the allowed concurrent tour count, or 2 if the setting is not found.</returns>
        public async Task<int> GetAllowedConcurrentTourCount()
        {
            var setting = await _SystemContext.Setting.FirstOrDefaultAsync();
            if (setting != null)
            {
                return setting.AllowedConcurrentTourCount;
            }
            return 2;
        }

        /// <summary>
        /// Generates a random password of a specified length.
        /// </summary>
        /// <param name="length">The desired length of the password.</param>
        /// <returns>Returns a randomly generated password.</returns>
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

        /// <summary>
        /// Retrieves a tour by its tour code, including the associated registration and time block information.
        /// </summary>
        /// <param name="tourCode">The code of the tour to retrieve.</param>
        /// <returns>Returns the tour if found, otherwise null.</returns>
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

        private async Task<IndividualTour?> GetIndividualTour(string tourCode)
        {
            IndividualTour? foundTour = await _SystemContext.IndividualTours.FirstOrDefaultAsync(
                t => t.IndividualTourRegistrationCode == tourCode
            );
            if (foundTour == null)
            {
                return null;
            }
            IndividualRegistration? TourRegistration = await _SystemContext
                .IndividualRegistrations.Include(r => r.TimeBlock)
                .FirstOrDefaultAsync(t => t.Code == tourCode);
            if (TourRegistration == null)
            {
                return null;
            }
            foundTour.FillTourRegistrationInfo(TourRegistration);
            return foundTour;
        }

        /// <summary>
        /// Generates a random survey code in the format Q-xxxx, where xxxx is a random number.
        /// </summary>
        /// <returns>Returns the generated survey code.</returns>
        private string GenerateSurveyCode()
        {
            var randomSuffix = new Random().Next(1000, 9999);
            return $"Q-{randomSuffix}";
        }
    }
}
