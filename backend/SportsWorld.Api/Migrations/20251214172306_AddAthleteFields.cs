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
                    { 1, "Male", "https://example.com/messi.jpg", "Lionel Messi", "", "", 100, false },
                    { 2, "Male", "https://example.com/ronaldo.jpg", "Cristiano Ronaldo", "", "", 95, false },
                    { 3, "Male", "https://example.com/haaland.jpg", "Erling Haaland", "", "", 90, false },
                    { 4, "Male", "https://example.com/mbappe.jpg", "Kylian Mbappé", "", "", 92, false },
                    { 5, "Female", "https://example.com/ada-hegerberg.jpg", "Ada Hegerberg", "", "", 88, false },
                    { 6, "Female", "https://example.com/alexia.jpg", "Alexia Putellas", "", "", 89, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Athletes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Athletes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Athletes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Athletes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Athletes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Athletes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DropColumn(
                name: "Nationality",
                table: "Athletes");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Athletes");
        }
    }
}
