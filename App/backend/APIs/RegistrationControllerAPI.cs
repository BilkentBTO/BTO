using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        public RegistrationController(SystemDatabaseController context)
        {
            _controller = context;
        }

        [HttpPost("tour/register")]
        public async Task<ActionResult> AddTourRegistration(
            [FromBody] TourRegistrationRequest registration
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            registration.DateOfVisit = DateTime.SpecifyKind(
                registration.DateOfVisit,
                DateTimeKind.Utc
            );

            var result = await _controller.AddTourRegistration(registration);
            if (string.IsNullOrEmpty(result))
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("tour/acceptregistration")]
        public async Task<ActionResult> AcceptTourRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AcceptTourRegistration(Code);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("tour/rejectregistration")]
        public async Task<ActionResult> RejectTourRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.RejectTourRegistration(Code);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("tour/registrations")]
        public async Task<ActionResult> GetAllTourRegistrations()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllTourRegistrations();
            return Ok(result);
        }

        [HttpGet("tour/getregistration")]
        public async Task<ActionResult> GetTourRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetTourRegistration(Code);
            return Ok(result);
        }

        [HttpGet("tour/registrations/{state}")]
        public async Task<ActionResult> GetAllTourRegistrationsFiltered(RegistrationState state)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllTourRegistrationsFiltered(state);
            return Ok(result);
        }

        [HttpPost("fair/register")]
        public async Task<ActionResult> AddFairRegistration(
            [FromBody] FairRegistrationRequest registration
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            registration.DateOfVisit = DateTime.SpecifyKind(
                registration.DateOfVisit,
                DateTimeKind.Utc
            );

            var result = await _controller.AddFairRegistration(registration);
            if (string.IsNullOrEmpty(result))
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("fair/acceptregistration")]
        public async Task<ActionResult> AcceptFairRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AcceptFairRegistration(Code);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("fair/rejectregistration")]
        public async Task<ActionResult> RejectFairRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.RejectFairRegistration(Code);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("fair/getregistrations")]
        public async Task<ActionResult> GetAllFairRegistrations()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllFairRegistrations();
            return Ok(result);
        }

        [HttpGet("fair/getregistrations/{state}")]
        public async Task<ActionResult> GetAllFairRegistrationsFiltered(RegistrationState state)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllFairRegistrationsFiltered(state);
            return Ok(result);
        }

        [HttpGet("fair/getregistration")]
        public async Task<ActionResult> GetFairRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetFairRegistration(Code);
            return Ok(result);
        }
    }
}
