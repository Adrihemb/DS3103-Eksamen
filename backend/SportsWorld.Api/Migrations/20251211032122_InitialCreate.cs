
﻿using Microsoft.EntityFrameworkCore.Migrations;

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

            migrationBuilder.InsertData(
                table: "Athletes",
                columns: new[] { "Id", "Gender", "Image", "Name", "Price", "PurchaseStatus" },
                values: new object[,]
                {
                    { 1, "Male", "https://example.com/messi.jpg", "Lionel Messi", 100, false },
                    { 2, "Male", "https://example.com/ronaldo.jpg", "Cristiano Ronaldo", 95, false },
                    { 3, "Male", "https://example.com/haaland.jpg", "Erling Haaland", 90, false },
                    { 4, "Male", "https://example.com/mbappe.jpg", "Kylian Mbappé", 92, false },
                    { 5, "Female", "https://example.com/ada-hegerberg.jpg", "Ada Hegerberg", 88, false },
                    { 6, "Female", "https://example.com/alexia.jpg", "Alexia Putellas", 89, false }
                });

            migrationBuilder.InsertData(
                table: "Finances",
                columns: new[] { "Id", "AmountBorrowed", "MoneyLeft", "MoneySpent", "NumberOfPurchases" },
                columnTypes: new[] { "INTEGER", "TEXT", "TEXT", "TEXT", "INTEGER" },
                values: new object[] { 1, 0m, 1000m, 0m, 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Athletes");

            migrationBuilder.DropTable(
                name: "Finances");
        }
    }
}
