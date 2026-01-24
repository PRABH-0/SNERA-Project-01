namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public DateTime Created_Timestamp { get; set; }
        public string? Record_State { get; set; }

        public Guid? Conversation_Id { get; set; }
        public string? User_Status { get; set; }
    }

}
