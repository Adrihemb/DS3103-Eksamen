using Microsoft.EntityFrameworkCore;
using SportsWorld.Api.Data;

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
                .WithOrigins("http://localhost:5173")
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

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
