using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/apply")]
    public class ApplicationController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        public ApplicationController(SystemDatabaseController context)
        {
            _controller = context;
        }

        [HttpPost("tour")]
        public async Task<ActionResult> GuideTourApplication(GuideTourApplicationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (request.GuideUID < 0)
            {
                return BadRequest(new { message = "Invalid User ID.", errors = ModelState });
            }
            if (request.TourID < 0)
            {
                return BadRequest(new { message = "Invalid Tour ID.", errors = ModelState });
            }

            var result = await _controller.AddGuideTourApplication(
                request.TourID,
                request.GuideUID
            );
            if (result == ErrorTypes.TourNotFound)
            {
                return NotFound(new { message = "Tour not found." });
            }
            if (result == ErrorTypes.UserNotFound)
            {
                return NotFound(new { message = "Guide not found." });
            }
            return Ok(result);
        }
    }
}
