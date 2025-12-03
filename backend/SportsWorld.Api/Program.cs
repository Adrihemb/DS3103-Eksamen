using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SportsWorld.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register DbContext with SQLite
builder.Services.AddDbContext<SportsWorldContext>(options =>
{
    options.UseSqlite("Data Source=SportsWorld.db");
});

// CORS: tillat frontend på http://localhost:5173
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Swagger / OpenAPI (via Swashbuckle)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SportsWorld API",
        Version = "v1"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "SportsWorld API v1");
    });
}

app.UseHttpsRedirection();

// 🔥 Viktig: CORS før Authorization / MapControllers
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
