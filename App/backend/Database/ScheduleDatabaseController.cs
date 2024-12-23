/// <summary>
/// This file contains the implementation of the ScheduleDatabaseController class, which manages the operations 
/// related to tours, fairs, and guide assignments in the system. It provides methods to:
/// 
/// - Manage and manipulate tours, including adding, removing, and updating tour information, as well as assigning and changing guides for tours.
/// - Handle fairs, including adding and removing guides for fairs, updating fair information, and retrieving available fairs.
/// - Retrieve and manage guide assignments for both tours and fairs, ensuring that guides are available based on event schedules.
/// - End a tour, which involves removing all associated records, including tours, registrations, and guide applications, from the database.
/// 
/// The controller interacts with the system's database through Entity Framework, utilizing asynchronous methods for retrieving and manipulating data.
/// It ensures proper logging of operations and handles exceptions effectively, providing error codes for various scenarios.
/// </summary>
using System.Reflection.Metadata.Ecma335;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    /// <summary>
    /// Class responsible for managing the scheduling operations related to tours, including adding, removing, updating, 
    /// and assigning guides to tours. It interacts with the SystemDbContext to perform CRUD operations on tours and 
    /// their related data. The class also handles error logging and validation during these operations.
    /// </summary>
    public class ScheduleDatabaseController
    {
        private readonly SystemDbContext _SystemContext;
        private readonly ILogger _logger;

        
        /// <summary>
        /// Constructor to initialize the controller with the database context and logger.
        /// </summary>
        /// <param name="systemDbContext">The database context for interacting with the database.</param>
        /// <param name="loggerFactory">The logger factory used to create a logger for error logging.</param>
        public ScheduleDatabaseController(
            SystemDbContext systemDbContext,
            ILoggerFactory loggerFactory
        )
        {
            _SystemContext = systemDbContext;
            _logger = loggerFactory.CreateLogger("SystemDatabaseController");
        }

        /// <summary>
        /// Removes a tour from the database based on the provided tour code.
        /// Logs an error if the tour does not exist or if an exception occurs during removal.
        /// </summary>
        /// <param name="tourCode">The registration code of the tour to be removed.</param>
        /// <returns>True if the tour is successfully removed, otherwise false.</returns>
        public async Task<bool> RemoveTour(string tourCode)
        {
            try
            {
                Tour? tourToRemove = await _SystemContext.Tours.FirstOrDefaultAsync(t =>
                    t.TourRegistrationCode == tourCode
                );
                if (tourToRemove == null)
                {
                    _logger.LogError(
                        $"Can't remove tour, tour with code {tourCode} does not exist."
                    );
                    return false;
                }
                _SystemContext.Tours.Remove(tourToRemove);
                await _SystemContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in RemoveTour: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Retrieves a tour from the database using the provided tour code.
        /// If the tour is found, it fills in related registration information.
        /// </summary>
        /// <param name="tourCode">The registration code of the tour to be retrieved.</param>
        /// <returns>The found tour or null if no tour is found with the given code.</returns>
        public async Task<Tour?> GetTour(string tourCode)
        {
            if (string.IsNullOrEmpty(tourCode))
            {
                return null;
            }
            Tour? foundTour = await _SystemContext.Tours.FirstOrDefaultAsync(t =>
                t.TourRegistrationCode == tourCode
            );
            if (foundTour == null)
            {
                _logger.LogError($"Can't get tour, tour with code {tourCode} does not exist.");
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

        //TODO Rework

        /// <summary>
        /// Updates the information of an existing tour in the database.
        /// </summary>
        /// <param name="tour">The tour object containing updated information.</param>
        /// <returns>True if the update is successful, otherwise false.</returns>
        public async Task<bool> UpdateTourInfo(Tour tour)
        {
            if (
                !await _SystemContext.Tours.AnyAsync(t =>
                    t.TourRegistrationCode == tour.TourRegistrationCode
                )
            )
            {
                return false;
            }

            _SystemContext.Tours.Attach(tour);
            _SystemContext.Entry(tour).State = EntityState.Modified;

            try
            {
                return (await _SystemContext.SaveChangesAsync() > 0);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateFairInfo: {ex.Message}");
            }
            return false;
        }

        /// <summary>
        /// Removes a guide from the tour by setting the assigned guide ID to null.
        /// </summary>
        /// <param name="TourCode">The code of the tour from which the guide should be removed.</param>
        /// <returns>Success or failure based on the removal process.</returns>
        public async Task<ErrorTypes> RemoveGuideFromTour(string TourCode)
        {
            if (string.IsNullOrEmpty(TourCode))
            {
                return ErrorTypes.InvalidTourCode;
            }

            Tour? Tour = await _SystemContext.Tours.SingleOrDefaultAsync(t =>
                t.TourRegistrationCode == TourCode
            );

            if (Tour == null)
            {
                return ErrorTypes.TourNotFound;
            }
            if (Tour.AssignedGuideID == null)
            {
                return ErrorTypes.UserNotFound;
            }

            var user = await _SystemContext.Users.FirstOrDefaultAsync(u =>
                u.ID == Tour.AssignedGuideID
            );

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            user.AssignedTourCode = null;
            Tour.RemoveGuide();

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Changes the guide of an existing tour to a new guide by updating the assigned guide ID.
        /// </summary>
        /// <param name="TourCode">The code of the tour to which a new guide should be assigned.</param>
        /// <param name="newGuideUID">The unique ID of the new guide to be assigned to the tour.</param>
        /// <returns>Success or failure based on the guide assignment process.</returns>
        public async Task<ErrorTypes> ChangeGuideOfTour(string TourCode, int newGuideUID)
        {
            if (string.IsNullOrEmpty(TourCode))
            {
                return ErrorTypes.InvalidTourCode;
            }

            if (newGuideUID < 0)
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

            if (Tour.AssignedGuideID != null)
            {
                User? pastUser = await _SystemContext.Users.SingleOrDefaultAsync(u =>
                    u.ID == Tour.AssignedGuideID
                );

                if (pastUser != null)
                {
                    pastUser.AssignedTourCode = null;
                }
            }
            User? user = await _SystemContext.Users.SingleOrDefaultAsync(u => u.ID == newGuideUID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            User foundGuide = user;

            Tour.AssignGuide(foundGuide);

            user.AssignedTourCode = Tour.TourRegistrationCode;

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

         /// <summary>
        /// Retrieves a list of all tours from the database, including their associated registration information.
        /// If a tour is missing its registration details, it is excluded from the list.
        /// </summary>
        /// <returns>A list of all tours with registration information filled in.</returns>
        public async Task<List<Tour>> GetAllTours()
        {
            try
            {
                var allTours = await _SystemContext.Tours.ToListAsync();
                for (int i = allTours.Count - 1; i >= 0; i--)
                {
                    var tour = allTours[i];

                    var tourRegistration = await _SystemContext
                        .TourRegistrations.Include(r => r.School)
                        .Include(r => r.TimeBlock)
                        .FirstOrDefaultAsync(r => r.Code == tour.TourRegistrationCode);

                    if (tourRegistration == null)
                    {
                        allTours.RemoveAt(i);
                    }
                    else
                    {
                        tour.FillTourRegistrationInfo(tourRegistration);
                    }
                }
                return allTours;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllTours: {ex.Message}");
                return [];
            }
        }

        /// <summary>
        /// Retrieves a list of all available tours from the database, ensuring they are unassigned and accepted.
        /// Tours that are already assigned a guide or are not accepted are excluded.
        /// </summary>
        /// <returns>A list of available tours.</returns>
        public async Task<List<Tour>> GetAllAvailableTours()
        {
            try
            {
                var allTours = await _SystemContext.Tours.ToListAsync();
                for (int i = allTours.Count - 1; i >= 0; i--)
                {
                    var tour = allTours[i];
                    var tourRegistration = await _SystemContext
                        .TourRegistrations.Include(r => r.School)
                        .Include(r => r.TimeBlock)
                        .FirstOrDefaultAsync(r => r.Code == tour.TourRegistrationCode);

                    if (tourRegistration == null)
                    {
                        allTours.RemoveAt(i);
                        continue;
                    }
                    else
                    {
                        tour.FillTourRegistrationInfo(tourRegistration);
                    }

                    if (
                        tour.HasGuide()
                        || tour.TourRegistirationInfo == null
                        || tour.TourRegistirationInfo.State != RegistrationState.Accepted
                    )
                    {
                        allTours.RemoveAt(i);
                        continue;
                    }
                }
                return allTours;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllTours: {ex.Message}");
                return [];
            }
        }

        /// <summary>
        /// Removes a fair from the database based on the provided fair code.
        /// Logs an error if the fair does not exist or if an exception occurs during removal.
        /// </summary>
        /// <param name="fairCode">The registration code of the fair to be removed.</param>
        /// <returns>True if the fair is successfully removed, otherwise false.</returns>
        public async Task<bool> RemoveFair(string fairCode)
        {
            try
            {
                Fair? fairToRemove = await _SystemContext.Fairs.FirstOrDefaultAsync(f =>
                    f.FairRegistrationCode == fairCode
                );
                if (fairToRemove == null)
                {
                    _logger.LogError(
                        $"Can't remove fair, fair with code {fairCode} does not exist."
                    );
                    return false;
                }
                _SystemContext.Fairs.Remove(fairToRemove);
                await _SystemContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in RemoveFair: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Retrieves a fair from the database based on the provided fair code and populates its related registration information.
        /// </summary>
        /// <param name="fairCode">The registration code of the fair to be retrieved.</param>
        /// <returns>The found fair with its registration information or null if the fair is not found.</returns>
        public async Task<Fair?> GetFair(string fairCode)
        {
            Fair? foundFair = await _SystemContext.Fairs.FirstOrDefaultAsync(f =>
                f.FairRegistrationCode == fairCode
            );
            if (foundFair == null)
            {
                _logger.LogError($"Can't find fair, fair with code {fairCode} does not exist.");
                return null;
            }
            FairRegistration? FairRegistration = await _SystemContext
                .FairRegistrations.Include(r => r.School)
                .FirstOrDefaultAsync(t => t.Code == fairCode);
            if (FairRegistration == null)
            {
                return null;
            }
            foundFair.FillFairRegistrationInfo(FairRegistration);
            return foundFair;
        }

        //TODO Rework

        /// <summary>
        /// Updates the information of an existing fair in the database.
        /// </summary>
        /// <param name="fair">The fair object containing updated information.</param>
        /// <returns>True if the fair information was successfully updated, otherwise false.</returns>
        public async Task<bool> UpdateFairInfo(Fair fair)
        {
            if (
                !await _SystemContext.Fairs.AnyAsync(f =>
                    f.FairRegistrationCode == fair.FairRegistrationCode
                )
            )
            {
                return false;
            }

            _SystemContext.Fairs.Attach(fair);
            _SystemContext.Entry(fair).State = EntityState.Modified;

            try
            {
                return await _SystemContext.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateFairInfo: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Adds a guide to a fair, ensuring that the fair exists, the guide is valid, and no other guide is already assigned.
        /// If the guide is already assigned to another tour, that assignment is cleared before adding the guide to the fair.
        /// </summary>
        /// <param name="FairCode">The registration code of the fair to which the guide will be added.</param>
        /// <param name="newGuideUID">The user ID of the guide to be added.</param>
        /// <returns>An error type indicating success or the reason for failure.</returns>
        public async Task<ErrorTypes> AddGuideToFair(string FairCode, int newGuideUID)
        {
            if (string.IsNullOrEmpty(FairCode))
            {
                return ErrorTypes.InvalidTourCode;
            }

            if (newGuideUID < 0)
            {
                return ErrorTypes.InvalidUserID;
            }

            Fair? Fair = await _SystemContext.Fairs.SingleOrDefaultAsync(t =>
                t.FairRegistrationCode == FairCode
            );

            if (Fair == null)
            {
                return ErrorTypes.FairNotFound;
            }

            User? user = await _SystemContext.Users.SingleOrDefaultAsync(u => u.ID == newGuideUID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            bool AddResult = Fair.AddGuide(user);
            if (!AddResult)
            {
                return ErrorTypes.GuideAlreadyAddedToFair;
            }
            user.AssignedFairCode = Fair.FairRegistrationCode;
            if (user.AssignedTourCode != null)
            {
                Tour? Tour = await _SystemContext.Tours.SingleOrDefaultAsync(t =>
                    t.TourRegistrationCode == user.AssignedTourCode
                );
                if (Tour != null)
                {
                    Tour.RemoveGuide();
                }
                user.AssignedTourCode = null;
            }
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Removes a guide from a fair, ensuring that the fair and the guide exist.
        /// If the guide is not assigned to the fair, the operation fails.
        /// </summary>
        /// <param name="FairCode">The registration code of the fair from which the guide will be removed.</param>
        /// <param name="newGuideUID">The user ID of the guide to be removed.</param>
        /// <returns>An error type indicating success or the reason for failure.</returns>
        public async Task<ErrorTypes> RemoveGuideFromFair(string FairCode, int newGuideUID)
        {
            if (string.IsNullOrEmpty(FairCode))
            {
                return ErrorTypes.InvalidFairCode;
            }

            Fair? Fair = await _SystemContext.Fairs.SingleOrDefaultAsync(t =>
                t.FairRegistrationCode == FairCode
            );

            if (Fair == null)
            {
                return ErrorTypes.FairNotFound;
            }
            bool isRemoved = Fair.RemoveGuide(newGuideUID);

            if (!isRemoved)
            {
                return ErrorTypes.FairDoesNotHaveTheSpecifiedGuide;
            }
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

        /// <summary>
        /// Retrieves all guides assigned to a specific fair based on the fair's registration code.
        /// Returns an empty list if the fair has no guides or does not exist.
        /// </summary>
        /// <param name="FairCode">The registration code of the fair whose guides are being retrieved.</param>
        /// <returns>A list of users (guides) assigned to the fair.</returns>
        public async Task<List<User>> GetAllGuidesOfFair(string FairCode)
        {
            if (string.IsNullOrEmpty(FairCode))
            {
                return new List<User>();
            }

            Fair? Fair = await _SystemContext.Fairs.SingleOrDefaultAsync(t =>
                t.FairRegistrationCode == FairCode
            );

            if (Fair == null || Fair.AssignedGuideIDs == null)
            {
                return new List<User>();
            }

            List<User> result = new List<User>();

            foreach (var guideUID in Fair.AssignedGuideIDs)
            {
                var User = await _SystemContext.Users.SingleOrDefaultAsync(c => c.ID == guideUID);
                if (User == null)
                {
                    continue;
                }
                result.Add(User);
            }
            return result;
        }

        /// <summary>
        /// Retrieves all fairs from the database, including their associated registration details.
        /// Excludes any fairs missing registration information.
        /// </summary>
        /// <returns>A list of all fairs with their registration information filled in.</returns>
        public async Task<List<Fair>> GetAllFairs()
        {
            try
            {
                var allFairs = await _SystemContext.Fairs.ToListAsync();
                for (int i = allFairs.Count - 1; i >= 0; i--)
                {
                    var fair = allFairs[i];

                    var fairRegistration = await _SystemContext
                        .FairRegistrations.Include(r => r.School)
                        .FirstOrDefaultAsync(r => r.Code == fair.FairRegistrationCode);

                    if (fairRegistration == null)
                    {
                        allFairs.RemoveAt(i);
                    }
                    else
                    {
                        fair.FillFairRegistrationInfo(fairRegistration);
                    }
                }
                return allFairs;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllTours: {ex.Message}");
                return [];
            }
        }

        /// <summary>
        /// Retrieves all fairs that are available, ensuring the fair has a valid registration and its state is accepted.
        /// </summary>
        /// <returns>A list of available fairs, excluding those with invalid or unaccepted registration states.</returns>
        public async Task<List<Fair>> GetAllAvailableFairs()
        {
            try
            {
                var allFairs = await _SystemContext.Fairs.ToListAsync();

                for (int i = allFairs.Count - 1; i >= 0; i--)
                {
                    var fair = allFairs[i];

                    var fairRegistration = await _SystemContext
                        .FairRegistrations.Include(r => r.School)
                        .FirstOrDefaultAsync(r => r.Code == fair.FairRegistrationCode);

                    if (fairRegistration == null)
                    {
                        allFairs.RemoveAt(i);
                    }
                    else
                    {
                        fair.FillFairRegistrationInfo(fairRegistration);
                    }

                    if (
                        fair.FairRegistirationInfo == null
                        || fair.FairRegistirationInfo.State != RegistrationState.Accepted
                    )
                    {
                        allFairs.RemoveAt(i);
                        continue;
                    }
                }
                return allFairs;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllFairs: {ex.Message}");
                return [];
            }
        }

        /// <summary>
        /// Retrieves all available guides for a specific event based on the event code, which could refer to a tour, fair, or individual registration.
        /// The function filters guides based on the event time and their available hours.
        /// </summary>
        /// <param name="eventCode">The registration code of the event (Tour, Fair, or Individual) for which guides are being retrieved.</param>
        /// <returns>A list of guides who are available at the specific time of the event.</returns>
        public async Task<List<User>> GetAllAvailableGuides(string eventCode)
        {
            try
            {
                if (string.IsNullOrEmpty(eventCode))
                {
                    return new List<User>();
                }
                Registration? registration;
                var type = eventCode[0];
                switch (type)
                {
                    case 'T':
                        registration = await _SystemContext
                            .TourRegistrations.Include(r => r.School)
                            .Include(r => r.TimeBlock)
                            .SingleOrDefaultAsync(r => r.Code == eventCode);
                        break;
                    case 'F':
                        registration = await _SystemContext
                            .FairRegistrations.Include(r => r.School)
                            .SingleOrDefaultAsync(r => r.Code == eventCode);
                        break;
                    case 'I':
                        registration = await _SystemContext
                            .IndividualRegistrations.Include(r => r.PreferredVisitTime)
                            .SingleOrDefaultAsync(r => r.Code == eventCode);
                        break;
                    default:
                        registration = null;
                        break;
                }
                if (registration == null)
                {
                    return new List<User>();
                }

                DateTime time = registration.Time;

                var users = await _SystemContext
                    .Users.Where(u => u.UserType == UserType.Guide)
                    .ToListAsync();

                List<User> availableGuides = new List<User>();
                foreach (var user in users)
                {
                    if (user.AvailableHours.Contains(time))
                    {
                        availableGuides.Add(user);
                    }
                }
                return availableGuides;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllAvailableGuides: {ex.Message}");
                return [];
            }
        }

        /// <summary>
        /// Ends a tour by removing the associated tour registrations, tours, and guide applications from the database.
        /// Logs the tour data before removal.
        /// </summary>
        /// <param name="tourCode">The registration code of the tour to be ended.</param>
        /// <returns>An error type indicating success or failure.</returns>
        public async Task<ErrorTypes> EndTour(string tourCode)
        {
            var tourRegistrations = await _SystemContext
                .TourRegistrations.Where(r => r.Code == tourCode)
                .ToListAsync();

            if (tourRegistrations.Any())
            {
                _SystemContext.TourRegistrations.RemoveRange(tourRegistrations);
            }
            var tours = await _SystemContext
                .Tours.Where(t => t.TourRegistrationCode == tourCode)
                .ToListAsync();

            if (tours.Any())
            {
                _SystemContext.Tours.RemoveRange(tours);
            }

            var guideTourApplications = await _SystemContext
                .GuideTourApplication.Where(a =>
                    tours.Any(t => t.TourRegistrationCode == a.TourCode)
                )
                .ToListAsync();

            if (guideTourApplications.Any())
            {
                _SystemContext.GuideTourApplication.RemoveRange(guideTourApplications);
            }
            foreach (var tour in tours)
            {
                await DataLogger.LogTour(_SystemContext, tour);
            }
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }
    }
}
