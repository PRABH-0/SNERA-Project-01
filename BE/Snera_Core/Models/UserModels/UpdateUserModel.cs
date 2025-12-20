namespace Snera_Core.Models.UserModels
{
    public class UpdateUserModel
    {
        public string? FullName { get; set; }
        public string? ProfileType { get; set; }
        public string? CurrentRole { get; set; }
        public string? Experience { get; set; }
        public string? Bio { get; set; }
        public List<string>? UserSkills { get; set; }
    }
}
