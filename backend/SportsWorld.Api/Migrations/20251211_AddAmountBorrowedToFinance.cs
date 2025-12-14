using Microsoft.EntityFrameworkCore.Migrations;

namespace SportsWorld.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAmountBorrowedToFinance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AmountBorrowed",
                table: "Finances",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmountBorrowed",
                table: "Finances");
        }
    }
}
