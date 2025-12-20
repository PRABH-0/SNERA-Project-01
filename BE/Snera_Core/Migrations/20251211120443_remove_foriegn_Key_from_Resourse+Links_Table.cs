using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snera_Core.Migrations
{
    /// <inheritdoc />
    public partial class remove_foriegn_Key_from_ResourseLinks_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectResourseLinks_UserProject_Project_Id",
                table: "ProjectResourseLinks");

            migrationBuilder.DropIndex(
                name: "IX_ProjectResourseLinks_Project_Id",
                table: "ProjectResourseLinks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ProjectResourseLinks_Project_Id",
                table: "ProjectResourseLinks",
                column: "Project_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectResourseLinks_UserProject_Project_Id",
                table: "ProjectResourseLinks",
                column: "Project_Id",
                principalTable: "UserProject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
