using backend.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Microsoft.AspNetCore.Mvc.Route("api/schools")]
public class SettingController : ControllerBase
{
    private readonly SystemDatabaseController _controller;

    public SettingController(SystemDatabaseController context)
    {
        _controller = context;
    }

    [HttpGet("concurrenttourlimit")]
    public async Task<IActionResult> GetConcurrentTourLimit()
    {
        var count = await _controller.GetAllowedConcurrentTourCount();
        return Ok(count);
    }
}
