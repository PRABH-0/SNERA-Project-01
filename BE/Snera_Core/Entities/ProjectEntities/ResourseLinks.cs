using System.ComponentModel.DataAnnotations.Schema;

namespace Snera_Core.Entities.ProjectEntities
{
    public class ResourseLinks
    {
        public Guid Id { get; set; }

        // FOREIGN KEY
        public Guid Project_Id { get; set; }
        [ForeignKey("Project_Id")]
        public UserProject Project { get; set; }

        public Guid User_Id { get; set; }
        public string Link { get; set; } = string.Empty;

        public DateTime Created_At { get; set; } = DateTime.UtcNow;
    }
}
