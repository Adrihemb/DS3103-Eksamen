using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Controllers
{
    //REST API controller handling all venue operations
    [ApiController]
    [Route("api/[controller]")]
    public class VenueController : ControllerBase
    {
        private readonly SportsWorldContext _context;

        //Dependency injection of database context
        public VenueController(SportsWorldContext context)
        {
            _context = context;
        }

        //Retrieves complete list of venues from database
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venue>>> GetAllVenues()
        {
            var venues = await _context.Venues.ToListAsync();
            return Ok(venues);
        }

        //Fetches a specific venue using its unique identifier
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Venue>> GetVenueById(int id)
        {
            var venue = await _context.Venues.FindAsync(id);

            if (venue == null)
            {
                return NotFound();
            }

            return Ok(venue);
        }

        //Searches for venues matching the provided name (case-insensitive)
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Venue>>> GetByName([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name query is required.");
            }

            var venues = await _context.Venues
                .Where(v => v.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            return Ok(venues);
        }

        //Adds a new venue to the database
        [HttpPost]
        public async Task<ActionResult<Venue>> CreateVenue([FromBody] Venue venue)
        {
            _context.Venues.Add(venue);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVenueById), new { id = venue.Id }, venue);
        }

        //Updates existing venue properties
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateVenue(int id, [FromBody] Venue updated)
        {
            //Ensures URL parameter matches the venue being updated
            if (id != updated.Id)
            {
                return BadRequest("Id in URL and body must match.");
            }

            var existing = await _context.Venues.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            //Apply changes to venue properties
            existing.Name = updated.Name;
            existing.Capacity = updated.Capacity;
            existing.Image = updated.Image;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Removes a venue from the database permanently
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteVenue(int id)
        {
            var venue = await _context.Venues.FindAsync(id);
            if (venue == null)
            {
                return NotFound();
            }

            _context.Venues.Remove(venue);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
