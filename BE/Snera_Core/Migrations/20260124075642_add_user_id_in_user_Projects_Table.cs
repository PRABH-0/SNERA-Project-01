using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snera_Core.Migrations
{
    /// <inheritdoc />
    public partial class add_user_id_in_user_Projects_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "User_Id",
                table: "UserProject",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User_Id",
                table: "UserProject");
        }
    }
}
