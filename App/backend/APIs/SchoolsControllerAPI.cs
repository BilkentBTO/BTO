/// <summary>
/// This file contains the SchoolsController class, which provides API endpoints for managing school-related data. 
/// It supports operations such as retrieving school suggestions based on a search query, filtering schools by city, 
/// and retrieving a list of available cities. The controller interacts with the SystemDatabaseController to access 
/// and filter school and city data from the database.
/// </summary>
using backend.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Controller that provides endpoints for retrieving school suggestions and city names.
/// It includes methods for searching schools based on a query, filtering results by city, and fetching a list of available cities.
/// </summary>
[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/schools")]
public class SchoolsController : ControllerBase
{
    private readonly SystemDatabaseController _controller;

    /// <summary>
    /// Initializes a new instance of the SchoolsController class.
    /// </summary>
    /// <param name="context">An instance of the SystemDatabaseController used for accessing the database.</param>
    public SchoolsController(SystemDatabaseController context)
    {
        _controller = context;
    }

    /// <summary>
    /// Retrieves school suggestions based on a search query.
    /// </summary>
    /// <param name="query">The search query entered by the user.</param>
    /// <returns>A list of school names matching the search query.</returns>
    [HttpGet("autocomplete")]
    public async Task<IActionResult> Autocomplete([FromQuery] string query)
    {
        var suggestions = await _controller.GetSchoolSuggestionsAsync(query);
        return Ok(suggestions);
    }

    /// <summary>
    /// Retrieves school suggestions filtered by both a search query and a city name.
    /// </summary>
    /// <param name="query">The search query entered by the user.</param>
    /// <param name="cityName">The name of the city to filter the school suggestions.</param>
    /// <returns>A list of school names matching the search query and city filter.</returns>
    [HttpGet("autocompleteWithFilter")]
    public async Task<IActionResult> AutocompleteWithFilter(
        [FromQuery] string query,
        [FromQuery] string cityName
    )
    {
        var suggestions = await _controller.GetSchoolSuggestionsWithFilterAsync(query, cityName);
        return Ok(suggestions);
    }

    /// <summary>
    /// Retrieves a list of all available city names for filtering purposes.
    /// </summary>
    /// <returns>A list of city names.</returns>
    [HttpGet("cities")]
    public IActionResult GetCities()
    {
        return Ok(_controller.GetAllCityNames());
    }
}
