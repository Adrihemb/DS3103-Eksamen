using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Data
{
    public class SportsWorldContext : DbContext
    {
        public SportsWorldContext(DbContextOptions<SportsWorldContext> options)
            : base(options)
        {
        }

        public DbSet<Athlete> Athletes { get; set; } = null!;
        public DbSet<Venue> Venues { get; set; } = null!;
        public DbSet<Finance> Finances { get; set; } = null!;
    }
}
