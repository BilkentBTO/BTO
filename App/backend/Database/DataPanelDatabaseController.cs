using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Database
{
    public static class DataLogger
    {
        /// <summary>
        /// Logs information about a tour to the database.
        /// </summary>
        public static async Task LogTour(SystemDbContext systemContext, Tour tour)
        {
            await systemContext.PastTours.AddAsync(tour);
        }
    }

    public class DataPanelDatabaseController
    {
        private readonly SystemDbContext _SystemContext;
        private readonly ILogger _logger;

        public DataPanelDatabaseController(
            SystemDbContext SystemContext,
            ILoggerFactory loggerFactory
        )
        {
            _SystemContext = SystemContext;
            _logger = loggerFactory.CreateLogger("DataPanelController");
        }

        public async Task<GuideData?> GetGuideData(int UID)
        {
            if (UID < 0)
            {
                return null;
            }

            var guideData = await _SystemContext.GuideData.FirstOrDefaultAsync(g => g.UID == UID);

            if (guideData == null)
            {
                return null;
            }

            return guideData;
        }
    }
}
