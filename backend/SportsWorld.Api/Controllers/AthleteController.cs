using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Controllers
{
    /// <summary>
    /// AthleteController - REST API endpoints for athlete management
    /// 
    /// Handles CRUD operations for athletes:
    /// - GET: Retrieve all athletes or a specific athlete
    /// - POST: Create a new athlete
    /// - PUT: Update an existing athlete
    /// - DELETE: Delete an athlete
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AthleteController : ControllerBase
    {
        private readonly SportsWorldContext _context; // Database context

        /// <summary>
        /// Constructor with dependency injection
        /// </summary>
        public AthleteController(SportsWorldContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: api/Athlete
        /// Retrieve all athletes from the database
        /// </summary>
        /// <returns>List of all athletes</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Athlete>>> GetAthletes()
        {
            return await _context.Athletes.ToListAsync();
        }

        /// <summary>
        /// GET: api/Athlete/{id}
        /// Retrieve a specific athlete by ID
        /// </summary>
        /// <param name="id">The athlete ID</param>
        /// <returns>The athlete with the specified ID, or 404 if not found</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Athlete>> GetAthlete(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);

            if (athlete == null)
            {
                return NotFound();
            }

            return athlete;
        }

        /// <summary>
        /// POST: api/Athlete
        /// Create a new athlete
        /// </summary>
        /// <param name="athlete">The athlete data to create</param>
        /// <returns>The created athlete with assigned ID</returns>
        [HttpPost]
        public async Task<ActionResult<Athlete>> PostAthlete(Athlete athlete)
        {
            // New athletes are not purchased by default
            athlete.PurchaseStatus = false;

            _context.Athletes.Add(athlete);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAthlete), new { id = athlete.Id }, athlete);
        }

        /// <summary>
        /// PUT: api/Athlete/{id}
        /// Update an existing athlete
        /// Used for both editing details and updating purchase status
        /// </summary>
        /// <param name="id">The athlete ID</param>
        /// <param name="athlete">The updated athlete data</param>
        /// <returns>204 No Content on success, 400 Bad Request if IDs don't match</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAthlete(int id, Athlete athlete)
        {
            // Verify the ID in the URL matches the athlete object
            if (id != athlete.Id)
            {
                return BadRequest();
            }

            // Mark the athlete entity as modified
            _context.Entry(athlete).State = EntityState.Modified;

            try
            {
                // Save changes to database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle concurrency conflicts (athlete was deleted by another request)
                if (!AthleteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// DELETE: api/Athlete/{id}
        /// Delete an athlete from the database
        /// </summary>
        /// <param name="id">The athlete ID to delete</param>
        /// <returns>204 No Content on success, 404 if athlete not found</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAthlete(int id)
        {
            // Find the athlete by ID
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound();
            }

            // Remove from context and save
            _context.Athletes.Remove(athlete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        /// <summary>
        /// POST: api/Athlete/{id}/purchase
        /// Purchase an athlete using available coins
        /// Updates both athlete purchase status and finance record
        /// </summary>
        /// <param name="id">The athlete ID to purchase</param>
        /// <returns>The purchased athlete and updated finance information</returns>
        [HttpPost("{id:int}/purchase")]
        public async Task<ActionResult> PurchaseAthlete(int id)
        {
            // Find the athlete
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound("Athlete not found.");
            }

            // Check if athlete is already purchased
            if (athlete.PurchaseStatus)
            {
                return BadRequest("Athlete is already purchased.");
            }

            // Find the Finance record (there's only one)
            var finance = await _context.Finances.FirstOrDefaultAsync();
            if (finance == null)
            {
                return BadRequest("Finance row does not exist.");
            }

            // Check if there are enough coins to purchase
            if (finance.MoneyLeft < athlete.Price)
            {
                return BadRequest("Not enough money to purchase this athlete.");
            }

            // Update finance: deduct the cost, increase spent, increment purchase count
            finance.MoneyLeft -= athlete.Price;
            finance.MoneySpent += athlete.Price;
            finance.NumberOfPurchases += 1;

            // Mark athlete as purchased
            athlete.PurchaseStatus = true;

            // Save all changes to database
            await _context.SaveChangesAsync();

            // Return both the updated athlete and finance information
            return Ok(new
            {
                athlete,
                finance
            });
        }

        /// <summary>
        /// Helper method to check if an athlete exists
        /// </summary>
        /// <param name="id">The athlete ID to check</param>
        /// <returns>True if athlete exists, false otherwise</returns>
        private bool AthleteExists(int id)
        {
            return _context.Athletes.Any(e => e.Id == id);
        }
    }
    
}

