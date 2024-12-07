using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Database;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CredentialController : ControllerBase
    {
        private readonly CredentialDatabaseController _controller;

        public CredentialController(CredentialDatabaseController controller) {
            _controller = controller;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Credential>), 200)]
        [ProducesResponseType(typeof(List<Credential>), 404)]
        public async Task<ActionResult> GetAllCredentials()
        {
            var creds = await _controller.GetAllCredentials();
            if (creds == null || creds.Count == 0) {
                return NotFound();
            }
            return Ok(creds);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            bool success = await _controller.Login(request.Username, request.Password);
            if (!success) {
                return BadRequest("Invalid username or password");
            }

            // For demonstration, we just return a success message.
            // In a real app, you'd return a JWT token or session info.
            return Ok("Login successful");
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            bool created = await _controller.Register(request.Username, request.Password);
            if (!created) {
                return BadRequest("Username already exists");
            }

            // Normally you'd return a location header or a token.
            return Created("", "User registered successfully");
        }

        [HttpPut("changepassword")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            bool changed = await _controller.ChangePassword(request.Username, request.OldPassword, request.NewPassword);
            if (!changed) {
                return BadRequest("Unable to change password. Check old password and username.");
            }

            return Ok(true);
        }
    }

    // DTOs for request bodies
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ChangePasswordRequest
    {
        public string Username { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}