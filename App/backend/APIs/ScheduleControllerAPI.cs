using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleDatabaseController _controller;

        public ScheduleController(ScheduleDatabaseController controller)
        {
            _controller = controller;
        }

        #region TOUR
        [HttpPost]
        public async Task<ActionResult> AddTour([FromBody] Tour tour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddTour(tour))
                return BadRequest("Unable to add tour.");

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveTour(int tourID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveTour(tourID))
                return NotFound();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> GetTourByID(int tourID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Tour? tour;
            if ((tour = await _controller.GetTour(tourID)) == null)
                return NotFound();

            return Ok(tour);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateTour(Tour tour)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateTourInfo(tour))
                return BadRequest();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> GetAllTours()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Tour[] tours;
            if ((tours = await _controller.GetAllTours()) == null)
                return BadRequest();

            return Ok(tours);
        }

        #endregion

        #region FAIR
        [HttpPost]
        public async Task<ActionResult> AddFair([FromBody] Fair fair)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.AddFair(fair))
                return BadRequest("Unable to add fair.");

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveFair(int fairID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.RemoveFair(fairID))
                return NotFound();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> GetFairByID(int fairID)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Fair? fair;
            if ((fair = await _controller.GetFair(fairID)) == null)
                return NotFound();

            return Ok(fair);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateFair(Fair fair)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _controller.UpdateFairInfo(fair))
                return BadRequest();

            return Ok();
        }
        [HttpGet]
        public async Task<ActionResult> GetAllFairs()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Fair[] fairs;
            if ((fairs = await _controller.GetAllFairs()) == null)
                return BadRequest();

            return Ok(fairs);
        }

        #endregion


        #region SCHEDULE
        // WILL BE IMPLEMENTED AFTER CHANGING HOW TIMEBLOCK & SCHEDULES WORK
        #endregion
    }
}
