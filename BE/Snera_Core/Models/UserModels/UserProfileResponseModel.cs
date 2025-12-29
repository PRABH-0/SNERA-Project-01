using Snera_Core.Models.UserProjectModels;

public class UserProfileResponseModel
{
    public Guid UserId { get; set; }

    // ✅ Basic Info
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;        // CurrentRole
    public string ProfileType { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;

    // ✅ About Section
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Availability { get; set; } = string.Empty;
    public string PreferredRole { get; set; } = string.Empty;
    public string Education { get; set; } = string.Empty;

    // ✅ Contact
    public string Email { get; set; } = string.Empty;
    public string GitHub { get; set; } = string.Empty;
    public string LinkedIn { get; set; } = string.Empty;

    // ✅ Stats
    public int ProjectsCount { get; set; }
    public int ConnectionsCount { get; set; }
    public int YearsOfExperience { get; set; }

    // ✅ Skills
    public List<string> SkillsHave { get; set; } = new();
    public List<string> SkillsNeed { get; set; } = new();

    // ✅ Preferences
    public List<string> ProjectTypes { get; set; } = new();
    public List<string> WorkTypes { get; set; } = new();

    // ✅ Projects
    public List<ProjectResponseModel> Projects { get; set; } = new();

    // ✅ Dates
    public DateTime JoinDate { get; set; }
}
