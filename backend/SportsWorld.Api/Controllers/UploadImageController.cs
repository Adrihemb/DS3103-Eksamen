using Microsoft.AspNetCore.Mvc;
namespace SportsWorld.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class UploadImageController : ControllerBase
    {
        private readonly IWebHostEnvironment hosting;
        
        public UploadImageController(IWebHostEnvironment _hosting)
        {
            hosting = _hosting;
        }

        [HttpPost]
        public IActionResult SaveImage(IFormFile file, [FromQuery] string folder = "venues")
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            string uploadsFolder = Path.Combine(hosting.WebRootPath, "images", folder);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string absoluteFilePath = Path.Combine(uploadsFolder, file.FileName);

            using (var stream = new FileStream(absoluteFilePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
    
            return Ok(new { fileName = file.FileName });
        }
    }
}
