using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResetController : ControllerBase
    {
        private readonly SportsWorldContext _context;

        public ResetController(SportsWorldContext context)
        {
            _context = context;
        }

        // POST: api/reset
        // Resets finance values to defaults and clears all athlete purchase statuses.
        [HttpPost]
        public async Task<ActionResult<Finance>> Reset()
        {
            // Reset all athletes to not purchased
            var athletes = await _context.Athletes.ToListAsync();
            foreach (var a in athletes)
            {
                a.PurchaseStatus = false;
            }

            // Find or create the single Finance row
            var finance = await _context.Finances.FirstOrDefaultAsync();
            if (finance == null)
            {
                var newFinance = new Finance
                {
                    MoneyLeft = 1000m,
                    MoneySpent = 0m,
                    NumberOfPurchases = 0,
                    AmountBorrowed = 0m
                };
                _context.Finances.Add(newFinance);
                await _context.SaveChangesAsync();
                return Ok(newFinance);
            }

            // Reset finance values to sensible defaults for testing
            finance.MoneyLeft = 1000m;
            finance.MoneySpent = 0m;
            finance.NumberOfPurchases = 0;
            finance.AmountBorrowed = 0m;

            await _context.SaveChangesAsync();

            return Ok(finance);
        }
    }
}
