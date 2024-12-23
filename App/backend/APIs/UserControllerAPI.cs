/// <summary>
/// This file contains the <see cref="UserController"/> class, which handles HTTP requests
/// related to user management operations in the system. The controller exposes various endpoints
/// for performing actions such as:
///
/// - User registration: Creating a new user and managing user registration requests.
/// - User retrieval: Fetching all users, filtered users by type, specific user details by ID,
///   and users associated with tours or fairs.
/// - User update: Modifying user details and updating user information.
/// - User deletion: Removing user registration requests or deleting user records.
/// - Guide availability management: Assigning available hours, responsible days, and handling
///   work hours for guides.
/// - Responsible advisors management: Retrieving a list of responsible advisors.
///
/// The controller communicates with a system database controller to perform these operations,
/// ensuring that the user data is managed properly. It also validates input and handles errors,
/// returning appropriate responses based on the outcome of each operation. HTTP response types,
/// including 200 (OK), 400 (Bad Request), and 404 (Not Found), are used to indicate success or failure.
/// </summary>
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    /// <summary>
    /// Controller that handles user-related operations such as registration, retrieving user lists,
    /// and managing user registration requests. It interacts with the SystemDatabaseController to fetch user data.
    /// Constraints:
    /// - This controller works with the SystemDatabaseController for database interactions.
    /// </summary>
    [ApiController]
    [Route("/api/user")]
    public class UserController : ControllerBase
    {
        private readonly SystemDatabaseController _controller;

        /// <summary>
        /// Initializes a new instance of the UserController class.
        /// </summary>
        /// <param name="controller">An instance of SystemDatabaseController used for database operations related to users.</param>
        public UserController(SystemDatabaseController controller)
        {
            _controller = controller;
        }

        /// <summary>
        /// Registers a new user in the system based on the provided registration request.
        /// </summary>
        /// <param name="request">The registration request containing user information.</param>
        /// <returns>Returns a status of the registration process (success or failure).</returns>
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

        /// <summary>
        /// Retrieves a list of all user registration requests with a "Pending" status.
        /// </summary>
        /// <returns>A list of users with a "Pending" status or a 404 if no users are found.</returns>
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

        /// <summary>
        /// Deletes a user registration request based on the provided UID.
        /// </summary>
        /// <param name="UID">The unique identifier of the user to delete.</param>
        /// <returns>A success or failure status of the deletion operation.</returns>
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

        /// <summary>
        /// Retrieves a list of all available majors from the system.
        /// </summary>
        /// <returns>A list of majors available in the system.</returns>
        [HttpGet("majors")]
        public IActionResult GetCities()
        {
            return Ok(_controller.GetAllMajors());
        }

        /// <summary>
        /// Retrieves a list of all users in the system.
        /// </summary>
        /// <returns>A list of users or a 404 if no users are found.</returns>
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

        /// <summary>
        /// Retrieves a filtered list of users based on the provided user type (e.g., Pending, Active).
        /// </summary>
        /// <param name="userType">The type of users to filter (e.g., Pending, Active).</param>
        /// <returns>A list of filtered users or a 404 if no users are found.</returns>
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

        /// <summary>
        /// Retrieves a specific user based on the provided user ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user to retrieve.</param>
        /// <returns>The user with the specified ID, or a 404 if the user is not found.</returns>
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

        /// <summary>
        /// Retrieves the tour details for a specific user based on the provided user ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user.</param>
        /// <returns>The tour details of the user, or a 404 if no tour is found for the user.</returns>
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

        /// <summary>
        /// Retrieves the fair details for a specific user based on the provided user ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user.</param>
        /// <returns>The fair details of the user, or a 404 if no fair is found for the user.</returns>
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

        /// <summary>
        /// Adds a new user to the system based on the provided user creation data.
        /// </summary>
        /// <param name="UserCreate">The user creation data to add the new user.</param>
        /// <returns>A result indicating the success or failure of the user creation operation.</returns>
        [HttpPost()]
        public async Task<ActionResult> AddUser([FromBody] UserCreate UserCreate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AddUserAsync(UserCreate);

            if (string.IsNullOrEmpty(result))
            {
                return BadRequest("User already exists");
            }
            return Ok(result);
        }

        /// <summary>
        /// Updates an existing user's information based on the provided user edit data.
        /// </summary>
        /// <param name="userEdit">The user edit data to update the user information.</param>
        /// <returns>A result indicating the success or failure of the user update operation.</returns>
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

        /// <summary>
        /// Deletes a specific user based on the provided user ID.
        /// </summary>
        /// <param name="id">The unique identifier of the user to delete.</param>
        /// <returns>A success or failure status of the delete operation.</returns>
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

        /// <summary>
        /// Adds available hours to the specified guide based on the provided user ID and availability.
        /// </summary>
        /// <param name="userID">The unique identifier of the user (guide) to add available hours for.</param>
        /// <param name="availability">The availability details for the guide.</param>
        /// <returns>A result indicating the success or failure of adding available hours to the guide.</returns>
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

        /// <summary>
        /// Changes the responsible day for a specific user based on the provided user ID and day.
        /// </summary>
        /// <param name="userID">The unique identifier of the user to change the responsible day for.</param>
        /// <param name="day">The day of the week to assign as the responsible day.</param>
        /// <returns>A result indicating the success or failure of changing the responsible day for the user.</returns>
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

        /// <summary>
        /// Retrieves the tours a specific user is responsible for based on the provided user ID.
        /// </summary>
        /// <param name="userID">The unique identifier of the user to retrieve responsible tours for.</param>
        /// <returns>The list of tours the user is responsible for, or a 400 if no tours are found.</returns>
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

        /// <summary>
        /// Deletes the available hours for a specific guide based on the provided user ID and availability.
        /// </summary>
        /// <param name="userID">The unique identifier of the user (guide) to delete available hours for.</param>
        /// <param name="availability">The availability details to remove from the guide's schedule.</param>
        /// <returns>A result indicating the success or failure of removing available hours from the guide.</returns>
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

        /// <summary>
        /// Adds work hours to a specific user based on the provided user ID and work hours amount.
        /// </summary>
        /// <param name="userID">The unique identifier of the user to add work hours for.</param>
        /// <param name="amount">The number of work hours to add to the user.</param>
        /// <returns>A result indicating the success or failure of adding work hours to the user.</returns>
        [HttpPut("{userID}/workhours/{amount}")]
        public async Task<ActionResult> AddWorkHoursToUser(int userID, int amount)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.AddWorkHoursToUser(userID, amount);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Retrieves the responsible advisors in the system.
        /// </summary>
        /// <returns>A list of responsible advisors, or a 400 if no responsible advisors are found.</returns>
        [HttpGet("responsibleadvisors")]
        public async Task<ActionResult> GetResponsibleAdvisors()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _controller.GetResponsibleAdvisors();

            return Ok(result);
        }
    }
}
