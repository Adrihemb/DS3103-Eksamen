using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportsWorld.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAthleteFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Nationality",
                table: "Athletes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Athletes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Athletes",
                columns: new[] { "Id", "Gender", "Image", "Name", "Nationality", "Position", "Price", "PurchaseStatus" },
                values: new object[,]
                {
                    { 9, "Male", "deroeve.jpg", "Oskar De Roewe", "Norway", "Forward", 85, false },
                    { 10, "Male", "holm.jpg", "Sverre Holm", "Norway", "Midfielder", 91, false }
                });

            // Update existing athletes with position and nationality
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Goalkeeper', Nationality = 'Norway' WHERE Id = 1");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Defender', Nationality = 'Iceland' WHERE Id = 2");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Midfielder', Nationality = 'Norway' WHERE Id = 3");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Forward', Nationality = 'Norway' WHERE Id = 4");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Defender', Nationality = 'Norway' WHERE Id = 5");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Midfielder', Nationality = 'Norway' WHERE Id = 6");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Forward', Nationality = 'Norway' WHERE Id = 7");
            migrationBuilder.Sql("UPDATE Athletes SET Position = 'Defender', Nationality = 'Norway' WHERE Id = 8");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Athletes");
        }
    }
}
