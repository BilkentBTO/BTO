using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/schedule")]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleDatabaseController _controller;

        public ScheduleController(ScheduleDatabaseController controller)
        {
            _controller = controller;
        }

        #region TOUR
        [HttpDelete("tour/{tourCode}/guide")]
        public async Task<ActionResult> RemoveGuideFromTour(string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.RemoveGuideFromTour(tourCode);

            return ErrorHandler.HandleError(result);
        }

        [HttpPut("tour/{tourCode}/guide/{guideUID}")]
        public async Task<ActionResult> ChangeGuideOfTour(string tourCode, int guideUID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.ChangeGuideOfTour(tourCode, guideUID);

            return ErrorHandler.HandleError(result);
        }

        [HttpDelete("tour/{tourCode}")]
        public async Task<ActionResult> RemoveTour(string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveTour(tourCode))
                return NotFound("Unable to remove tour.");

            return Ok();
        }

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
        [HttpPut("tour")]
        public async Task<ActionResult> UpdateTour(Tour tour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateTourInfo(tour))
                return BadRequest("Unable to update tour.");

            return Ok();
        }

        [HttpGet("tours")]
        public async Task<ActionResult> GetAllTours()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Tour> tours = await _controller.GetAllTours();

            return Ok(tours);
        }

        [HttpGet("availabletours")]
        public async Task<ActionResult> GetAllAvailableTours()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Tour> tours = await _controller.GetAllAvailableTours();

            return Ok(tours);
        }

        #endregion

        #region FAIR
        /*
        [HttpPut("fair/{fairCode}/fair/{fairUID}")]
        public async Task<ActionResult> AddGuideToFair(string tourCode, int guideUID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.ChangeGuideOfTour(tourCode, guideUID);

            return ErrorHandler.HandleError(result);
        }

        [HttpDelete("fair/{fairCode}/guide/{guideUID}")]
        public async Task<ActionResult> RemoveGuideFromFair(string fairCode, int guideUID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _controller.RemoveGuideFromTour(tourCode);

            return ErrorHandler.HandleError(result);
        }
        */
        [HttpDelete("fair/{fairCode}")]
        public async Task<ActionResult> RemoveFair(string fairCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveFair(fairCode))
                return NotFound("Unable to remove fair.");

            return Ok();
        }

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
        [HttpPut("fair")]
        public async Task<ActionResult> UpdateFair(Fair fair)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateFairInfo(fair))
                return BadRequest("Unable to update fair.");

            return Ok();
        }

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

        [HttpGet("availablefairs")]
        public async Task<ActionResult> GetAllAvailableFairs()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<Fair> tours = await _controller.GetAllAvailableFairs();

            return Ok(tours);
        }

        #endregion
    }
}
