namespace Snera_Core.Entities.UserEntities
{
    public class UserLink
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string LinkType { get; set; } = string.Empty;
        public string LinkValue { get; set; } = string.Empty;
        public string Record_State { get; set; } = "Active";
        public DateTime Created_Timestamp { get; set; } = DateTime.UtcNow;
    }
}
