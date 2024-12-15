using backend.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
public class SchoolsController : ControllerBase
{
    private readonly SystemDatabaseController _controller;

    public SchoolsController(SystemDatabaseController context)
    {
        _controller = context;
    }

    [HttpGet("autocomplete")]
    public IActionResult Autocomplete([FromQuery] string query)
    {
        var suggestions = _controller.GetSchoolSuggestions(query);
        return Ok(suggestions);
    }

    [HttpGet("autocompleteWithFilter")]
    public IActionResult AutocompleteWithFilter(
        [FromQuery] string query,
        [FromQuery] string cityName
    )
    {
        var suggestions = _controller.GetSchoolSuggestionsWithFilter(query, cityName);
        return Ok(suggestions);
    }

    [HttpGet("cities")]
    public IActionResult GetCities()
    {
        return Ok(_controller.GetAllCityNames());
    }
}
