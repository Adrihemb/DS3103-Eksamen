using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportsWorld.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentToFinance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Finances",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            // Delete the old single Finance row
            migrationBuilder.DeleteData(
                table: "Finances",
                keyColumn: "Id",
                keyValue: 1);

            // Insert 8 Finance rows for different departments
            migrationBuilder.InsertData(
                table: "Finances",
                columns: new[] { "Id", "Department", "MoneyLeft", "NumberOfPurchases", "MoneySpent", "AmountBorrowed" },
                values: new object[,]
                {
                    { 1, "Men's Team", "1000", 0, "0", "0" },
                    { 2, "Women's Team", "1000", 0, "0", "0" },
                    { 3, "Youth Academy", "800", 0, "0", "0" },
                    { 4, "Reserves", "600", 0, "0", "0" },
                    { 5, "Academy U-17", "500", 0, "0", "0" },
                    { 6, "Academy U-15", "500", 0, "0", "0" },
                    { 7, "Coaching Staff", "700", 0, "0", "0" },
                    { 8, "Training Facility", "900", 0, "0", "0" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "Finances");
        }
    }
}
