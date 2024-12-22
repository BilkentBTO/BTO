using backend.Models;
using Microsoft.Extensions.Logging;

namespace backend.Database
{
    public static class DataPanelDatabaseController
    {
        /// <summary>
        /// Logs information about a tour to the database.
        /// </summary>
        public static async Task LogTour(SystemDbContext systemContext, Tour tour)
        {
            await systemContext.PastTours.AddAsync(tour);
        }
    }
}
