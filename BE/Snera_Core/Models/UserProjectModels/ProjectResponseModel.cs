namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectResponseModel
    {
        public bool IsEditable { get; set; }
        public bool DisplayJoinTeamButton { get; set; }

        public ProjectDto? Project { get; set; }
        public ProjectDescriptionDto? ProjectDescription { get; set; }

        public List<string> SkillsHave { get; set; } = new();
        public List<string> SkillsNeed { get; set; } = new();

        public List<TeamMemberDto> TeamMembers { get; set; } = new();
        public List<TaskDto> CurrentTasks { get; set; } = new();
        public List<TimelineDto> Timelines { get; set; } = new();
        public List<DeveloperRequestDto> DeveloperRequests { get; set; } = new();
        public List<ResourceLinkDto> ResourceLinks { get; set; } = new();
    }
}
