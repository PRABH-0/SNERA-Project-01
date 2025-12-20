using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snera_Core.Migrations
{
    /// <inheritdoc />
    public partial class fresh_intial_DB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserProject",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    User_Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrentRole = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Experience = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Avtar_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    User_Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectDescription",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Team_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Project_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Project_Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Budget = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Project_Timeline = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Team_Size = table.Column<int>(type: "int", nullable: false),
                    Experience_Level = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Project_Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Start_Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    End_Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Last_Edited_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectDescription", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectDescription_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectCurrentTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Task_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Task_End_Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Is_Trashed = table.Column<bool>(type: "bit", nullable: false),
                    Is_Completed = table.Column<bool>(type: "bit", nullable: false),
                    Last_Edited_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectCurrentTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectCurrentTasks_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectCurrentTasks_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectDeveloperRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Interested_Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Project_Experience_Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active_Hour = table.Column<int>(type: "int", nullable: false),
                    Last_Edited_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectDeveloperRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectDeveloperRequests_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectDeveloperRequests_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTeamMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Member_Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_Admin = table.Column<bool>(type: "bit", nullable: false),
                    Last_Edited_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTeamMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectTeamMembers_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTeamMembers_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTimelines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Project_Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TimeLine_Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date_TimeFrame = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timeline_Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Last_Edited_Timestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Record_State = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTimelines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectTimelines_UserProject_Project_Id",
                        column: x => x.Project_Id,
                        principalTable: "UserProject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTimelines_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Skill_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSkills_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCurrentTasks_Project_Id",
                table: "ProjectCurrentTasks",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectCurrentTasks_User_Id",
                table: "ProjectCurrentTasks",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDescription_Project_Id",
                table: "ProjectDescription",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDeveloperRequests_Project_Id",
                table: "ProjectDeveloperRequests",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDeveloperRequests_User_Id",
                table: "ProjectDeveloperRequests",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeamMembers_Project_Id",
                table: "ProjectTeamMembers",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeamMembers_User_Id",
                table: "ProjectTeamMembers",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTimelines_Project_Id",
                table: "ProjectTimelines",
                column: "Project_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTimelines_User_Id",
                table: "ProjectTimelines",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserSkills_UserId",
                table: "UserSkills",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectCurrentTasks");

            migrationBuilder.DropTable(
                name: "ProjectDescription");

            migrationBuilder.DropTable(
                name: "ProjectDeveloperRequests");

            migrationBuilder.DropTable(
                name: "ProjectTeamMembers");

            migrationBuilder.DropTable(
                name: "ProjectTimelines");

            migrationBuilder.DropTable(
                name: "UserSkills");

            migrationBuilder.DropTable(
                name: "UserProject");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
