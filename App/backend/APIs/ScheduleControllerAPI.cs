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
        [HttpPost("tour/{tourCode}")]
        public async Task<ActionResult> AddTour(string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddTour(tourCode))
                return BadRequest("Unable to add tour.");

            return Ok();
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

            List<Tour> tours;
            if ((tours = await _controller.GetAllTours()).Count == 0)
                return BadRequest("Unable to get all tours.");

            return Ok(tours);
        }

        #endregion

        #region FAIR
        [HttpPost("fair/{fairCode}")]
        public async Task<ActionResult> AddFair(string fairCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddFair(fairCode))
                return BadRequest("Unable to add fair.");

            return Ok();
        }

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
            if ((fairs = await _controller.GetAllFairs()).Count == 0)
                return BadRequest("Unable to get all fairs.");

            return Ok(fairs);
        }

        #endregion

        #region SCHEDULE
        [HttpPost("schedule")]
        public async Task<ActionResult> AddTimeBlock(TimeBlock tb)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddTimeBlock(tb))
                return BadRequest("Unable to add timeblock.");

            return Ok();
        }

        [HttpPut("schedule")]
        public async Task<ActionResult> UpdateTimeBlock(TimeBlock tb)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateTimeBlock(tb))
                return BadRequest("Unable to update timeblock.");

            return Ok();
        }

        [HttpGet("schedule")]
        public async Task<ActionResult> GetTimeBlockByID(int timeBlockID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            TimeBlock? tb;
            if ((tb = await _controller.GetTimeBlock(timeBlockID)) == null)
                return NotFound("Unable to get timeblock by ID.");

            return Ok(tb);
        }

        [HttpGet("schedule/day")]
        public async Task<ActionResult> GetTimeBlockByTime(DateTime day, int timeBlockIndex)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            TimeBlock? tb;
            if ((tb = await _controller.GetTimeBlock(day, timeBlockIndex)) == null)
                return NotFound("Unable to get timeblock by time.");

            return Ok(tb);
        }

        [HttpGet("schedule/scheduled")]
        public async Task<ActionResult> GetScheduledTours(int timeBlockID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Tour[] scheduledTours;
            if((scheduledTours = await _controller.GetScheduledTours(timeBlockID)).Length == 0)
                return NotFound("Unable to get scheduled tours.");

            return Ok(scheduledTours);
        }

        [HttpGet("schedule/alternative")]
        public async Task<ActionResult> GetAlternativeTours(int timeBlockID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Tour[] scheduledTours;
            if ((scheduledTours = await _controller.GetAlternativeTours(timeBlockID)).Length == 0)
                return NotFound("Unable to get alternative tours.");

            return Ok(scheduledTours);
        }

        [HttpGet("schedule/regreq")]
        public async Task<ActionResult> GetAllTourRegistirationRequests()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<TourRegistirationRequest> scheduledTours;
            if ((scheduledTours = await _controller.GetAllTourRegistirationRequests()).Count == 0)
                return NotFound("Unable to get registiration requests.");

            return Ok(scheduledTours);
        }

        [HttpGet("schedule/regreqtime")]
        public async Task<ActionResult> GetTourRegistirationRequestsOf(int timeBlockID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            List<TourRegistirationRequest> scheduledTours;
            if ((scheduledTours = await _controller.GetTourRegistirationRequestsOf(timeBlockID)).Count == 0)
                return NotFound("Unable to get registiration requests.");

            return Ok(scheduledTours);
        }

        [HttpPost("schedule/regreq")]
        public async Task<ActionResult> RequestTour(int timeBlockID, Tour tour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RequestTour(timeBlockID, tour))
                return NotFound("Unable to get request tour.");

            return Ok();

        }

        [HttpPut("schedule/replace")]
        public async Task<ActionResult> AcceptAlternativeTour(int timeBlockID, string scheduledTourCode, string alternativeTourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AcceptAlternativeTour(timeBlockID, scheduledTourCode, alternativeTourCode))
                return BadRequest("Unable to accept alternative tour.");

            return Ok();
        }

        [HttpPost("schedule/tour")]
        public async Task<ActionResult> AcceptTour(int timeBlockID, string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AcceptTour(timeBlockID, tourCode))
                return BadRequest("Unable to add tour to timeblock.");

            return Ok();
        }

        [HttpDelete("schedule/tour")]
        public async Task<ActionResult> RemoveTour(int timeBlockID, string tourCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveTour(timeBlockID, tourCode))
                return BadRequest("Unable to remove tour from timeblock.");

            return Ok();
        }

        #endregion
    }
}
