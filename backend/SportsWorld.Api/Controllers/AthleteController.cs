using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AthleteController : ControllerBase
    {
        private readonly SportsWorldContext _context;

        public AthleteController(SportsWorldContext context)
        {
            _context = context;
        }

        // GET: api/Athlete
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Athlete>>> GetAthletes()
        {
            return await _context.Athletes.ToListAsync();
        }

        // GET: api/Athlete/5
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

        // POST: api/Athlete
        [HttpPost]
        public async Task<ActionResult<Athlete>> PostAthlete(Athlete athlete)
        {
            // Nye utøvere skal være "ikke kjøpt" som default
            athlete.PurchaseStatus = false;

            _context.Athletes.Add(athlete);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAthlete), new { id = athlete.Id }, athlete);
        }

        // PUT: api/Athlete/5
        // Brukes både til å redigere og "kjøpe" (purchaseStatus true)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAthlete(int id, Athlete athlete)
        {
            if (id != athlete.Id)
            {
                return BadRequest();
            }

            _context.Entry(athlete).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
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

        // DELETE: api/Athlete/5
        [HttpDelete("{id}")]
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

        private bool AthleteExists(int id)
        {
            return _context.Athletes.Any(e => e.Id == id);
        }
    }
    
}

