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

            var result = await _controller.AddGuideTourApplication(request);

            return ErrorHandler.HandleError(result);
        }

        [HttpGet("tour")]
        public async Task<ActionResult> GetGuideTourApplications()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllGuideTourApplications();
            return Ok(result);
        }

        [HttpGet("tour/accept/{guideUID}")]
        public async Task<ActionResult> AcceptGuideTourApplications(int guideUID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.AcceptGuideTourApplication(guideUID);
            return ErrorHandler.HandleError(result);
        }

        [HttpGet("tour/reject/{guideUID}")]
        public async Task<ActionResult> RejectGuideTourApplications(int guideUID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.RejectGuideTourApplication(guideUID);
            return ErrorHandler.HandleError(result);
        }
    }
}
