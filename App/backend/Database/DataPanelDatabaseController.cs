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
            var guideData = await _SystemContext.GuideData.FirstOrDefaultAsync(g => g.UID == UID);

            if (guideData == null)
            {
                return null;
            }

            var guide = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);

            guideData.Guide = guide;

            return guideData;
        }

        public async Task<List<SchoolData>> GetSchoolData()
        {
            var schoolDataList = await _SystemContext.SchoolData.ToListAsync();

            if (schoolDataList == null || !schoolDataList.Any())
            {
                return new List<SchoolData>();
            }

            foreach (var schoolData in schoolDataList)
            {
                var school = await _SystemContext.Schools.FirstOrDefaultAsync(s =>
                    s.SchoolCode == schoolData.SchoolCode
                );
                schoolData.School = school;
            }

            return schoolDataList;
        }
    }
}
