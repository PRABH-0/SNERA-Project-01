using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snera_Core.Migrations
{
    /// <inheritdoc />
    public partial class add_conversation_id_in_UserProjects_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "Conversation_Id",
                table: "UserProject",
                type: "uniqueidentifier",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Conversation_Id",
                table: "UserProject");
        }
    }
}
