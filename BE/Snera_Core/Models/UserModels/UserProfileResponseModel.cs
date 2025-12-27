namespace Snera_Core.Models.UserModels
{
    public class UserProfileResponseModel
    {
        // Basic User Info
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string AvatarName { get; set; }
        public string Email { get; set; }
        public string ProfileType { get; set; }
        public string CurrentRole { get; set; }
        public string Experience { get; set; }
        public string Bio { get; set; }
        public string UserStatus { get; set; }

        // Skills
        public List<string> Skills { get; set; } = new();

        // Preferences
        public List<string> ProjectTypes { get; set; } = new();
        public List<string> WorkTypes { get; set; } = new();

        // Profile Details
        public string Location { get; set; }
        public string Availability { get; set; }
        public string PreferredRole { get; set; }
        public string Education { get; set; }
    }

}
