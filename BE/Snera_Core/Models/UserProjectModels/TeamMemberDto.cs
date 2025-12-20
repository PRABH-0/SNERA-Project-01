namespace Snera_Core.Models.UserProjectModels
{
    public class TeamMemberDto
    {
        public Guid Id { get; set; }
        public Guid User_Id { get; set; }
        public string? Member_Role { get; set; }
        public bool Is_Admin { get; set; }
        public DateTime Created_At { get; set; }
    }
}
