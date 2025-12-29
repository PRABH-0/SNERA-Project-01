using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snera_Core.Migrations
{
    /// <inheritdoc />
    public partial class Add_UserLink_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LinkType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LinkValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLinks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserLinks");
        }
    }
}
