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
    public async Task<IActionResult> Autocomplete([FromQuery] string query)
    {
        var suggestions = await _controller.GetSchoolSuggestionsAsync(query);
        return Ok(suggestions);
    }

    [HttpGet("autocompleteWithFilter")]
    public async Task<IActionResult> AutocompleteWithFilter(
        [FromQuery] string query,
        [FromQuery] string cityName
    )
    {
        var suggestions = await _controller.GetSchoolSuggestionsWithFilterAsync(query, cityName);
        return Ok(suggestions);
    }

    [HttpGet("cities")]
    public IActionResult GetCities()
    {
        return Ok(_controller.GetAllCityNames());
    }
}
