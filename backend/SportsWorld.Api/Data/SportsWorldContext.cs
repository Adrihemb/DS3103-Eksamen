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
                    Name = "Bård Finne",
                    Gender = "Male",
                    Price = 100,
                    Image = "finne.jpg",
                    PurchaseStatus = false,
                    Position = "Goalkeeper",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 2,
                    Name = "Aron Eggert Gudmunsson",
                    Gender = "Male",
                    Price = 95,
                    Image = "eggert.jpg",
                    PurchaseStatus = false,
                    Position = "Defender",
                    Nationality = "Iceland"
                },
                new Athlete
                {
                    Id = 3,
                    Name = "Mads Sande",
                    Gender = "Male",
                    Price = 90,
                    Image = "sande.jpg",
                    PurchaseStatus = false,
                    Position = "Midfielder",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 4,
                    Name = "Ulrik Mathisen",
                    Gender = "Male",
                    Price = 92,
                    Image = "ulrik.jpg",
                    PurchaseStatus = false,
                    Position = "Forward",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 5,
                    Name = "Eivind Helland",
                    Gender = "Male",
                    Price = 88,
                    Image = "helland.jpg",
                    PurchaseStatus = false,
                    Position = "Defender",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 6,
                    Name = "Mathias Dyngeland",
                    Gender = "Male",
                    Price = 89,
                    Image = "dyngeland.jpg",
                    PurchaseStatus = false,
                    Position = "Midfielder",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 7,
                    Name = "Jonas Torsvik",
                    Gender = "Male",
                    Price = 87,
                    Image = "jonas.jpg",
                    PurchaseStatus = false,
                    Position = "Forward",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 8,
                    Name = "Felix Horn Myhre",
                    Gender = "Male",
                    Price = 93,
                    Image = "horn.jpg",
                    PurchaseStatus = false,
                    Position = "Defender",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 9,
                    Name = "Oskar De Roewe",
                    Gender = "Male",
                    Price = 85,
                    Image = "deroeve.jpg",
                    PurchaseStatus = false,
                    Position = "Forward",
                    Nationality = "Norway"
                },
                new Athlete
                {
                    Id = 10,
                    Name = "Sverre Holm",
                    Gender = "Male",
                    Price = 91,
                    Image = "holm.jpg",
                    PurchaseStatus = false,
                    Position = "Midfielder",
                    Nationality = "Norway"
                }
            );

            modelBuilder.Entity<Venue>().HasData(
                new Venue
                {
                    Id = 1,
                    Name = "Old Trafford",
                    Capacity = 75000,
                    Image = "old-trafford.jpg"
                },
                new Venue
                {
                    Id = 2,
                    Name = "Anfield",
                    Capacity = 54000,
                    Image = "anfield.jpg"
                },
                new Venue
                {
                    Id = 3,
                    Name = "Emirates Stadium",
                    Capacity = 60000,
                    Image = "emirates-stadium.jpg"
                },
                new Venue
                {
                    Id = 4,
                    Name = "Etihad Stadium",
                    Capacity = 53000,
                    Image = "etihad-stadium.jpg"
                },
                new Venue
                {
                    Id = 5,
                    Name = "Tottenham Hotspur Stadium",
                    Capacity = 62000,
                    Image = "tottenham-hotspur-stadium.jpg"
                },
                new Venue
                {
                    Id = 6,
                    Name = "London Stadium",
                    Capacity = 62000,
                    Image = "london-stadium.jpg"
                },
                new Venue
                {
                    Id = 7,
                    Name = "Villa Park",
                    Capacity = 42000,
                    Image = "villa-park.jpg"
                },
                new Venue
                {
                    Id = 8,
                    Name = "St James' Park",
                    Capacity = 52000,
                    Image = "st-james-park.jpg"
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
