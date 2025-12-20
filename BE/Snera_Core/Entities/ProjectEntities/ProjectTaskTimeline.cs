using Snera_Core.Entities.UserEntities;
using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class ProjectTaskTimeline
    {
        public Guid Id { get; set; }

        public Guid User_Id { get; set; }
        [ForeignKey("User_Id")]
        public User? User { get; set; }

        public Guid Project_Id { get; set; }
        [ForeignKey("Project_Id")]
        public UserProject? Project { get; set; }
        public string TimeLine_Title { get; set; } = string.Empty;
        public string Date_TimeFrame { get; set; } = string.Empty;
        public string Timeline_Description {  get; set; } = string.Empty;
        public DateTime? Last_Edited_Timestamp { get; set; }
        public DateTime Created_At { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";
    }
}
