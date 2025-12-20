namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectTeamMemberModel
    {
        public Guid? User_Id { get; set; }
        public string Member_Role { get; set; } = string.Empty;
        public bool Is_Admin { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}
