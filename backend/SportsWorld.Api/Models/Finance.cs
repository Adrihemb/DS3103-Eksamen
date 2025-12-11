<<<<<<< HEAD
using System.ComponentModel.DataAnnotations;

namespace SportsWorld.Api.Models
{
    public class Finance
    {
        [Key]
        public int Id { get; set; }

        // Amount of money the company currently has
        public decimal MoneyLeft { get; set; }

        // How many athletes have been purchased
        public int NumberOfPurchases { get; set; }

        // Total money spent so far
        public decimal MoneySpent { get; set; }

        // Amount of money borrowed from the bank (debt)
        public decimal AmountBorrowed { get; set; }
    }
}
=======
using System.ComponentModel.DataAnnotations;

namespace SportsWorld.Api.Models
{
    public class Finance
    {
        [Key]
        public int Id { get; set; }

        // Amount of money the company currently has
        public decimal MoneyLeft { get; set; }

        // How many athletes have been purchased
        public int NumberOfPurchases { get; set; }

        // Total money spent so far
        public decimal MoneySpent { get; set; }
    }
}
>>>>>>> 4b8de206eaac6cd1dc0b304e2c393bd0539318e8
