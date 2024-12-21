using backend.Models;
using BTO.Constrains;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Database
{
    public class ScheduleDatabaseController
    {
        private readonly SystemDbContext _context;
        private readonly ILogger _logger;

        public ScheduleDatabaseController(SystemDbContext context, ILoggerFactory loggerFactory)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("SystemDatabaseController");
        }

        public async Task<bool> AddTour(string tourCode)
        {
            try
            {
                if (await _context.Tours.AnyAsync(t => t.TourRegistrationCode == tourCode))
                {
                    _logger.LogError($"Can't add tour, tour with code {tourCode} already exist.");
                    return false;
                }
                bool tourRegistrationExists = await _context.TourRegistrations.AnyAsync(t =>
                    t.Code == tourCode
                );
                if (!tourRegistrationExists)
                {
                    return false;
                }
                TourRegistration? TourRegistration = await _context
                    .TourRegistrations.Include(r => r.School)
                    .Include(r => r.PreferredVisitTime)
                    .FirstOrDefaultAsync(t => t.Code == tourCode);

                if (TourRegistration == null)
                {
                    return false;
                }
                if (TourRegistration.School == null)
                {
                    return false;
                }

                Tour newTour = new Tour
                {
                    TourRegistrationCode = tourCode,
                    TourRegistirationInfo = TourRegistration,
                    Priority = TourRegistration.School.Priority,
                };

                await _context.Tours.AddAsync(newTour);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddTour: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveTour(string tourCode)
        {
            try
            {
                Tour? tourToRemove = await _context.Tours.FirstOrDefaultAsync(t =>
                    t.TourRegistrationCode == tourCode
                );
                if (tourToRemove == null)
                {
                    _logger.LogError(
                        $"Can't remove tour, tour with code {tourCode} does not exist."
                    );
                    return false;
                }
                _context.Tours.Remove(tourToRemove);
                await _context.SaveChangesAsync();
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
            Tour? foundTour = await _context.Tours.FirstOrDefaultAsync(t =>
                t.TourRegistrationCode == tourCode
            );
            if (foundTour == null)
            {
                _logger.LogError($"Can't get tour, tour with code {tourCode} does not exist.");
                return null;
            }
            TourRegistration? TourRegistration = await _context
                .TourRegistrations.Include(r => r.School)
                .Include(r => r.PreferredVisitTime)
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
                !await _context.Tours.AnyAsync(t =>
                    t.TourRegistrationCode == tour.TourRegistrationCode
                )
            )
            {
                return false;
            }

            _context.Tours.Attach(tour);
            _context.Entry(tour).State = EntityState.Modified;

            try
            {
                return (await _context.SaveChangesAsync() > 0);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateFairInfo: {ex.Message}");
            }
            return false;
        }

        public async Task<List<Tour>> GetAllTours()
        {
            try
            {
                var allTours = await _context.Tours.ToListAsync();
                for (int i = allTours.Count - 1; i >= 0; i--)
                {
                    var tour = allTours[i];

                    var tourRegistration = await _context
                        .TourRegistrations.Include(r => r.School)
                        .Include(r => r.PreferredVisitTime)
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

        public async Task<bool> AddFair(string fairCode)
        {
            try
            {
                if (await _context.Fairs.AnyAsync(f => f.FairRegistrationCode == fairCode))
                {
                    _logger.LogError($"Can't add fair, fair with code {fairCode} already exist.");
                    return false;
                }
                bool fairRegistrationExists = await _context.FairRegistrations.AnyAsync(f =>
                    f.Code == fairCode
                );
                if (!fairRegistrationExists)
                {
                    return false;
                }
                FairRegistration? FairRegistration =
                    await _context.FairRegistrations.FirstOrDefaultAsync(f => f.Code == fairCode);

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

                await _context.Fairs.AddAsync(newFair);
                await _context.SaveChangesAsync();
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
                Fair? fairToRemove = await _context.Fairs.FirstOrDefaultAsync(f =>
                    f.FairRegistrationCode == fairCode
                );
                if (fairToRemove == null)
                {
                    _logger.LogError(
                        $"Can't remove fair, fair with code {fairCode} does not exist."
                    );
                    return false;
                }
                _context.Fairs.Remove(fairToRemove);
                await _context.SaveChangesAsync();
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
            Fair? foundFair = await _context.Fairs.FirstOrDefaultAsync(f =>
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
                !await _context.Fairs.AnyAsync(f =>
                    f.FairRegistrationCode == fair.FairRegistrationCode
                )
            )
            {
                return false;
            }

            _context.Fairs.Attach(fair);
            _context.Entry(fair).State = EntityState.Modified;

            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateFairInfo: {ex.Message}");
                return false;
            }
        }

        public async Task<List<Fair>> GetAllFairs()
        {
            try
            {
                var allFairs = await _context.Fairs.ToListAsync();
                for (int i = allFairs.Count - 1; i >= 0; i--)
                {
                    var fair = allFairs[i];

                    var fairRegistration = await _context
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

        public async Task<bool> AddTimeBlock(TimeBlock tb)
        {
            try
            {
                if (await _context.Schedule.AnyAsync(t => t.ID == tb.ID))
                {
                    _logger.LogError(
                        $"Can't add timeblock, time block, timeID {tb.ID} already exist."
                    );
                    return false;
                }
                await _context.Schedule.AddAsync(tb);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddTimeBlock: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> TimeBlockExists(int timeBlockID)
        {
            try
            {
                return await _context.Schedule.AnyAsync(t => t.ID == timeBlockID);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddTimeBlock: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> TimeBlockExists(DateTime day, int timeBlockIndex)
        {
            if (timeBlockIndex < 0 || timeBlockIndex >= TimeConstrains.TimeBlocksPerDay)
                return false;
            day = new DateTime(day.Year, day.Month, day.Day);
            return await TimeBlockExists(TimeBlock.GetID(day, timeBlockIndex));
        }

        public async Task<TimeBlock?> GetTimeBlock(int timeBlockID)
        {
            TimeBlock? foundTB = await _context.Schedule.FirstOrDefaultAsync(t => t.ID == timeBlockID);
            if (foundTB == null)
            {
                _logger.LogError($"Can't find time block, timeID {timeBlockID} does not exist.");
            }
            return foundTB;
        }

        public async Task<TimeBlock?> GetTimeBlock(DateTime day, int timeBlockIndex)
        {
            if (timeBlockIndex < 0 || timeBlockIndex >= TimeConstrains.TimeBlocksPerDay)
                return null;
            day = new DateTime(day.Year, day.Month, day.Day);
            return await GetTimeBlock(TimeBlock.GetID(day, timeBlockIndex));
        }
        public async Task<bool> UpdateTimeBlock(TimeBlock timeBlock)
        {
            if (!await _context.Schedule.AnyAsync(t => t.ID == timeBlock.ID))
            {
                return false;
            }

            _context.Schedule.Attach(timeBlock);
            _context.Entry(timeBlock).State = EntityState.Modified;

            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateTimeBlock: {ex.Message}");
                return false;
            }
        }

        public async Task<Tour[]> GetScheduledTours(int timeBlockID)
        {
            TimeBlock? timeBlock = await GetTimeBlock(timeBlockID);
            if (timeBlock == null)
            {
                _logger.LogError("Cannot find timeblock.");
                return [];
            }
            KeyValuePair<string, int>[] tourCodes = [.. timeBlock.ScheduledTours];
            Tour[] tours = new Tour[tourCodes.Length];
            for (int i = 0; i < tourCodes.Length; i++)
            {
                Tour? tour = await GetTour(tourCodes[i].Key);
                if (tour == null)
                {
                    _logger.LogError("Cannot find tour.");
                    return [];
                }
                tours[i] = tour;
            }
            return tours;
        }
        public async Task<Tour[]> GetAlternativeTours(int timeBlockID)
        {
            TimeBlock? timeBlock = await GetTimeBlock(timeBlockID);
            if (timeBlock == null)
            {
                _logger.LogError("Cannot find timeblock.");
                return [];
            }
            KeyValuePair<string, int>[] tourCodes = [.. timeBlock.AlternativeTours];
            Tour[] tours = new Tour[tourCodes.Length];
            for (int i = 0; i < tourCodes.Length; i++)
            {
                Tour? tour = await GetTour(tourCodes[i].Key);
                if (tour == null)
                {
                    _logger.LogError("Cannot find tour.");
                    return [];
                }
                tours[i] = tour;
            }
            return tours;
        }
        public async Task<List<TourRegistirationRequest>> GetAllTourRegistirationRequests()
        {
            try
            {
                return await _context.TourRegistirationRequests.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllTours: {ex.Message}");
                return [];
            }
        }
        public async Task<List<TourRegistirationRequest>> GetTourRegistirationRequestsOf(int timeBlockID)
        {
            try
            {
                List<TourRegistirationRequest> requests = await _context.TourRegistirationRequests.ToListAsync();
                return requests.Where(r => r.TimeBlockID == timeBlockID).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAllTours: {ex.Message}");
                return [];
            }
        }
        public async Task<bool> RequestTour(int timeBlockID, Tour tour)
        {
            TimeBlock? timeBlock = await GetTimeBlock(timeBlockID);
            if (timeBlock == null)
            {
                _logger.LogError("Cannot find timeblock.");
                return false;
            }
            TourRegistirationRequest? regReq = timeBlock.RequestTour(tour);
            if(regReq != null)
            {
                await _context.TourRegistirationRequests.AddAsync(regReq);
                await _context.SaveChangesAsync();
                return await UpdateTimeBlock(timeBlock);
            }
            return true;
        }
        public async Task<bool> AcceptAlternativeTour(int timeBlockID, string scheduledTourCode, string alternativeTourCode)
        {
            TimeBlock? timeBlock = await GetTimeBlock(timeBlockID);
            if(timeBlock == null)
            {
                _logger.LogError("Cannot find timeblock.");
                return false;
            }
            Tour? alternativeTour = await GetTour(alternativeTourCode), ScheduledTour = await GetTour(scheduledTourCode);
            if(alternativeTour == null || ScheduledTour == null)
            {
                _logger.LogError("Cannot find tour.");
                return false;
            }

            if (!timeBlock.AcceptTour(ScheduledTour, alternativeTour))
                return false;

            return await UpdateTimeBlock(timeBlock);
        }

        public async Task<bool> AcceptTour(int timeBlockID, string tourCode)
        {
            TimeBlock? timeBlock = await GetTimeBlock(timeBlockID);
            if (timeBlock == null)
            {
                _logger.LogError("Cannot find timeblock.");
                return false;
            }
            Tour? tour = await GetTour(tourCode);
            if (tour == null)
            {
                _logger.LogError("Cannot find tour.");
                return true;
            }
            timeBlock.AcceptTour(tour);
            return await UpdateTimeBlock(timeBlock);
        }
        public async Task<bool> RemoveTour(int timeBlockID, string tourCode)
        {
            TimeBlock? timeBlock = await GetTimeBlock(timeBlockID);
            if (timeBlock == null)
            {
                _logger.LogError("Cannot find timeblock.");
                return false;
            }
            Tour? tour = await GetTour(tourCode);
            if (tour == null)
            {
                _logger.LogError("Cannot find tour.");
                return true;
            }
            timeBlock.RemoveTour(tour);
            return await UpdateTimeBlock(timeBlock);
        }
    }
}
