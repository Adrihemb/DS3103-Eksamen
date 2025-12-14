using Microsoft.AspNetCore.Mvc;
namespace SportsWorld.Api.Controllers
{
    //API controller for handling image file uploads
    [ApiController]
    [Route("api/[controller]")]
    
    public class UploadImageController : ControllerBase
    {
        private readonly IWebHostEnvironment hosting;
        
        //Dependency injection of hosting environment to access web root path
        public UploadImageController(IWebHostEnvironment _hosting)
        {
            hosting = _hosting;
        }

        //Saves uploaded image file to server storage
        [HttpPost]
        public IActionResult SaveImage(IFormFile file, [FromQuery] string folder = "venues")
        {
            //Validate that a file was provided
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            //Build path to uploads folder (wwwroot/images/{folder})
            string uploadsFolder = Path.Combine(hosting.WebRootPath, "images", folder);

            //Create folder if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            //Build complete file path with filename
            string absoluteFilePath = Path.Combine(uploadsFolder, file.FileName);

            //Write file to disk
            using (var stream = new FileStream(absoluteFilePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
    
            //Return filename to client for storing in database
            return Ok(new { fileName = file.FileName });
        }
    }
}
