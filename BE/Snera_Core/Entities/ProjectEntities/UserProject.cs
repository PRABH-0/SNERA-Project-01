using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class UserProject
    {
        public Guid Id { get; set; }
        
        public DateTime Created_Timestamp { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";
        public string User_Status { get; set; } = "Offline";
        public ICollection<ProjectTeamMembers>? ProjectTeamMembers { get; set; }
        public ICollection<ProjectCurrentTasks>? ProjectCurrentTasks { get; set; }
        public ICollection<ProjectTaskTimeline>? ProjectTimelines { get; set; }
        public ICollection<ProjectDeveloperRequest>? ProjectDeveloperRequest { get; set; }
        public ICollection<ProjectSkill>? ProjectSkills { get; set; }
        public ICollection<ProjectDescription>? ProjectDescription { get; set; }
        public ICollection<ResourseLinks>? ResourseLinks { get; set; }
    }
}
