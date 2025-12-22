using System;

namespace Snera_Core.Entities.ChatEntities
{
    public class ConversationParticipant
    {
        public Guid Id { get; set; }

        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }

        // Optional: Admin, Member
        public string Role { get; set; } = "Member";

        public DateTime Joined_Timestamp { get; set; } = DateTime.UtcNow;
    }
}
