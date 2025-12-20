using AutoMapper;
using Snera_Core.Entities.ProjectEntities;
using Snera_Core.Models.UserProjectModels;

namespace Snera_Core.Mappings
{
    public class ProjectMappingProfile : Profile
    {
        public ProjectMappingProfile()
        {
            CreateMap<UserProject, ProjectDto>();
            CreateMap<ProjectDescription, ProjectDescriptionDto>();
            CreateMap<ProjectTeamMembers, TeamMemberDto>();
            CreateMap<ProjectCurrentTasks, TaskDto>();
            CreateMap<ProjectTaskTimeline, TimelineDto>();
            CreateMap<ResourseLinks, ResourceLinkDto>();
            CreateMap<ProjectDeveloperRequest, DeveloperRequestDto>();
        }
    }
}
