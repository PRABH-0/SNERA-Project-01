namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public DateTime Created_Timestamp { get; set; }
        public string? Record_State { get; set; }
        public string? User_Status { get; set; }
    }

}
