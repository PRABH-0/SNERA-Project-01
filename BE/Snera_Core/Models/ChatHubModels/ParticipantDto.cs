namespace Snera_Core.Models.ChatHubModels
{
    public class ParticipantDto
    {
        public Guid UserId { get; set; }
        public string Role { get; set; } = "Member";
        public bool isOnline { get; set; } = false;
    }

}
