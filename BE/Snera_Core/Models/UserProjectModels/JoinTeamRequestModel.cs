namespace Snera_Core.Models.UserProjectModels
{
    public class JoinTeamRequestModel
    {
        public Guid User_Id { get; set; }
        public Guid Project_Id { get; set; }
        public string? InterestText { get; set; }
        public string? ExperienceText { get; set; }
        public int ActiveHour { get; set; }
        public List<string> Skills { get; set; } = new();
    }

}
