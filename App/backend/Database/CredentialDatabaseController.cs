/// <summary>
/// The <see cref="CredentialDatabaseController"/> class is responsible for managing user credential-related
/// operations within the system's database. It provides methods to:
/// 
/// - Retrieve all user credentials, ordered by username.
/// - Get a user's credential role by their username.
/// - Handle user login, verifying username and password correctness.
/// - Change a user's password, ensuring that the old password is correct before updating.
/// 
/// The class interacts with the <see cref="SystemDbContext"/> for database access and the <see cref="ILogger"/>
/// for logging purposes. It ensures that user credentials are securely managed, logging errors when necessary.
/// </summary>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Database;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Database
{
    /// <summary>
    /// Handles operations related to user credentials in the database, including retrieving credentials, verifying login,
    /// and changing passwords. It uses <see cref="SystemDbContext"/> for database access and <see cref="ILogger"/> for logging.
    /// </summary>
    public class CredentialDatabaseController
    {
        private readonly SystemDbContext _context;
        private readonly ILogger _logger;

        public CredentialDatabaseController(SystemDbContext context, ILoggerFactory loggerFactory)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("CredentialController");
        }

        /// <summary>
        /// Retrieves all user credentials from the database, ordered by username.
        /// </summary>
        /// <returns>A list of <see cref="Credential"/> objects representing all user credentials in the system.</returns>
        public async Task<List<Credential>> GetAllCredentials()
        {
            return await _context.Credentials.OrderBy(c => c.Username).ToListAsync();
        }

        /// <summary>
        /// Retrieves a user's credential role by their username. Returns null if no user with the provided username exists.
        /// </summary>
        /// <param name="username">The username of the user whose credentials are being retrieved.</param>
        /// <returns>A <see cref="Credential"/> object representing the user's credentials, or null if the user does not exist.</returns>
        public async Task<Credential?> GetCredentialRoleByUserName(string username)
        {
            var user = await _context.Credentials.SingleOrDefaultAsync(c => c.Username == username);
            if (user == null)
            {
                return null;
            }
            return user;
        }

        /// <summary>
        /// Verifies the login credentials of a user by checking the username and password.
        /// </summary>
        /// <param name="username">The username of the user attempting to log in.</param>
        /// <param name="plainPassword">The password provided by the user.</param>
        /// <returns>A <see cref="LoginStatus"/> indicating the result of the login attempt, such as success, wrong username, or wrong password.</returns>
        public async Task<LoginStatus> Login(string username, string plainPassword)
        {
            var creds = await _context.Credentials.SingleOrDefaultAsync(c =>
                c.Username == username
            );
            if (creds == null)
            {
                return LoginStatus.WrongUsername;
            }
            if (!creds.VerifyLogin(plainPassword))
            {
                return LoginStatus.WrongPassword;
            }
            return LoginStatus.Success;
        }

        /// <summary>
        /// Changes the password of a user, verifying the old password before updating it.
        /// </summary>
        /// <param name="username">The username of the user whose password is being changed.</param>
        /// <param name="oldPlainPassword">The user's current (old) password.</param>
        /// <param name="plainPassword">The new password to set for the user.</param>
        /// <returns>True if the password was successfully changed, otherwise false.</returns>
        /// <exception cref="Exception">Logs and returns false if an error occurs during the password change process.</exception>
        public async Task<bool> ChangePassword(
            string username,
            string oldPlainPassword,
            string plainPassword
        )
        {
            bool userExists = await _context.Credentials.AnyAsync(c => c.Username == username);
            if (!userExists)
            {
                return false;
            }
            var creds = await _context.Credentials.SingleOrDefaultAsync(c =>
                c.Username == username
            );

            if (creds == null)
            {
                return false;
            }

            creds.ChangePassword(username, oldPlainPassword, plainPassword);

            _context.Credentials.Attach(creds);
            _context.Entry(creds).State = EntityState.Modified;
            try
            {
                return (await _context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(ChangePassword)}: " + exp.Message);
            }
            return false;
        }
    }
}
