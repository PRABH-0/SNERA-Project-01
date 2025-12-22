using System;

namespace Snera_Core.Entities.ChatEntities
{
    public class UserConnection
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string ConnectionId { get; set; } = string.Empty;

        public DateTime Connected_Timestamp { get; set; } = DateTime.UtcNow;
    }
}
