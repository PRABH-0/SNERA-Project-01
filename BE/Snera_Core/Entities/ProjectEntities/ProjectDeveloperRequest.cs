using Snera_Core.Entities.UserEntities;
using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class ProjectDeveloperRequest
    {
        public Guid Id { get; set; }

        public Guid User_Id { get; set; }
        [ForeignKey("User_Id")]
        public User? User { get; set; }

        public Guid Project_Id { get; set; }
        [ForeignKey("Project_Id")]
        public UserProject? Project { get; set; }
        public string Project_Interested_Text { get; set; } = string.Empty;
        public string Project_Experience_Text{ get; set; } = string.Empty;
        public int Active_Hour { get; set; } = 0;
        public DateTime? Last_Edited_Timestamp { get; set; }
        public DateTime Created_At { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";
        public ICollection<ProjectDeveloperRequestSkill>? ProjectDeveloperRequestSkill { get; set; }
    }
}
