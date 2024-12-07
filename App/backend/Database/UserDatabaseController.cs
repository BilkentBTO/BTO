using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;
using backend.Models;
using backend.Database;

namespace backend.Database
{
    public class UserDatabaseController
    {

        private readonly UserDbContext _context;
        private readonly ILogger _logger;

        public UserDatabaseController(UserDbContext context, ILoggerFactory loggerFactory) {
          _context = context;
          _logger = loggerFactory.CreateLogger("UserController");
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<User> GetUserAsync(int id)
        {
            return await _context.Users.SingleOrDefaultAsync(c => c.id == id);
        }

        public async Task<User> InsertUserAsync(User user)
        {
            _context.Add(user);
            try
            {
              await _context.SaveChangesAsync();
            }
            catch (System.Exception exp)
            {
               _logger.LogError($"Error in {nameof(InsertUserAsync)}: " + exp.Message);
            }

            return user;
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            _context.Users.Attach(user);
            _context.Entry(user).State = EntityState.Modified;
            try
            {
              return (await _context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (Exception exp)
            {
               _logger.LogError($"Error in {nameof(UpdateUserAsync)}: " + exp.Message);
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(c => c.id == id);

            _ = _context.Remove(user);
            
            try
            {
              return (await _context.SaveChangesAsync() > 0 ? true : false);
            }
            catch (System.Exception exp)
            {
               _logger.LogError($"Error in {nameof(DeleteUserAsync)}: " + exp.Message);
            }
            return false;
        }

    }
}