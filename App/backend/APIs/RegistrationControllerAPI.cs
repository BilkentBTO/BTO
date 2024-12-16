using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        public RegistrationController(SystemDatabaseController context)
        {
            _controller = context;
        }

        [HttpPost("Register")]
        public async Task<ActionResult> AddRegistration([FromBody] RegistrationRequest registration)
        {
            var result = await _controller.AddRegistration(registration);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok();
        }
    }
}
