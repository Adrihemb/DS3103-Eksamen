using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Data
{
    public class SportsWorldContext : DbContext
    {
        public SportsWorldContext(DbContextOptions<SportsWorldContext> options) : base(options){}

        public DbSet<Athlete> Athletes { get; set; } = null!;
        public DbSet<Venue> Venues { get; set; } = null!;
        public DbSet<Finance> Finances { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Athlete>().HasData(
                new Athlete
                {
                    Id = 1,
                    Name = "Lionel Messi",
                    Gender = "Male",
                    Price = 100,
                    Image = "https://example.com/messi.jpg",
                    PurchaseStatus = false
                },
                new Athlete
                {
                    Id = 2,
                    Name = "Cristiano Ronaldo",
                    Gender = "Male",
                    Price = 95,
                    Image = "https://example.com/ronaldo.jpg",
                    PurchaseStatus = false
                },
                new Athlete
                {
                    Id = 3,
                    Name = "Erling Haaland",
                    Gender = "Male",
                    Price = 90,
                    Image = "https://example.com/haaland.jpg",
                    PurchaseStatus = false
                },
                new Athlete
                {
                    Id = 4,
                    Name = "Kylian Mbappé",
                    Gender = "Male",
                    Price = 92,
                    Image = "https://example.com/mbappe.jpg",
                    PurchaseStatus = false
                },
                new Athlete
                {
                    Id = 5,
                    Name = "Ada Hegerberg",
                    Gender = "Female",
                    Price = 88,
                    Image = "https://example.com/ada-hegerberg.jpg",
                    PurchaseStatus = false
                },
                new Athlete
                {
                    Id = 6,
                    Name = "Alexia Putellas",
                    Gender = "Female",
                    Price = 89,
                    Image = "https://example.com/alexia.jpg",
                    PurchaseStatus = false
                }
            );

            modelBuilder.Entity<Venue>().HasData(
                new Venue
                {
                    Id = 1,
                    Name = "Wembley Stadium",
                    Capacity = 90000,
                    Image = "https://example.com/wembley.jpg"
                },
                new Venue
                {
                    Id = 2,
                    Name = "Camp Nou",
                    Capacity = 99354,
                    Image = "https://example.com/campnou.jpg"
                },
                new Venue
                {
                    Id = 3,
                    Name = "Old Trafford",
                    Capacity = 74310,
                    Image = "https://example.com/oldtrafford.jpg"
                }
            );

            modelBuilder.Entity<Finance>().HasData(
                new Finance
                {
                    Id = 1,
                    MoneyLeft = 1000,
                    NumberOfPurchases = 0,
                    MoneySpent = 0,
                    AmountBorrowed = 0
                }
            );
        }
    }
}
