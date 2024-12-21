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

        [HttpGet("{id}", Name = "GetUsersRoute")]
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

        [HttpPost()]
        public async Task<ActionResult> AddUser([FromBody] UserCreate UserCreate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AddUserAsync(UserCreate);
            switch (result)
            {
                case ErrorTypes.InvalidUserName:
                    return BadRequest(new { message = "Invalid user name." });

                case ErrorTypes.InvalidMail:
                    return BadRequest(new { message = "Invalid email address." });

                case ErrorTypes.InvalidSurname:
                    return BadRequest(new { message = "Invalid surname." });

                case ErrorTypes.UserAlreadyExists:
                    return Conflict(new { message = "User already exists." });

                case ErrorTypes.Success:
                    return Ok();

                default:
                    return StatusCode(500, new { message = "An unexpected error occurred." }); // 500 Internal Server Error
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(bool), 400)]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var status = await _controller.UpdateUserAsync(user);
            if (!status)
            {
                return BadRequest("Unable to update user");
            }
            return Ok(status);
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
    }
}
