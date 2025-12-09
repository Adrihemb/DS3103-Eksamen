using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AthleteController : ControllerBase
    {
        private readonly SportsWorldContext _context;

        public AthleteController(SportsWorldContext context)
        {
            _context = context;
        }

        // GET: api/athlete
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Athlete>>> GetAllAthletes()
        {
            var athletes = await _context.Athletes.ToListAsync();
            return Ok(athletes);
        }

        // GET: api/athlete/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Athlete>> GetAthleteById(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);

            if (athlete == null)
            {
                return NotFound();
            }

            return Ok(athlete);
        }

        // GET: api/athlete/search?name=leo
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Athlete>>> GetByName([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name query is required.");
            }

            var athletes = await _context.Athletes
                .Where(a => a.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();

            return Ok(athletes);
        }

        // POST: api/athlete
        [HttpPost]
        public async Task<ActionResult<Athlete>> CreateAthlete([FromBody] Athlete athlete)
        {
            athlete.PurchaseStatus = false;

            _context.Athletes.Add(athlete);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAthleteById), new { id = athlete.Id }, athlete);
        }

        // PUT: api/athlete/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAthlete(int id, [FromBody] Athlete updated)
        {
            if (id != updated.Id)
            {
                return BadRequest("Id in URL and body must match.");
            }

            var existing = await _context.Athletes.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Name = updated.Name;
            existing.Gender = updated.Gender;
            existing.Price = updated.Price;
            existing.Image = updated.Image;
            existing.PurchaseStatus = updated.PurchaseStatus;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/athlete/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAthlete(int id)
        {
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound();
            }

            _context.Athletes.Remove(athlete);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        // POST: api/athlete/5/purchase
        [HttpPost("{id:int}/purchase")]
        public async Task<ActionResult> PurchaseAthlete(int id)
        {
            // Finn athlete
            var athlete = await _context.Athletes.FindAsync(id);
            if (athlete == null)
            {
                return NotFound("Athlete not found.");
            }

            if (athlete.PurchaseStatus)
            {
                return BadRequest("Athlete is already purchased.");
            }

            // Finn Finance (den ene raden)
            var finance = await _context.Finances.FirstOrDefaultAsync();
            if (finance == null)
            {
                return BadRequest("Finance row does not exist.");
            }

            if (finance.MoneyLeft < athlete.Price)
            {
                return BadRequest("Not enough money to purchase this athlete.");
            }

            // Oppdater økonomi
            finance.MoneyLeft -= athlete.Price;
            finance.MoneySpent += athlete.Price;
            finance.NumberOfPurchases += 1;

            // Oppdater athlete
            athlete.PurchaseStatus = true;

            await _context.SaveChangesAsync();

            // Returner både ny athlete og oppdatert finance hvis du vil
            return Ok(new
            {
                athlete,
                finance
            });
        }
    }
    
}

