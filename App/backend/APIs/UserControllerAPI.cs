using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("/api/user")]
    public class UserController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        public UserController(SystemDatabaseController controller)
        {
            _controller = controller;
        }

        [HttpPost("register")]
        public async Task<ActionResult> UserRegistration([FromBody] UserCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _controller.MakeUserRegistrationRequest(request);
            if (!success)
            {
                return BadRequest("Unable to make request. Try again later.");
            }
            return Ok(success);
        }

        [HttpGet("register")]
        [ProducesResponseType(typeof(List<User>), 200)]
        [ProducesResponseType(typeof(List<User>), 404)]
        public async Task<ActionResult> GetAllUserRegisters()
        {
            var userType = UserType.Pending;
            var users = await _controller.GetUserFilteredAsync(userType);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        [HttpDelete("register/{UID}")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(bool), 404)]
        public async Task<ActionResult> DeleteUserRegisterRequest(int UID)
        {
            var status = await _controller.DeleteUserRegisterRequestAsync(UID);
            if (!status)
            {
                return NotFound();
            }
            return Ok(status);
        }

        [HttpGet("majors")]
        public IActionResult GetCities()
        {
            return Ok(_controller.GetAllMajors());
        }

        [HttpGet()]
        //[Authorize(Policy = "Admin&Coordinator")]
        [ProducesResponseType(typeof(List<User>), 200)]
        [ProducesResponseType(typeof(List<User>), 404)]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _controller.GetUsersAsync();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        [HttpGet("filter/{userType}")]
        //[Authorize(Policy = "Admin&Coordinator")]
        [ProducesResponseType(typeof(List<User>), 200)]
        [ProducesResponseType(typeof(List<User>), 404)]
        public async Task<ActionResult> GetAllUsersFiltered(UserType userType)
        {
            var users = await _controller.GetUserFilteredAsync(userType);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        [HttpGet("{id}")]
        //[Authorize(Policy = "Admin&Coordinator")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(typeof(User), 404)]
        public async Task<ActionResult> GetUserByID(int id)
        {
            var customer = await _controller.GetUserAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpGet("{id}/tour")]
        //[Authorize(Policy = "Admin&Coordinator")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(typeof(User), 404)]
        public async Task<ActionResult> GetTourOfUser(int id)
        {
            var customer = await _controller.GetTourOfUser(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpGet("{id}/fair")]
        //[Authorize(Policy = "Admin&Coordinator")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(typeof(User), 404)]
        public async Task<ActionResult> GetFairOfUser(int id)
        {
            var customer = await _controller.GetFairOfUser(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpPost()]
        public async Task<ActionResult> AddUser([FromBody] UserCreate UserCreate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AddUserAsync(UserCreate);
            return ErrorHandler.HandleError(result);
        }

        [HttpPut()]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(bool), 400)]
        public async Task<ActionResult> UpdateUser([FromBody] UserEdit userEdit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var status = await _controller.UpdateUserAsync(userEdit);

            return ErrorHandler.HandleError(status);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(bool), 404)]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var status = await _controller.DeleteUserAsync(id);
            if (!status)
            {
                return NotFound();
            }
            return Ok(status);
        }

        [HttpPost("{userID}/hours")]
        public async Task<ActionResult> AddAvailableHoursToGuide(
            int userID,
            [FromBody] UserAvailableHours availability
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AddAvailableHoursToGuide(userID, availability);

            return ErrorHandler.HandleError(result);
        }

        [HttpPut("{userID}/responsibleday/{day}")]
        public async Task<ActionResult> ChangeResponsibleDay(int userID, DayOfWeek day)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.ChangeResponsibleDayOfUser(userID, day);

            return ErrorHandler.HandleError(result);
        }

        [HttpGet("{userID}/responsibletours")]
        public async Task<ActionResult> GetResponsibleTours(int userID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetResponsibleToursOfUser(userID);

            return Ok(result);
        }

        [HttpDelete("{userID}/hours")]
        public async Task<ActionResult> DeleteAvailableHoursFromGuide(
            int userID,
            [FromBody] UserAvailableHours availability
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.RemoveAvailableHoursFromGuide(userID, availability);

            return ErrorHandler.HandleError(result);
        }
    }
}
