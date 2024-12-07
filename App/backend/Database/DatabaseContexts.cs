using Microsoft.EntityFrameworkCore;
using backend.Models;
namespace backend.Database{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }
    }

    public class CredentialDbContext : DbContext
    {
        public DbSet<Credential> Credentials { get; set; }
        public CredentialDbContext(DbContextOptions<CredentialDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Credential>()
                .HasKey(c => c.Username);
        }
    }
}