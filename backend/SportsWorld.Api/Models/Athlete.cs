using System.ComponentModel.DataAnnotations;

namespace SportsWorld.Api.Models
{
    /// <summary>
    /// Athlete - Database model for athlete entities
    /// 
    /// Represents a sports athlete that can be purchased and managed
    /// Properties include basic info (name, gender, price) and optional details (position, nationality)
    /// </summary>
    public class Athlete
    {
        /// <summary>
        /// Unique identifier for the athlete
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Athlete's full name
        /// </summary>
        [Required]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Athlete's gender (e.g., "Male", "Female", "Other")
        /// </summary>
        [Required]
        public string Gender { get; set; } = string.Empty;

        /// <summary>
        /// Price or value of the athlete (in coins)
        /// Must be non-negative
        /// </summary>
        [Range(0, int.MaxValue)]
        public int Price { get; set; }

        /// <summary>
        /// File name of the athlete's image
        /// Stored as the file name only, full path constructed on frontend
        /// </summary>
        [Required]
        public string Image { get; set; } = string.Empty;

        /// <summary>
        /// Whether the athlete has been purchased
        /// Default: false (available for purchase)
        /// </summary>
        public bool PurchaseStatus { get; set; } = false;

        /// <summary>
        /// Optional sports position (e.g., "Forward", "Goalkeeper", "Midfielder")
        /// </summary>
        public string Position { get; set; } = string.Empty;

        /// <summary>
        /// Optional athlete's nationality (e.g., "Norway", "Brazil", "Germany")
        /// </summary>
        public string Nationality { get; set; } = string.Empty;
    }
}
