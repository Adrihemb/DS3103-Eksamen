namespace SportsWorld.Api.Models.Interfaces
{
    public interface IVenue
    {
        int Id { get; set; }
        string Name { get; set; }
        int Capacity { get; set; }
        string Image { get; set; }
    }
}
