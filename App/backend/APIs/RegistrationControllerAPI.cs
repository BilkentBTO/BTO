/// <summary>
/// This file contains the API controller responsible for handling various types of registrations related to school tours, fairs, and individual visits.
/// The controller provides several endpoints for managing registrations, including the ability to:
/// 
/// - Add, accept, and reject registrations for tours, fairs, and individual visits
/// - Retrieve registration details by code
/// - Retrieve all registrations, with support for filtering by registration state
/// 
/// Each registration type (tour, fair, individual) has its own set of actions, ensuring clear separation of concerns and better organization of the API routes.
/// The API is designed to handle requests related to:
/// 
/// - **Tour Registrations**: Manage the registrations of individuals for tours, including accepting, rejecting, and viewing registration details.
/// - **Fair Registrations**: Handle the registration of individuals for fairs, including accepting, rejecting, and viewing registration details.
/// - **Individual Registrations**: Similar to the other two, but focused on individual registrations for school visits or similar activities.
/// 
/// This controller serves as an intermediary between the client-side and the backend system, processing requests, interacting with the database layer,
/// and returning appropriate HTTP responses based on the operations performed.
/// 
/// Key features:
/// - Each registration type supports actions for both adding and managing the status of the registration (accept, reject).
/// - Retrieval endpoints support filtering by state (Pending, Accepted, Rejected), allowing for more granular control over the displayed results.
/// 
/// Constraints:
/// - The `Code` parameter in all methods must represent a valid registration code.
///
/// Dependency:
/// - The controller relies on the `_controller` field, which handles the business logic of the operations, such as adding, updating, and fetching registrations.
/// - Error handling is centralized via the `ErrorHandler` utility to handle any issues with the results returned by the business logic layer.
/// 
/// HTTP Methods:
/// - **POST**: Used for actions like adding a new registration, accepting, or rejecting a registration.
/// - **GET**: Used for retrieving information on specific or all registrations.
/// </summary>
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    /// <summary>
    /// Controller class responsible for handling registration-related actions such as:
    /// - General registration retrieval
    /// - Canceling general registrations
    /// - Adding tour registrations
    /// Constraints:
    /// - `Code` parameter must be a valid registration code for the GetGeneralRegistration and CancelGeneralRegistration methods.
    /// - `TourRegist
    [ApiController]
    [Route("api/register")]
    public class RegistrationController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        // <summary>
        /// Initializes the RegistrationController with the specified database controller.
        /// </summary>
        /// <param name="context">The SystemDatabaseController instance used for database interactions.</param>
        public RegistrationController(SystemDatabaseController context)
        {
            _controller = context;
        }

        /// <summary>
        /// Retrieves the general registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the general registration.</param>
        /// <returns>A response containing the registration details if found, or a not found error message.</returns>
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

        /// <summary>
        /// Cancels the general registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the general registration to be canceled.</param>
        /// <returns>A response indicating whether the cancellation was successful or an error message.</returns>
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

        /// <summary>
        /// Adds a new tour registration.
        /// </summary>
        /// <param name="registration">The details of the tour registration to be added.</param>
        /// <returns>A response indicating whether the registration was successfully added or failed.</returns>
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

        /// <summary>
        /// Accepts the tour registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the tour registration.</param>
        /// <returns>A response indicating whether the tour registration was successfully accepted or failed.</returns>
        [HttpPost("tour/accept")]
        public async Task<ActionResult> AcceptTourRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AcceptTourRegistration(Code);

            return ErrorHandler.HandleError(result);
        }

         /// <summary>
        /// Marks a tour conflict as resolved based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the tour conflict to be marked as solved.</param>
        /// <returns>A response indicating whether the conflict was successfully marked as solved or failed.</returns>
        [HttpPost("tour/marksolved")]
        public async Task<ActionResult> MarkTourConflictAsSolved(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.MarkConflictAsSolved(Code);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Rejects the tour registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the tour registration to be rejected.</param>
        /// <returns>A response indicating whether the tour registration was successfully rejected or failed.</returns>
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

        /// <summary>
        /// Retrieves all tour registrations.
        /// </summary>
        /// <returns>A response containing a list of all tour registrations.</returns>
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

        /// <summary>
        /// Retrieves a specific tour registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the tour registration to retrieve.</param>
        /// <returns>A response containing the specific tour registration details.</returns>
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

        /// <summary>
        /// Retrieves all tour registrations filtered by the provided registration state.
        /// </summary>
        /// <param name="state">The state used to filter the tour registrations (e.g., Pending, Accepted, Rejected).</param>
        /// <returns>A response containing the filtered list of tour registrations based on the provided state.</returns>
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

        /// <summary>
        /// Adds a fair registration based on the provided registration details.
        /// </summary>
        /// <param name="registration">The details of the fair registration to be added.</param>
        /// <returns>A response indicating whether the fair registration was successfully added or failed.</returns>
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

        /// <summary>
        /// Accepts the fair registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the fair registration to be accepted.</param>
        /// <returns>A response indicating whether the fair registration was successfully accepted or failed.</returns>
        [HttpPost("fair/accept")]
        public async Task<ActionResult> AcceptFairRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AcceptFairRegistration(Code);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Rejects the fair registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the fair registration to be rejected.</param>
        /// <returns>A response indicating whether the fair registration was successfully rejected or failed.</returns>
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

        /// <summary>
        /// Retrieves a specific fair registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the fair registration to retrieve.</param>
        /// <returns>A response containing the specific fair registration details.</returns>
        [HttpGet("fair")]
        public async Task<ActionResult> GetFairRegistration(string Code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetFairRegistration(Code);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves all fair registrations.
        /// </summary>
        /// <returns>A response containing a list of all fair registrations.</returns>
        [HttpGet("fair/registrations")]
        public async Task<ActionResult> GetAllFairRegistrations()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllFairRegistrations();
            return Ok(result);
        }   

        /// <summary>
        /// Retrieves all fair registrations filtered by the provided registration state.
        /// </summary>
        /// <param name="state">The state used to filter the fair registrations (e.g., Pending, Accepted, Rejected).</param>
        /// <returns>A response containing the filtered list of fair registrations based on the provided state.</returns>
        [HttpGet("fair/registrations/{state}")]
        public async Task<ActionResult> GetAllFairRegistrationsFiltered(RegistrationState state)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _controller.GetAllFairRegistrationsFiltered(state);
            return Ok(result);
        }

        /// <summary>
        /// Adds an individual registration based on the provided registration details.
        /// </summary>
        /// <param name="registration">The details of the individual registration to be added.</param>
        /// <returns>A response indicating whether the individual registration was successfully added or failed.</returns>
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

        /// <summary>
        /// Accepts the individual registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the individual registration to be accepted.</param>
        /// <returns>A response indicating whether the individual registration was successfully accepted or failed.</returns>
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

        /// <summary>
        /// Rejects the individual registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the individual registration to be rejected.</param>
        /// <returns>A response indicating whether the individual registration was successfully rejected or failed.</returns>
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

        /// <summary>
        /// Retrieves all individual registrations.
        /// </summary>
        /// <returns>A response containing a list of all individual registrations.</returns>
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

        // <summary>
        /// Retrieves a specific individual registration based on the provided registration code.
        /// </summary>
        /// <param name="Code">The registration code for the individual registration to retrieve.</param>
        /// <returns>A response containing the specific individual registration details.</returns>
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

        /// <summary>
        /// Retrieves all individual registrations filtered by the provided registration state.
        /// </summary>
        /// <param name="state">The state used to filter the individual registrations (e.g., Pending, Accepted, Rejected).</param>
        /// <returns>A response containing the filtered list of individual registrations based on the provided state.</returns>
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
