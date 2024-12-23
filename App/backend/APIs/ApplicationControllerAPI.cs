/// <summary>
/// This file contains the `ApplicationController` class, which manages the API endpoints for handling guide tour applications.
/// It provides actions for applying, accepting, rejecting, and retrieving guide tour applications.
/// The controller interacts with the `SystemDatabaseController` to process guide tour application data and uses `ErrorHandler` for error handling.
/// </summary>
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    /// <summary>
    /// This controller handles the API requests for managing guide tour applications.
    /// It provides endpoints for applying, accepting, rejecting, and retrieving applications.
    /// Constraints:
    /// - The `SystemDatabaseController` context must be provided during the controller's initialization.
    /// - The API routes for each method are prefixed with `api/apply`, and the actions are limited to handling tour guide applications.
    /// </summary>
    [ApiController]
    [Route("api/apply")]
    public class ApplicationController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        public ApplicationController(SystemDatabaseController context)
        {
            _controller = context;
        }

        /// <summary>
        /// Handles the HTTP POST request for submitting a guide tour application.
        /// Validates the model state before attempting to add the application to the database.
        /// </summary>
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

        /// <summary>
        /// Handles the HTTP GET request for retrieving all guide tour applications.
        /// Validates the model state before fetching the applications from the database.
        /// </summary>
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

        /// <summary>
        /// Handles the HTTP POST request for accepting a guide tour application.
        /// Validates the model state before accepting the application and updating the database.
        /// </summary>
        [HttpPost("tour/accept/{guideUID}")]
        public async Task<ActionResult> AcceptGuideTourApplications(int guideUID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.AcceptGuideTourApplication(guideUID);
            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Handles the HTTP POST request for rejecting a guide tour application.
        /// Validates the model state before rejecting the application and updating the database.
        /// </summary>
        [HttpPost("tour/reject/{guideUID}")]
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
