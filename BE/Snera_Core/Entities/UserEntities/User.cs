using System;
using System.Collections.Generic;

namespace Snera_Core.Entities.UserEntities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string ProfileType { get; set; } = string.Empty;
        public string CurrentRole { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string Avtar_Name {  get; set; } = string.Empty;
        public DateTime Created_Timestamp { get; set; } = DateTime.UtcNow;
        public string Record_State { get; set; } = "Active";
        public string User_Status { get; set; } = "Offline";

        public ICollection<UserSkill>? UserSkills { get; set; }
    }
}
