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

        // method to retrieve the single Finance row
        private async Task<Finance?> GetSingleFinanceAsync()
        {
            return await _context.Finances.FirstOrDefaultAsync();
        }

        // GET: api/finance
        // Returns the single Finance row (or 404 if it doesn't exist)
        [HttpGet]
        public async Task<ActionResult<Finance>> GetFinance()
        {
            var finance = await GetSingleFinanceAsync();

            if (finance == null)
            {
                return NotFound("No Finance row found. You must create one first.");
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
        // Creates the single Finance row (run this once)
        [HttpPost]
        public async Task<ActionResult<Finance>> CreateFinance([FromBody] Finance finance)
        {
            // For safety: don't allow creating multiple rows
            var existing = await GetSingleFinanceAsync();
            if (existing != null)
            {
                return BadRequest("Finance row already exists. Only one row is allowed.");
            }

            _context.Finances.Add(finance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFinanceById), new { id = finance.Id }, finance);
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

            existing.MoneyLeft = updated.MoneyLeft;
            existing.MoneySpent = updated.MoneySpent;
            existing.NumberOfPurchases = updated.NumberOfPurchases;

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

        // POST: api/finance/repay
        // Body: { "amount": 50000 }
        public class RepayRequest
        {
            public decimal Amount { get; set; }
        }

        [HttpPost("repay")]
        public async Task<ActionResult<Finance>> RepayLoan([FromBody] RepayRequest request)
        {
            if (request.Amount <= 0)
            {
                return BadRequest("Repayment amount must be positive.");
            }

            var finance = await GetSingleFinanceAsync();
            if (finance == null)
            {
                return BadRequest("Finance row does not exist.");
            }

            if (request.Amount > finance.AmountBorrowed)
            {
                return BadRequest($"Cannot repay more than borrowed amount. Current debt: {finance.AmountBorrowed}");
            }

            if (request.Amount > finance.MoneyLeft)
            {
                return BadRequest($"Insufficient funds. Available: {finance.MoneyLeft}");
            }

            finance.MoneyLeft -= request.Amount;
            finance.AmountBorrowed -= request.Amount;

            await _context.SaveChangesAsync();

            return Ok(finance);
        }
    }
}
