/// <summary>
/// This file contains the implementation of the ScheduleController class, which handles API endpoints related to tours, fairs, and guides in the system.
/// The controller interacts with the ScheduleDatabaseController to manage various aspects of the tour, fair, and guide data, providing functionality for
/// adding, removing, updating, and retrieving information about tours, fairs, and guides.
/// The following functionality is provided:
///
/// 1. **Tour Management:**
///    - Remove a guide from a tour.
///    - Change the guide assigned to a tour.
///    - Remove a tour from the system.
///    - Retrieve a specific tour by its code.
///    - Update the details of an existing tour.
///    - Retrieve all tours and all available tours.
///    - End a tour by its code.
///
/// 2. **Fair Management:**
///    - Retrieve all guides associated with a specific fair.
///    - Add or remove guides from a fair.
///    - Remove a fair from the system.
///    - Retrieve a specific fair by its code.
///    - Update the details of an existing fair.
///    - Retrieve all fairs and all available fairs.
///
/// 3. **Guide Management:**
///    - Retrieve a list of available guides for a specific event.
///
/// The controller ensures proper validation of model states, handles errors, and returns appropriate HTTP status codes (e.g., BadRequest, Ok, NotFound) based on the results.
/// </summary>
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    /// <summary>
    /// The ScheduleController class handles HTTP requests related to managing tour schedules,
    /// including adding, removing, and updating tours, as well as assigning and removing guides
    /// from specific tours. The controller interacts with the ScheduleDatabaseController to perform
    /// these operations and returns appropriate responses.
    /// </summary>
    [ApiController]
    [Route("api/schedule")]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleDatabaseController _controller;

        /// <summary>
        /// Initializes a new instance of the ScheduleController class, injecting the ScheduleDatabaseController
        /// which is responsible for the database interactions regarding tour schedules.
        /// </summary>
        /// <param name="controller">An instance of ScheduleDatabaseController used to interact with the database.</param>
        public ScheduleController(ScheduleDatabaseController controller)
        {
            _controller = controller;
        }

        #region TOUR

        /// <summary>
        /// Removes a guide from a specific tour identified by the provided tour code.
        /// It checks if the model state is valid and interacts with the database to remove the guide from the tour.
        /// Returns appropriate status codes based on the result of the operation.
        /// </summary>
        /// <param name="tourCode">The unique identifier for the tour from which the guide will be removed.</param>
        /// <returns>A BadRequest if the model state is invalid, or the result of removing the guide from the tour.</returns>
        [HttpDelete("tour/{tourCode}/guide")]
        public async Task<ActionResult> RemoveGuideFromTour(string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.RemoveGuideFromTour(tourCode);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Changes the guide assigned to a specific tour, identified by the provided tour code.
        /// The method updates the tour with the new guide's unique ID (guideUID) in the database.
        /// Returns appropriate status codes based on the result of the operation.
        /// </summary>
        /// <param name="tourCode">The unique identifier for the tour where the guide is being changed.</param>
        /// <param name="guideUID">The unique identifier of the new guide to be assigned to the tour.</param>
        /// <returns>A BadRequest if the model state is invalid, or the result of changing the guide for the tour.</returns>
        [HttpPut("tour/{tourCode}/guide/{guideUID}")]
        public async Task<ActionResult> ChangeGuideOfTour(string tourCode, int guideUID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.ChangeGuideOfTour(tourCode, guideUID);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Removes a tour from the system based on the provided tour code.
        /// The method interacts with the database to remove the specified tour.
        /// Returns a NotFound status if the tour cannot be found or removed successfully, or an Ok status if successful.
        /// </summary>
        /// <param name="tourCode">The unique identifier for the tour to be removed.</param>
        /// <returns>A NotFound status if the tour cannot be removed, or an Ok status if the removal is successful.</returns>
        [HttpDelete("tour/{tourCode}")]
        public async Task<ActionResult> RemoveTour(string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveTour(tourCode))
                return NotFound("Unable to remove tour.");

            return Ok();
        }

        /// <summary>
        /// Retrieves the details of a tour using the provided tour code.
        /// If the tour exists in the database, it returns the tour details.
        /// If not, it returns a NotFound status.
        /// </summary>
        /// <param name="tourCode">The unique identifier for the tour to be retrieved.</param>
        /// <returns>A BadRequest if the model state is invalid, or the details of the tour if found, otherwise a NotFound status.</returns>
        [HttpGet("tour/{tourCode}")]
        public async Task<ActionResult> GetTourByCode(string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Tour? tour;
            if ((tour = await _controller.GetTour(tourCode)) == null)
                return NotFound("Unable to get tour by ID.");

            return Ok(tour);
        }

        //TODO REWORK

        /// <summary>
        /// Updates the information of an existing tour.
        /// The method interacts with the database to update the tour details based on the provided tour object.
        /// Returns a BadRequest if the update operation fails or if the model state is invalid, or an Ok status if successful.
        /// </summary>
        /// <param name="tour">The updated tour information to be saved in the database.</param>
        /// <returns>A BadRequest if the update operation fails or the model state is invalid, or an Ok status if successful.</returns>
        [HttpPut("tour")]
        public async Task<ActionResult> UpdateTour(Tour tour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateTourInfo(tour))
                return BadRequest("Unable to update tour.");

            return Ok();
        }

        /// <summary>
        /// Retrieves a list of all tours available in the system.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it fetches all the tours from the database and returns them.
        /// </summary>
        /// <returns>A BadRequest if the model state is invalid, or a list of tours if successful.</returns>
        [HttpGet("tours")]
        public async Task<ActionResult> GetAllTours()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Tour> tours = await _controller.GetAllTours();

            return Ok(tours);
        }

        /// <summary>
        /// Retrieves a list of all available tours in the system.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it fetches all available tours from the database and returns them.
        /// </summary>
        /// <returns>A BadRequest if the model state is invalid, or a list of available tours if successful.</returns>
        [HttpGet("availabletours")]
        public async Task<ActionResult> GetAllAvailableTours()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Tour> tours = await _controller.GetAllAvailableTours();

            return Ok(tours);
        }

        /// <summary>
        /// Ends a specific tour identified by the provided code.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it attempts to end the tour and returns the result through an error handler.
        /// </summary>
        /// <param name="Code">The unique identifier for the tour to be ended.</param>
        /// <returns>A BadRequest if the model state is invalid, or the result of ending the tour.</returns>
        [HttpPost("tour/end")]
        public async Task<ActionResult> EndTour(string Code)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.EndTour(Code);

            return ErrorHandler.HandleError(result);
        }

        #endregion

        #region FAIR


        /// <summary>
        /// Retrieves a list of all guides assigned to a specific fair, identified by the provided fair code.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it fetches all the guides for the fair from the database and returns them.
        /// </summary>
        /// <param name="fairCode">The unique identifier for the fair to get the assigned guides.</param>
        /// <returns>A BadRequest if the model state is invalid, or a list of guides for the fair if successful.</returns>
        [HttpGet("fair/{fairCode}/guide")]
        public async Task<ActionResult> GetAllGuidesOfFair(string fairCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.GetAllGuidesOfFair(fairCode);

            return Ok(result);
        }

        /// <summary>
        /// Adds a guide to a specific fair, identified by the provided fair code and guide UID.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it attempts to add the guide to the fair and returns the result through an error handler.
        /// </summary>
        /// <param name="fairCode">The unique identifier for the fair to which the guide will be added.</param>
        /// <param name="guideUID">The unique identifier for the guide to be added to the fair.</param>
        /// <returns>A BadRequest if the model state is invalid, or the result of adding the guide to the fair.</returns>
        [HttpPut("fair/{fairCode}/guide/{guideUID}")]
        public async Task<ActionResult> AddGuideToFair(string fairCode, int guideUID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.AddGuideToFair(fairCode, guideUID);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Removes a guide from a specific fair, identified by the provided fair code and guide UID.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it attempts to remove the guide from the fair and returns the result through an error handler.
        /// </summary>
        /// <param name="fairCode">The unique identifier for the fair from which the guide will be removed.</param>
        /// <param name="guideUID">The unique identifier for the guide to be removed from the fair.</param>
        /// <returns>A BadRequest if the model state is invalid, or the result of removing the guide from the fair.</returns>
        [HttpDelete("fair/{fairCode}/guide/{guideUID}")]
        public async Task<ActionResult> RemoveGuideFromFair(string fairCode, int guideUID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.RemoveGuideFromFair(fairCode, guideUID);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Removes a specific fair from the system, identified by the provided fair code.
        /// If the model state is invalid, it returns a BadRequest status.
        /// If the fair cannot be found, it returns a NotFound status.
        /// Otherwise, it removes the fair and returns an Ok status.
        /// </summary>
        /// <param name="fairCode">The unique identifier for the fair to be removed.</param>
        /// <returns>A NotFound status if the fair cannot be removed, or an Ok status if the removal is successful.</returns>
        [HttpDelete("fair/{fairCode}")]
        public async Task<ActionResult> RemoveFair(string fairCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveFair(fairCode))
                return NotFound("Unable to remove fair.");

            return Ok();
        }

        /// <summary>
        /// Retrieves a specific fair identified by the provided fair code.
        /// If the model state is invalid, it returns a BadRequest status.
        /// If the fair is not found, it returns a NotFound status.
        /// Otherwise, it returns the fair details.
        /// </summary>
        /// <param name="fairCode">The unique identifier for the fair to be retrieved.</param>
        /// <returns>A BadRequest if the model state is invalid, a NotFound if the fair is not found, or the fair details if successful.</returns>
        [HttpGet("fair/{fairCode}")]
        public async Task<ActionResult> GetFairByCode(string fairCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Fair? fair;
            if ((fair = await _controller.GetFair(fairCode)) == null)
                return NotFound("Unable to get fair by ID.");

            return Ok(fair);
        }

        //TODO Rework

        /// <summary>
        /// Updates the details of a specific fair.
        /// If the model state is invalid, it returns a BadRequest status.
        /// If the fair update fails, it returns a BadRequest with a message.
        /// Otherwise, it returns an Ok status after the update is successful.
        /// </summary>
        /// <param name="fair">The fair object containing updated information.</param>
        /// <returns>A BadRequest if the model state is invalid or the update fails, or an Ok status if the update is successful.</returns>
        [HttpPut("fair")]
        public async Task<ActionResult> UpdateFair(Fair fair)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateFairInfo(fair))
                return BadRequest("Unable to update fair.");

            return Ok();
        }

        /// <summary>
        /// Retrieves a list of all fairs available in the system.
        /// If the model state is invalid, it returns a BadRequest status.
        /// If no fairs are found, it returns a BadRequest with a message.
        /// Otherwise, it returns a list of all fairs.
        /// </summary>
        /// <returns>A BadRequest if the model state is invalid or no fairs are found, or a list of fairs if successful.</returns>
        [HttpGet("fairs")]
        public async Task<ActionResult> GetAllFairs()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Fair> fairs;
            if ((fairs = await _controller.GetAllFairs()) == null)
                return BadRequest("Unable to get all fairs.");

            return Ok(fairs);
        }

        /// <summary>
        /// Retrieves a list of all available fairs in the system.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it fetches all available fairs and returns them.
        /// </summary>
        /// <returns>A BadRequest if the model state is invalid, or a list of available fairs if successful.</returns>
        [HttpGet("availablefairs")]
        public async Task<ActionResult> GetAllAvailableFairs()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Fair> tours = await _controller.GetAllAvailableFairs();

            return Ok(tours);
        }
        #endregion

        #region GUIDE

        /// <summary>
        /// Retrieves a list of all available guides for a specific event, identified by the provided event code.
        /// If the model state is invalid, it returns a BadRequest status.
        /// Otherwise, it fetches the available guides for the event and returns them.
        /// </summary>
        /// <param name="eventCode">The unique identifier for the event to get the available guides.</param>
        /// <returns>A BadRequest if the model state is invalid, or a list of available guides for the event if successful.</returns>
        [HttpGet("available/guide")]
        //MAJOR TODO
        public async Task<ActionResult> GetAllAvailableGuides(string eventCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<User> guides = await _controller.GetAllAvailableGuides(eventCode);

            return Ok(guides);
        }
        #endregion
    }
}
