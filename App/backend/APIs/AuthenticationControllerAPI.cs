using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CredentialController : ControllerBase
    {
        private readonly CredentialDatabaseController _controller;
        private readonly IConfiguration _configuration;

        public CredentialController(
            CredentialDatabaseController controller,
            IConfiguration configuration
        )
        {
            _controller = controller;
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(List<Credential>), 200)]
        [ProducesResponseType(typeof(List<Credential>), 404)]
        public async Task<ActionResult> GetAllCredentials()
        {
            var creds = await _controller.GetAllCredentials();
            if (creds == null || creds.Count == 0)
            {
                return NotFound();
            }
            return Ok(creds);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            LoginStatus success = await _controller.Login(request.Username, request.Password);
            if (success != LoginStatus.Success)
            {
                return Unauthorized("Invalid username or password");
            }

            var token = await GenerateJwtToken(request.Username);

            return Ok(token);
        }

        [HttpPost("register")]
        [Authorize(Policy = "Admin&Coordinator")]
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool created = await _controller.Register(
                request.Username,
                request.Password,
                request.userType
            );
            if (!created)
            {
                return BadRequest("Username already exists");
            }

            return Created("", "User registered successfully");
        }

        [HttpPut("changepassword")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool changed = await _controller.ChangePassword(
                request.Username,
                request.OldPassword,
                request.NewPassword
            );
            if (!changed)
            {
                return BadRequest("Unable to change password. Check old password and username.");
            }

            return Ok(true);
        }

        private async Task<string> GenerateJwtToken(string username)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings.GetValue<string>("Key");
            var issuer = jwtSettings.GetValue<string>("Issuer");
            var audience = jwtSettings.GetValue<string>("Audience");
            var expiresInMinutes = jwtSettings.GetValue<int>("ExpiresInMinutes");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            UserType userRole = await _controller.GetUserRoleByUserName(username);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, userRole.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserType userType { get; set; } = UserType.Invalid;
    }

    public class ChangePasswordRequest
    {
        public string Username { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
