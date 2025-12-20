using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class ProjectLike
    {
        public Guid Id { get; set; }

        // FOREIGN KEY
        public Guid Project_Id { get; set; }
        [ForeignKey("Project_Id")]
        public UserProject Project { get; set; }

        public Guid User_Id { get; set; }
    }
}
