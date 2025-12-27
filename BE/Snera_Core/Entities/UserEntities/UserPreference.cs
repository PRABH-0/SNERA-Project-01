namespace Snera_Core.Entities.UserEntities
{
    public class UserPreference
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string PreferenceType { get; set; } = string.Empty;

        public string PreferenceValue { get; set; } = string.Empty;

        public DateTime Created_Timestamp { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";
    }

}
