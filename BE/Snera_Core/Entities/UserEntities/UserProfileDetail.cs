namespace Snera_Core.Entities.UserEntities
{
    public class UserProfileDetail
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string Location { get; set; } = string.Empty;
        public string Availability { get; set; } = string.Empty;
        public string PreferredRole { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;

        public DateTime Created_Timestamp { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";
    }

}
