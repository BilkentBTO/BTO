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
        [HttpPost("tour")]
        public async Task<ActionResult> AddTour([FromBody] Tour tour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddTour(tour))
                return BadRequest("Unable to add tour.");

            return Ok();
        }

        [HttpDelete("tour")]
        public async Task<ActionResult> RemoveTour(int tourID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveTour(tourID))
                return NotFound("Unable to remove tour.");

            return Ok();
        }

        [HttpGet("tour")]
        public async Task<ActionResult> GetTourByID(int tourID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Tour? tour;
            if ((tour = await _controller.GetTour(tourID)) == null)
                return NotFound("Unable to get tour by ID.");

            return Ok(tour);
        }

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

            Tour[] tours;
            if ((tours = await _controller.GetAllTours()) == null)
                return BadRequest("Unable to get all tours.");

            return Ok(tours);
        }

        #endregion

        #region FAIR
        [HttpPost("fair")]
        public async Task<ActionResult> AddFair([FromBody] Fair fair)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddFair(fair))
                return BadRequest("Unable to add fair.");

            return Ok();
        }

        [HttpDelete("fair")]
        public async Task<ActionResult> RemoveFair(int fairID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveFair(fairID))
                return NotFound("Unable to remove fair.");

            return Ok();
        }

        [HttpGet("fair")]
        public async Task<ActionResult> GetFairByID(int fairID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Fair? fair;
            if ((fair = await _controller.GetFair(fairID)) == null)
                return NotFound("Unable to get fair by ID.");

            return Ok(fair);
        }

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

            Fair[] fairs;
            if ((fairs = await _controller.GetAllFairs()) == null)
                return BadRequest("Unable to get all fairs.");

            return Ok(fairs);
        }

        #endregion

        #region SCHEDULE
        [HttpPost()]
        public async Task<ActionResult> AddTimeBlock(TimeBlock tb)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddTimeBlock(tb))
                return BadRequest("Unable to add timeblock.");

            return Ok();
        }

        [HttpPut()]
        public async Task<ActionResult> UpdateTimeBlock(TimeBlock tb)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateTimeBlock(tb))
                return BadRequest("Unable to update timeblock.");

            return Ok();
        }

        [HttpGet()]
        public async Task<ActionResult> GetTimeBlockByID(int timeID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            TimeBlock? tb;
            if ((tb = await _controller.GetTimeBlock(timeID)) == null)
                return NotFound("Unable to get timeblock by ID.");

            return Ok(tb);
        }

        [HttpGet()]
        public async Task<ActionResult> GetTimeBlockByTime(DateTime day, int timeBlockIndex)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            TimeBlock? tb;
            if ((tb = await _controller.GetTimeBlock(day, timeBlockIndex)) == null)
                return NotFound("Unable to get timeblock by time.");

            return Ok(tb);
        }

        #endregion
    }
}
