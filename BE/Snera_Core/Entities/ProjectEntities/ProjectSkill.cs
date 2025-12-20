using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class ProjectSkill
    {
        public Guid Id { get; set; }

        public Guid Project_Id { get; set; }
        [ForeignKey("Project_Id")]
        public UserProject Project { get; set; }

        public string Skill_Name { get; set; } = string.Empty;
        public string Skill_Type { get; set; } = string.Empty; // Have | Need
    }
}
