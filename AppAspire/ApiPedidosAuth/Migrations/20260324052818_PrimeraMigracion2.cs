using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CLASE1.Migrations
{
    /// <inheritdoc />
    public partial class PrimeraMigracion2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductoId",
                table: "Pedidos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductoId",
                table: "Pedidos");
        }
    }
}
