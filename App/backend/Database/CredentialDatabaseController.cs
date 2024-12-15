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
    public class CredentialDatabaseController
    {
        private readonly CredentialDbContext _context;
        private readonly ILogger _logger;

        public CredentialDatabaseController(
            CredentialDbContext context,
            ILoggerFactory loggerFactory
        )
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("CredentialController");
        }

        public async Task<List<Credential>> GetAllCredentials()
        {
            return await _context.Credentials.OrderBy(c => c.Username).ToListAsync();
        }

        public async Task<UserType> GetUserRoleByUserName(string username)
        {
            var user = await _context.Credentials.SingleOrDefaultAsync(c => c.Username == username);
            if (user == null)
            {
                return UserType.Invalid;
            }
            return user.UserType;
        }

        public async Task<bool> Login(string username, string plainPassword)
        {
            var creds = await _context.Credentials.SingleOrDefaultAsync(c =>
                c.Username == username
            );
            if (creds == null)
            {
                return false;
            }
            if (creds.VerifyLogin(plainPassword))
            {
                return true;
            }
            return false;
        }

        public async Task<bool> Register(string username, string plainPassword, UserType userType)
        {
            bool userExists = await _context.Credentials.AnyAsync(c => c.Username == username);
            if (userExists)
            {
                return false;
            }

            var newCreds = new Credential(username, plainPassword, userType);

            _context.Add(newCreds);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (System.Exception exp)
            {
                _logger.LogError($"Error in {nameof(Register)}: " + exp.Message);
            }

            return true;
        }

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
