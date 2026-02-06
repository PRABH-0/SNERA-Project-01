using Snera_Core.Models.HelperModels;
using Snera_Core.Models.UserProjectModels;

namespace Snera_Core.Interface
{
    public interface IProjectService
    {
        Task<ProjectResponseModel> GetProject(Guid projectId);
        Task<GetProjectListResponse> GetUserProjects();
        Task<string> CreateProject(UserPostModel post);
        Task<GetProjectListResponse> GetAllPosts(FilterModel request);
        Task<string> LikeProjectPost(Guid projectId);
        Task<string> CommentOnProject(Guid projectId, string comment);
        Task<string> AddCurrentTask(CreateTaskModel dto);
        Task<string> AddResourceLink(CreateResourceLinkModel dto);
        Task<string> AddProjectTimeline(CreateTimelineModel dto);
        Task<string> UpdateProjectDescription(UpdateProjectDescriptionModel model);
        Task<List<ProjectTaskResponseModel>> GetAllCurrentTasks(Guid projectId);
        Task<CommonResponse> SendDeveloperRequest(JoinTeamRequestModel request);
        Task<List<TrendingSkillDto>> GetTrendingSkills();
        Task<string> PatchCurrentTask(PatchCurrentTaskModel dto);
        Task<string> HandleDeveloperRequest(Guid developerRequestId, bool isAccepted);
        Task<List<object>> GetDeveloperRequestsByProjectId(Guid projectId);
    }
}