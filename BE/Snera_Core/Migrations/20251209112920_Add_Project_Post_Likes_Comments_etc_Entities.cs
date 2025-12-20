using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snera_Core.Migrations
{
    /// <inheritdoc />
    public partial class Add_Project_Post_Likes_Comments_etc_Entities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectComment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Comment_Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectComment_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectLike",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectLike", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectLike_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectSkill",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Skill_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Skill_Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectSkill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectSkill_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectComment_Project_Id",
                table: "ProjectComment",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectLike_Project_Id",
                table: "ProjectLike",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSkill_Project_Id",
                table: "ProjectSkill",
                column: "Project_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectComment");

            migrationBuilder.DropTable(
                name: "ProjectLike");

            migrationBuilder.DropTable(
                name: "ProjectSkill");
        }
    }
}
