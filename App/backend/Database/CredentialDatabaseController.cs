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
        private readonly SystemDbContext _context;
        private readonly ILogger _logger;

        public CredentialDatabaseController(SystemDbContext context, ILoggerFactory loggerFactory)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("CredentialController");
        }

        public async Task<List<Credential>> GetAllCredentials()
        {
            return await _context.Credentials.OrderBy(c => c.Username).ToListAsync();
        }

        public async Task<Credential?> GetCredentialRoleByUserName(string username)
        {
            var user = await _context.Credentials.SingleOrDefaultAsync(c => c.Username == username);
            if (user == null)
            {
                return null;
            }
            return user;
        }

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
