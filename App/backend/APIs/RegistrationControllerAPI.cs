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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            registration.DateOfVisit = DateTime.SpecifyKind(
                registration.DateOfVisit,
                DateTimeKind.Utc
            );

            var result = await _controller.AddRegistration(registration);
            if (string.IsNullOrEmpty(result))
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("GetAllRegistrations")]
        public async Task<ActionResult> GetAllRegistrations()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllRegistrations();
            return Ok(result);
        }

        [HttpGet("GetRegistration")]
        public async Task<ActionResult> GetRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetRegistration(Code);
            return Ok(result);
        }
    }
}
