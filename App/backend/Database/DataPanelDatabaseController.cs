/// <summary>
/// This file contains two key components: the DataLogger class and the DataPanelDatabaseController class.
///
/// The DataLogger class provides static methods for logging data related to tours into the database.
/// It serves as a utility class for managing tour-related data.
///
/// The DataPanelDatabaseController class is responsible for fetching guide data and school data from the database.
/// It interacts with the SystemDbContext to retrieve, process, and return data associated with guides and schools,
/// including linking guide and school data with their respective entities.
/// </summary>
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Database
{
    /// <summary>
    /// A static class responsible for logging data into the database.
    /// Currently, it only supports logging tour data by adding tours to the PastTours table.
    /// </summary>
    public static class DataLogger
    {
        /// <summary>
        /// Logs information about a tour to the database by adding the provided tour to the PastTours table.
        /// </summary>
        /// <param name="systemContext">The DbContext used for database operations.</param>
        /// <param name="tour">The tour entity to be logged into the database.</param>
        public static async Task LogTour(SystemDbContext systemContext, Tour tour)
        {
            await systemContext.PastTours.AddAsync(tour);
        }
    }

    /// <summary>
    /// This class handles database operations related to the data panel, specifically retrieving guide data and school data.
    /// It interacts with the SystemDbContext to fetch, process, and return the relevant data for guides and schools.
    /// </summary>
    public class DataPanelDatabaseController
    {
        private readonly SystemDbContext _SystemContext;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the DataPanelDatabaseController class.
        /// </summary>
        /// <param name="SystemContext">The DbContext used for database operations.</param>
        /// <param name="loggerFactory">Factory for creating loggers to log any necessary information or errors.</param>
        public DataPanelDatabaseController(
            SystemDbContext SystemContext,
            ILoggerFactory loggerFactory
        )
        {
            _SystemContext = SystemContext;
            _logger = loggerFactory.CreateLogger("DataPanelController");
        }

        /// <summary>
        /// Retrieves guide data based on the provided UID (User ID).
        /// The guide data includes information from the GuideData table and is enriched with related user data from the Users table.
        /// </summary>
        /// <param name="UID">The unique identifier for the guide (User ID).</param>
        /// <returns>A GuideData object containing the guide's statistics and related user information, or null if not found.</returns>
        public async Task<GuideData?> GetGuideData(int UID)
        {
            // Retrieves guide data based on UID
            var guideData = await _SystemContext.GuideData.FirstOrDefaultAsync(g => g.UID == UID);

            if (guideData == null)
            {
                return null;
            }

            // Retrieves the user (guide) associated with the UID and attaches it to the guide data
            var guide = await _SystemContext.Users.FirstOrDefaultAsync(u => u.ID == UID);

            guideData.Guide = guide;

            return guideData;
        }

        public async Task<List<GuideData>> GetAllGuideData()
        {
            // Retrieves the user (guide) associated with the UID and attaches it to the guide data
            var guideData = await _SystemContext.GuideData.ToListAsync();

            return guideData;
        }

        /// <summary>
        /// Retrieves a list of all school data, enriched with school information from the Schools table.
        /// </summary>
        /// <returns>A list of SchoolData objects containing school statistics and related school information.</returns>
        public async Task<List<SchoolData>> GetSchoolData()
        {
            // Retrieves all school data
            var schoolDataList = await _SystemContext.SchoolData.ToListAsync();

            if (schoolDataList == null || !schoolDataList.Any())
            {
                return new List<SchoolData>();
            }
            // For each school data record, attach the related school information
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
