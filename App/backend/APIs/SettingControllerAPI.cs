/// <summary>
/// This file contains the SettingController class, which provides API endpoints for managing system settings.
/// It includes operations such as retrieving the maximum allowed concurrent tours, interacting with the SystemDatabaseController 
/// to fetch relevant configuration data from the database.
/// </summary>
using backend.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Controller that provides an endpoint for retrieving system settings related to concurrent tour limits.
/// It includes a method for fetching the maximum number of concurrent tours allowed in the system.
/// Constraints:
/// - This controller interacts with the SystemDatabaseController to fetch configuration data.
/// </summary>
[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/schools")]
public class SettingController : ControllerBase
{
    private readonly SystemDatabaseController _controller;

    // <summary>
    /// Initializes a new instance of the SettingController class.
    /// </summary>
    /// <param name="context">An instance of the SystemDatabaseController used for accessing the database.</param>
    public SettingController(SystemDatabaseController context)
    {
        _controller = context;
    }

    /// <summary>
    /// Retrieves the maximum allowed number of concurrent tours.
    /// </summary>
    /// <returns>The allowed concurrent tour limit as an integer.</returns>
    [HttpGet("concurrenttourlimit")]
    public async Task<IActionResult> GetConcurrentTourLimit()
    {
        var count = await _controller.GetAllowedConcurrentTourCount();
        return Ok(count);
    }
}
