using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class ProjectDescription
    {
        public Guid Id { get; set; }
        public Guid Project_Id { get; set; }
        [ForeignKey("Project_Id")]
        public UserProject? Project { get; set; }
        public string Team_Name { get; set; } = string.Empty;
        public string Project_Type { get; set; } = string.Empty;
        public string Project_Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Budget {  get; set; } = string.Empty;
        public string Project_Timeline {  get; set; } = string.Empty;
        public string Project_Visibility {  get; set; } = string.Empty;

        public int Team_Size { get; set; } = 1;
        public string Experience_Level { get; set; } = string.Empty;
        public string Project_Status {  get; set; } = string.Empty;//Active , On Hold , Completed 
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public DateTime? Last_Edited_Timestamp { get; set; }
        public DateTime Created_At { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";

    }
}
