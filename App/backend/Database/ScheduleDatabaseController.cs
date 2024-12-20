using backend.Models;
using Microsoft.EntityFrameworkCore;

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
                _logger.LogError($"Can't find tour, tourID {fairID} does not exist.");
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
            }
            return false;
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

        public async Task<bool> AddSchedule(Schedule schedule)
        {
            try
            {
                if (await _context.Schedules.AnyAsync(s => s.ID == schedule.ID))
                {
                    _logger.LogError($"Can't add schedule, weekID {schedule.ID} already exist.");
                    return false;
                }
                await _context.Schedules.AddAsync(schedule);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in AddSchedule: {ex.Message}");
                return false;
            }
        }

        public async Task<Schedule?> GetScheduleAtWeek(int weekID)
        {
            try
            {
                return await _context.Schedules.SingleAsync(s => s.ID == weekID);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetScheduleAtWeek: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> UpdateSchedule(Schedule schedule)
        {
            if (!await _context.Schedules.AnyAsync(s => s.ID == schedule.ID))
            {
                return false;
            }

            _context.Schedules.Attach(schedule);
            _context.Entry(schedule).State = EntityState.Modified;
            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in UpdateSchedule: {ex.Message}");
            }
            return false;
        }

        public async Task<Tour[]> GetScheduledTours(Schedule schedule, TimeBlock timeBlock)
        {
            int[] ScheduledTourIDs = [.. timeBlock.ScheduledTours.Values];

            return await _context.Tours.Where(t => ScheduledTourIDs.Contains(t.ID)).ToArrayAsync();
        }

        public async Task<Tour[]> GetAlternativeTours(Schedule schedule, TimeBlock timeBlock)
        {
            int[] ScheduledTourIDs = [.. timeBlock.AlternativeTours.Values];

            return await _context.Tours.Where(t => ScheduledTourIDs.Contains(t.ID)).ToArrayAsync();
        }
    }
}
