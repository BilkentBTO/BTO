using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class ScheduleDatabaseController
    {
        private readonly SystemDbContext _SystemContext;
        private readonly ILogger _logger;

        public ScheduleDatabaseController(
            SystemDbContext systemDbContext,
            ILoggerFactory loggerFactory
        )
        {
            _SystemContext = systemDbContext;
            _logger = loggerFactory.CreateLogger("SystemDatabaseController");
        }

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

            Tour.RemoveGuide();

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

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

            User? user = await _SystemContext.Users.SingleOrDefaultAsync(u => u.ID == newGuideUID);

            if (user == null)
            {
                return ErrorTypes.UserNotFound;
            }

            User foundGuide = user;

            Tour.AssignGuide(foundGuide);

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

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

        public async Task<bool> AddFair(string fairCode)
        {
            try
            {
                if (await _SystemContext.Fairs.AnyAsync(f => f.FairRegistrationCode == fairCode))
                {
                    _logger.LogError($"Can't add fair, fair with code {fairCode} already exist.");
                    return false;
                }
                bool fairRegistrationExists = await _SystemContext.FairRegistrations.AnyAsync(f =>
                    f.Code == fairCode
                );
                if (!fairRegistrationExists)
                {
                    return false;
                }
                FairRegistration? FairRegistration =
                    await _SystemContext.FairRegistrations.FirstOrDefaultAsync(f =>
                        f.Code == fairCode
                    );

                if (FairRegistration == null)
                {
                    return false;
                }
                if (FairRegistration.School == null)
                {
                    return false;
                }

                Fair newFair = new Fair
                {
                    FairRegistrationCode = fairCode,
                    FairRegistirationInfo = FairRegistration,
                };

                await _SystemContext.Fairs.AddAsync(newFair);
                await _SystemContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddFair: {ex.Message}");
                return false;
            }
        }

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
            return foundFair;
        }

        //TODO Rework
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

            User foundGuide = user;

            Fair.AddGuide(foundGuide);
            foundGuide.AssignedFairCode = Fair.FairRegistrationCode;

            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }

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
    }
}
