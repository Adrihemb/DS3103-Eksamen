using System.ComponentModel.DataAnnotations;

namespace SportsWorld.Api.Models
{
    public class Athlete
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int Price { get; set; }

        [Required]
        public string Image { get; set; } = string.Empty;

        public bool PurchaseStatus { get; set; } = false;
    }
}
