using Microsoft.EntityFrameworkCore;
using backend.Models;
namespace backend.Database{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }
    }
}