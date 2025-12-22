using System;

namespace Snera_Core.Entities.ChatEntities
{
    public class Message
    {
        public Guid Id { get; set; }

        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }

        public string MessageText { get; set; } = string.Empty;

        public DateTime Sent_Timestamp { get; set; } = DateTime.UtcNow;

        // Sent | Delivered | Seen
        public string MessageStatus { get; set; } = "Sent";

        public bool IsDeleted { get; set; } = false;
    }
}
