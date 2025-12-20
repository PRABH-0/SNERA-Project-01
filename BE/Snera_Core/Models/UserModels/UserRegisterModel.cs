using Snera_Core.Entities;

namespace Snera_Core.Models.UserModels
{
    public class UserRegisterModel
    {
        public string Full_Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Profile_Type { get; set; } = string.Empty;
        public string Current_Role { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;

        public List<string>? UserSkills { get; set; }

    }
}
