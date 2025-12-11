<<<<<<< HEAD
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
        // Returnerer den ene Finance-raden (eller 404 hvis den ikke finnes)
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
        // Oppretter den ene Finance-raden (kjør dette én gang)
        [HttpPost]
        public async Task<ActionResult<Finance>> CreateFinance([FromBody] Finance finance)
        {
            // For sikkerhets skyld: ikke la dem lage flere rader
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
    }
}
=======
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
        // Returnerer den ene Finance-raden (eller 404 hvis den ikke finnes)
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
        // Oppretter den ene Finance-raden (kjør dette én gang)
        [HttpPost]
        public async Task<ActionResult<Finance>> CreateFinance([FromBody] Finance finance)
        {
            // For sikkerhets skyld: ikke la dem lage flere rader
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

            finance.MoneyLeft += request.Amount;

            await _context.SaveChangesAsync();

            return Ok(finance);
        }
    }
}
>>>>>>> 4b8de206eaac6cd1dc0b304e2c393bd0539318e8
