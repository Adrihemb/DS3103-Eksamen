using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

namespace SportsWorld.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanceController : ControllerBase
    {
        private readonly SportsWorldContext _context;

        public FinanceController(SportsWorldContext context)
        {
            _context = context;
        }

        // Hjelpemetode for å hente den ene Finance-raden
        private async Task<Finance?> GetSingleFinanceAsync()
        {
            return await _context.Finances.FirstOrDefaultAsync();
        }

        // GET: api/finance
        // Returnerer alle Finance-rader
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Finance>>> GetAllFinance()
        {
            var finances = await _context.Finances.ToListAsync();
            return Ok(finances);
        }

        // GET: api/finance/department/{name}
        // Henter Finance-data for en spesifikk department
        [HttpGet("department/{name}")]
        public async Task<ActionResult<Finance>> GetFinanceByDepartment(string name)
        {
            var finance = await _context.Finances
                .FirstOrDefaultAsync(f => f.Department == name);

            if (finance == null)
            {
                return NotFound($"No Finance data found for department '{name}'.");
            }

            return Ok(finance);
        }

        // GET: api/finance/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Finance>> GetFinanceById(int id)
        {
            var finance = await _context.Finances.FindAsync(id);

            if (finance == null)
            {
                return NotFound();
            }

            return Ok(finance);
        }

        // POST: api/finance
        // Oppretter en ny Finance-rad for en department
        [HttpPost]
        public async Task<ActionResult<Finance>> CreateFinance([FromBody] Finance finance)
        {
            if (string.IsNullOrWhiteSpace(finance.Department))
            {
                return BadRequest("Department name is required.");
            }

            // Check if this department already exists
            var existing = await _context.Finances
                .FirstOrDefaultAsync(f => f.Department == finance.Department);
            if (existing != null)
            {
                return BadRequest($"Finance data for '{finance.Department}' already exists.");
            }

            _context.Finances.Add(finance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFinanceByDepartment), new { name = finance.Department }, finance);
        }

        // PUT: api/finance/1
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateFinance(int id, [FromBody] Finance updated)
        {
            if (id != updated.Id)
            {
                return BadRequest("Id in URL and body must match.");
            }

            var existing = await _context.Finances.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Department = updated.Department;
            existing.MoneyLeft = updated.MoneyLeft;
            existing.MoneySpent = updated.MoneySpent;
            existing.NumberOfPurchases = updated.NumberOfPurchases;
            existing.AmountBorrowed = updated.AmountBorrowed;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/finance/1
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFinance(int id)
        {
            var finance = await _context.Finances.FindAsync(id);
            if (finance == null)
            {
                return NotFound();
            }

            _context.Finances.Remove(finance);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/finance/loan
        // Body: { "amount": 100000 }
        public class LoanRequest
        {
            public decimal Amount { get; set; }
        }

        [HttpPost("loan")]
        public async Task<ActionResult<Finance>> TakeLoan([FromBody] LoanRequest request)
        {
            if (request.Amount <= 0)
            {
                return BadRequest("Loan amount must be positive.");
            }

            var finance = await GetSingleFinanceAsync();
            if (finance == null)
            {
                return BadRequest("Finance row does not exist.");
            }

            // Add loan amount to both MoneyLeft and AmountBorrowed (debt tracking)
            finance.MoneyLeft += request.Amount;
            finance.AmountBorrowed += request.Amount;

            await _context.SaveChangesAsync();

            return Ok(finance);
        }
    }
}
