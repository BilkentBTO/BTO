/// <summary>
/// This file defines the Setting class, which contains configuration values related to tours. 
/// It includes a constant for the allowed concurrent tour count, as well as an instance property to 
/// configure it.
/// </summary>
namespace BTO.Setting
{
    /// <summary>
    /// Represents the settings for managing tours.
    /// Includes constants and properties related to the allowed number of concurrent tours.
    /// </summary>
    public class Setting
    {
        // Constant defining the default allowed number of concurrent tours
        public const int ALLOWED_CONCURRENT_TOUR_COUNT = 3;

        // Unique identifier for the setting
        public int Id { get; set; }

        // Configurable property for the allowed number of concurrent tours, default is set to ALLOWED_CONCURRENT_TOUR_COUNT
        public int AllowedConcurrentTourCount { get; set; } = ALLOWED_CONCURRENT_TOUR_COUNT;
    }
}
