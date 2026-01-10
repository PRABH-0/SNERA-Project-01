namespace Snera_Core.Models.ChatHubModels
{
    public class ConversationResponseDto
    {
        public Guid Id { get; set; }
        public string ConversationType { get; set; } = string.Empty;
        public string? GroupName { get; set; }
        public DateTime Created_Timestamp { get; set; }

        public List<ParticipantDto> Participants { get; set; } = new();
        public List<MessageDto> Messages { get; set; } = new();
    }

}
