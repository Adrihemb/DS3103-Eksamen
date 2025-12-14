using System.ComponentModel.DataAnnotations;

namespace SportsWorld.Api.Models
{
    public class Finance
    {
        [Key]
        public int Id { get; set; }

        // Department name (e.g., "Men's Team", "Women's Team", "Youth Academy")
        public string Department { get; set; } = string.Empty;

        // Amount of money the department currently has
        public decimal MoneyLeft { get; set; }

        // How many athletes have been purchased by this department
        public int NumberOfPurchases { get; set; }

        // Total money spent by this department
        public decimal MoneySpent { get; set; }

        // Amount of money borrowed from the bank (debt) by this department
        public decimal AmountBorrowed { get; set; }
    }
}
