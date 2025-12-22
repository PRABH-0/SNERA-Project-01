using System;
using System.Collections.Generic;

namespace Snera_Core.Entities.ChatEntities
{
    public class Conversation
    {
        public Guid Id { get; set; }

        // "Private" or "Group"
        public string ConversationType { get; set; } = string.Empty;

        // For group chats
        public string? GroupName { get; set; }

        public DateTime Created_Timestamp { get; set; } = DateTime.UtcNow;

        public string Record_State { get; set; } = "Active";

        public ICollection<ConversationParticipant>? Participants { get; set; }
        public ICollection<Message>? Messages { get; set; }
    }
}
