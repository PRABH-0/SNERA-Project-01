public class UpdateUserProfileModel
{
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string? ProfileType { get; set; }
    public string? ExperienceLevel { get; set; }
    public string? Bio { get; set; }

    public string? Location { get; set; }
    public string? Availability { get; set; }
    public string? PreferredRole { get; set; }
    public string? Education { get; set; }

    public List<string>? SkillsHave { get; set; }
    public List<string>? SkillsNeed { get; set; }

    public List<string>? ProjectTypes { get; set; }
    public List<string>? WorkTypes { get; set; }

    // 🔥 NEW
    public string? Email { get; set; }
    public string? GitHub { get; set; }
    public string? LinkedIn { get; set; }
}
