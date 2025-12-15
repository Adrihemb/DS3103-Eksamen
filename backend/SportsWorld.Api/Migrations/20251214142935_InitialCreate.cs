using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportsWorld.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Athletes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Gender = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<int>(type: "INTEGER", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: false),
                    PurchaseStatus = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Athletes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Finances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MoneyLeft = table.Column<decimal>(type: "TEXT", nullable: false),
                    NumberOfPurchases = table.Column<int>(type: "INTEGER", nullable: false),
                    MoneySpent = table.Column<decimal>(type: "TEXT", nullable: false),
                    AmountBorrowed = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Finances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Venues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Capacity = table.Column<int>(type: "INTEGER", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Venues", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Finances",
                columns: new[] { "Id", "MoneyLeft", "NumberOfPurchases", "MoneySpent", "AmountBorrowed" },
                values: new object[] { 1, "1000", 0, "0", 0 });

            migrationBuilder.InsertData(
                table: "Athletes",
                columns: new[] { "Id", "Gender", "Image", "Name", "Price", "PurchaseStatus" },
                values: new object[,]
                {
                    { 1, "Male", "finne.jpg", "Bård Finne", 100, false },
                    { 2, "Male", "eggert.jpg", "Aron Eggert Gudmunsson", 95, false },
                    { 3, "Male", "sande.jpg", "Mads Sande", 90, false },
                    { 4, "Male", "ulrik.jpg", "Ulrik Mathisen", 92, false },
                    { 5, "Male", "helland.jpg", "Eivind Helland", 88, false },
                    { 6, "Male", "dyngeland.jpg", "Mathias Dyngeland", 89, false },
                    { 7, "Male", "jonas.jpg", "Jonas Torsvik", 87, false },
                    { 8, "Male", "horn.jpg", "Felix Horn Myhre", 93, false }
                });

            migrationBuilder.InsertData(
                table: "Venues",
                columns: new[] { "Id", "Capacity", "Image", "Name" },
                values: new object[,]
                {
                    { 1, 75000, "old-trafford.jpg", "Old Trafford" },
                    { 2, 54000, "anfield.jpg", "Anfield" },
                    { 3, 60000, "emirates-stadium.jpg", "Emirates Stadium" },
                    { 4, 53000, "etihad-stadium.jpg", "Etihad Stadium" },
                    { 5, 62000, "tottenham-hotspur-stadium.jpg", "Tottenham Hotspur Stadium" },
                    { 6, 62000, "london-stadium.jpg", "London Stadium" },
                    { 7, 42000, "villa-park.jpg", "Villa Park" },
                    { 8, 52000, "st-james-park.jpg", "St James' Park" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Athletes");

            migrationBuilder.DropTable(
                name: "Finances");

            migrationBuilder.DropTable(
                name: "Venues");
        }
    }
}
