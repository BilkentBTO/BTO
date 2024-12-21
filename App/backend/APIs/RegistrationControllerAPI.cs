using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/register")]
    public class RegistrationController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        public RegistrationController(SystemDatabaseController context)
        {
            _controller = context;
        }

        [HttpGet("general")]
        public async Task<ActionResult> GetGeneralRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetGeneralRegistration(Code);
            if (result == null)
            {
                return NotFound(new { message = "Registration not found." });
            }
            return Ok(result);
        }

        [HttpPost("general/cancel")]
        public async Task<ActionResult> CancelGeneralRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.CancelGeneralRegistration(Code);
            return ErrorHandler.HandleError(result);
        }

        [HttpPost("tour")]
        public async Task<ActionResult> AddTourRegistration(
            [FromBody] TourRegistrationRequest registration
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new { message = "Invalid registration data.", errors = ModelState }
                );
            }

            registration.DateOfVisit = DateTime.SpecifyKind(
                registration.DateOfVisit,
                DateTimeKind.Utc
            );

            if (registration.SchoolCode == null || registration.SchoolCode < 0)
            {
                return BadRequest(new { message = "Valid SchoolCode is required." });
            }

            if (string.IsNullOrEmpty(registration.CityName))
            {
                return BadRequest(new { message = "CityName is required." });
            }
            if (registration.NumberOfVisitors <= 0)
            {
                return BadRequest(new { message = "NumberOfVisitors must be greater than zero." });
            }

            var result = await _controller.AddTourRegistration(registration);

            if (string.IsNullOrEmpty(result))
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("tour/accept")]
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

        [HttpPost("tour/reject")]
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

        [HttpGet("tour")]
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

        [HttpPost("fair")]
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

        [HttpPost("fair/accept")]
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

        [HttpPost("fair/reject")]
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

        [HttpGet("fair")]
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

        [HttpPost("individual")]
        public async Task<ActionResult> AddIndividualRegistration(
            [FromBody] IndividualRegistrationRequest registration
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

            var result = await _controller.AddIndividualRegistration(registration);
            if (string.IsNullOrEmpty(result))
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("individual/accept")]
        public async Task<ActionResult> AcceptIndividualRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AcceptIndividualRegistration(Code);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("individual/reject")]
        public async Task<ActionResult> RejectIndividualRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.RejectIndividualRegistration(Code);
            if (!result)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("individual/registrations")]
        public async Task<ActionResult> GetAllIndividualRegistrations()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllIndividualRegistrations();
            return Ok(result);
        }

        [HttpGet("individual")]
        public async Task<ActionResult> GetIndividualRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetIndividualRegistration(Code);
            return Ok(result);
        }

        [HttpGet("individual/registrations/{state}")]
        public async Task<ActionResult> GetAllIndividualRegistrationsFiltered(
            RegistrationState state
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllIndividualRegistrationsFiltered(state);
            return Ok(result);
        }
    }
}
