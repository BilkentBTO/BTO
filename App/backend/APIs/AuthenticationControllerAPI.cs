/// <summary>
/// This file contains the `CredentialController` class, which handles the API requests related to user credentials.
/// It provides actions for login, changing passwords, and retrieving all credentials.
/// The controller interacts with the `CredentialDatabaseController` to manage credential data and uses JWT for authentication.
/// </summary>
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
    /// <summary>
    /// This controller handles the API requests for managing user credentials, including login and password change functionalities.
    /// It interacts with the `CredentialDatabaseController` to retrieve, verify, and update credentials.
    /// Constraints:
    /// - The `CredentialDatabaseController` context must be provided during the controller's initialization.
    /// - The `IConfiguration` context is required to access the configuration settings, such as JWT token generation parameters.
    /// - The controller supports routes for credential operations like login, changing passwords, and fetching all credentials.
    /// </summary>
    [ApiController]
    [Route("/api/credential")]
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

        /// <summary>
        /// Handles the HTTP GET request to retrieve all credentials from the database.
        /// Validates the model state before fetching the credentials. Returns a `404 Not Found` if no credentials are found.
        /// </summary>
        [HttpGet]
        //[Authorize(Policy = "AdminOnly")]
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

        /// <summary>
        /// Handles the HTTP POST request for logging in a user with the provided username and password.
        /// If the login credentials are valid, a JWT token is generated and returned to the user.
        /// If the login fails, an `Unauthorized` status is returned with an error message.
        /// </summary>
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

        /// <summary>
        /// Handles the HTTP PUT request to change a user's password.
        /// Validates the model state and checks whether the old password is correct.
        /// If the password change is successful, an `OK` status is returned; otherwise, a `BadRequest` error is returned.
        /// </summary>
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

        /// <summary>
        /// Generates a JWT token for the given username, encoding user claims such as username, UID, and user type.
        /// The token is signed using the secret key from the configuration settings and is valid for the duration specified in the configuration.
        /// </summary>
        private async Task<string> GenerateJwtToken(string username)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings.GetValue<string>("Key");
            var issuer = jwtSettings.GetValue<string>("Issuer");
            var audience = jwtSettings.GetValue<string>("Audience");
            var expiresInMinutes = jwtSettings.GetValue<int>("ExpiresInMinutes");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            Credential? credential = await _controller.GetCredentialRoleByUserName(username);
            if (credential == null || string.IsNullOrEmpty(credential.Username))
            {
                return "";
            }
            var claims = new[]
            {
                new Claim("Username", credential.Username),
                new Claim("UID", credential.UID.ToString()),
                new Claim("UserType", credential.UserType.ToString()),
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

    /// <summary>
    /// Represents the request payload for logging in a user, including username and password.
    /// Constraints:
    /// - The `Username` property cannot be empty.
    /// - The `Password` property must be a valid password for authentication.
    /// </summary>
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// Represents the request payload for changing a user's password, including the username, old password, and new password.
    /// Constraints:
    /// - The `Username` property cannot be empty.
    /// - The `OldPassword` property must be the current password for the user.
    /// - The `NewPassword` property must meet the password policy requirements for the system.
    /// </summary>
    public class ChangePasswordRequest
    {
        public string Username { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
