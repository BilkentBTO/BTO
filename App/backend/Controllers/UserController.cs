using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Database;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : ControllerBase
    {
        UserDatabaseController _controller;
        public UserController(UserDatabaseController controller) {
          _controller = controller;
        }

        [HttpGet()]
        [ProducesResponseType(typeof(List<User>), 200)]
        [ProducesResponseType(typeof(List<User>), 404)]
        public async Task<ActionResult> GetAllUsers()
        {
            var customers = await _controller.GetUsersAsync();
            if (customers == null) {
              return NotFound();
            }
            return Ok(customers);
        }

        [HttpGet("{id}", Name = "GetUsersRoute")]
        [ProducesResponseType(typeof(User), 200)]
        [ProducesResponseType(typeof(User), 404)]
        public async Task<ActionResult> GetUserByID(int id)
        {
            var customer = await _controller.GetUserAsync(id);
            if (customer == null) {
              return NotFound();
            }
            return Ok(customer);
        }

        [HttpPost()]
        [ProducesResponseType(typeof(User), 201)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> CreateUser([FromBody]User user)
        {
          if (!ModelState.IsValid) {
            return BadRequest(ModelState);
          }

          var newUser = await _controller.InsertUserAsync(user);
          if (newUser == null) {
            return BadRequest("Unable to insert user");
          }
          return CreatedAtRoute("GetUsersRoute", new { id = newUser.id}, newUser);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(bool), 400)]
        public async Task<ActionResult> UpdateUser(int id, [FromBody]User user)
        {
          if (!ModelState.IsValid) {
            return BadRequest(ModelState);
          }

          var status = await _controller.UpdateUserAsync(user);
          if (!status) {
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
          if (!status) {
            return NotFound();
          }
          return Ok(status);
        }
    }
}
