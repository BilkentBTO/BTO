using backend.Models;
using Microsoft.EntityFrameworkCore;
using BTO.Constrains;

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

        public async Task<bool> AddTour(Tour tour)
        {
            try
            {
                if (await _context.Tours.AnyAsync(t => t.ID == tour.ID))
                {
                    _logger.LogError($"Can't add tour, tourID {tour.ID} already exist.");
                    return false;
                }

                await _context.Tours.AddAsync(tour);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddTour: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveTour(int tourID)
        {
            try
            {
                Tour? tourToRemove = await _context.Tours.FirstOrDefaultAsync(t => t.ID == tourID);
                if (tourToRemove == null)
                {
                    _logger.LogError($"Can't remove tour, tourID {tourID} does not exist.");
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

        public async Task<Tour?> GetTour(int tourID)
        {
            Tour? foundTour = await _context.Tours.FirstOrDefaultAsync(t => t.ID == tourID);
            if (foundTour == null)
            {
                _logger.LogError($"Can't find tour, tourID {tourID} does not exist.");
            }
            return foundTour;
        }

        public async Task<bool> UpdateTourInfo(Tour tour)
        {
            if (!await _context.Tours.AnyAsync(t => t.ID == tour.ID))
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

        public async Task<Tour[]> GetAllTours()
        {
            try
            {
                return await _context.Tours.ToArrayAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GeAllTours: {ex.Message}");
                return [];
            }
        }

        public async Task<bool> AddFair(Fair fair)
        {
            try
            {
                if (await _context.Fairs.AnyAsync(f => f.ID == fair.ID))
                {
                    _logger.LogError($"Can't add fair, fairID {fair.ID} already exist.");
                    return false;
                }
                await _context.Fairs.AddAsync(fair);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddFair: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveFair(int fairID)
        {
            try
            {
                Fair? fairToRemove = await _context.Fairs.FirstOrDefaultAsync(f => f.ID == fairID);
                if (fairToRemove == null)
                {
                    _logger.LogError($"Can't remove fair, fairID {fairID} does not exist.");
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

        public async Task<Fair?> GetFair(int fairID)
        {
            Fair? foundFair = await _context.Fairs.FirstOrDefaultAsync(t => t.ID == fairID);
            if (foundFair == null)
            {
                _logger.LogError($"Can't find fair, fairID {fairID} does not exist.");
            }
            return foundFair;
        }

        public async Task<bool> UpdateFairInfo(Fair fair)
        {
            if (!await _context.Fairs.AnyAsync(f => f.ID == fair.ID))
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

        public async Task<Fair[]> GetAllFairs()
        {
            try
            {
                return await _context.Fairs.ToArrayAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GeAllFairs: {ex.Message}");
                return [];
            }
        }

        public async Task<bool> AddTimeBlock(TimeBlock tb)
        {
            try
            {
                if (await _context.Schedule.AnyAsync(t => t.ID == tb.ID))
                {
                    _logger.LogError($"Can't add timeblock, time block, timeID {tb.ID} already exist.");
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
        public async Task<bool> TimeBlockExists(int timeID)
        {
            try
            {
                return await _context.Schedule.AnyAsync(t => t.ID == timeID);
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
        public async Task<TimeBlock?> GetTimeBlock(int timeID)
        {
            TimeBlock? foundTB = await _context.Schedule.FirstOrDefaultAsync(t => t.ID == timeID);
            if (foundTB == null)
            {
                _logger.LogError($"Can't find time block, timeID {timeID} does not exist.");
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
    }
}
