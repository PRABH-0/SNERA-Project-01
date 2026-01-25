namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectChatInfoDto
    {
        public Guid ConversationId { get; set; }
        public string GroupName { get; set; }
        public string ConversationType { get; set; }
        public DateTime Created_Timestamp { get; set; }
    }
}