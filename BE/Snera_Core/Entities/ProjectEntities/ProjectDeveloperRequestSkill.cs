using Snera_Core.Entities.ProjectEntities;
using System.ComponentModel.DataAnnotations.Schema;

public class ProjectDeveloperRequestSkill
{
    public Guid Id { get; set; }

    public Guid DeveloperRequest_Id { get; set; }

    [ForeignKey("DeveloperRequest_Id")]
    public ProjectDeveloperRequest? DeveloperRequest { get; set; }

    public string Skill_Name { get; set; } = string.Empty; 
    public DateTime Created_At { get; set; } = DateTime.UtcNow;
    public string Record_State { get; set; } = "Active";

}
