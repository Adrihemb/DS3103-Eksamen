using SportsWorld.Api.Models.Interfaces;

namespace SportsWorld.Api.Models
{
    public class Venue : IVenue
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Image { get; set; } = string.Empty;
    }
}
