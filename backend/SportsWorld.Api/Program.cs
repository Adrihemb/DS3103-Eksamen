using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;
using SportsWorld.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// DbContext – SQLite
builder.Services.AddDbContext<SportsWorldContext>(options =>
    options.UseSqlite("Data Source=SportsWorld.db"));

// CORS – tillat frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "http://localhost:5174")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseStaticFiles();

// 🔥 Viktig: CORS før Authorization / MapControllers
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SportsWorldContext>();
    context.Database.EnsureCreated();

    if (!context.Venues.Any())
    {
        context.Venues.AddRange(
            new Venue { Name = "Wembley Stadium", Capacity = 90000, Image = "https://example.com/wembley.jpg" },
            new Venue { Name = "Camp Nou", Capacity = 99354, Image = "https://example.com/campnou.jpg" },
            new Venue { Name = "Old Trafford", Capacity = 74310, Image = "https://example.com/oldtrafford.jpg" }
        );
        context.SaveChanges();
    }
}

app.Run();
