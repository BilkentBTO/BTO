using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
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
            _logger = loggerFactory.CreateLogger("DataPanelDatabaseController");
        }
    }
}
