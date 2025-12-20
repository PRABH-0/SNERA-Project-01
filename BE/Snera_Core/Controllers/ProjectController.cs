using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snera_Core.Interface;
using Snera_Core.Models.HelperModels;
using Snera_Core.Models.UserProjectModels;
using Snera_Core.Services;
using Snera_Core.UnitOfWork;

namespace Snera_Core.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost("CreatePost")]
        [Authorize]
        public async Task<IActionResult> CreateProject(UserPostModel post)
        {
            try
            {
                var response = await _projectService.CreateProject(post);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("GetProject")]
        [Authorize]
        public async Task<IActionResult> GetProject(Guid userId, Guid projectId)
        {
            try
            {
                var response = await _projectService.GetProject(userId, projectId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("GetAllProject")]
        [Authorize]
        public async Task<IActionResult> GetAllProject(FilterModel model)
        {
            try
            {
                var response = await _projectService.GetAllPosts(model);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("LikeProjectPost")]
        [Authorize]
        public async Task<IActionResult> LikeProjectPost(Guid userId, Guid projectId)
        {
            try
            {
                var response = await _projectService.LikeProjectPost(userId, projectId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("CommentOnProject")]
        [Authorize]
        public async Task<IActionResult> CommentOnProject(Guid userId, Guid projectId, string comment)
        {
            try
            {
                var response = await _projectService.CommentOnProject(userId, projectId, comment);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("UpdateProjectDescription")]
        [Authorize]
        public async Task<IActionResult> UpdateProjectDescription(UpdateProjectDescriptionModel model)
        {
            try
            {
                var response = await _projectService.UpdateProjectDescription(model);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("AddCurrentTask")]
        [Authorize]
        public async Task<IActionResult> AddCurrentTask(CreateTaskModel model)
        {
            try
            {
                var response = await _projectService.AddCurrentTask(model);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("AddTimeline")]
        [Authorize]
        public async Task<IActionResult> AddTimeline(CreateTimelineModel model)
        {
            try
            {
                var response = await _projectService.AddProjectTimeline(model);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("GetCurrentTasks")]
        [Authorize]
        public async Task<IActionResult> GetAllCurrentTasks(Guid projectId)
        {
            try
            {
                var response = await _projectService.GetAllCurrentTasks(projectId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("AddResourceLink")]
        [Authorize]
        public async Task<IActionResult> AddResourceLink(CreateResourceLinkModel model)
        {
            try
            {
                var response = await _projectService.AddResourceLink(model);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("GetTrendingSkills")]
        [Authorize]
        public async Task<IActionResult> GetTrendingSkills()
        {
            try
            {
                var response = await _projectService.GetTrendingSkills();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("SendDeveloperRequest")]
        [Authorize]
        public async Task<IActionResult> SendDeveloperRequest(JoinTeamRequestModel request)
        {
            try
            {
                var response = await _projectService.SendDeveloperRequest(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("GetDeveloperRequestsByProjectId")]
        [Authorize]
        public async Task<IActionResult> GetDeveloperRequestsByProjectId(Guid projectId)
        {
            try
            {
                var response = await _projectService.GetDeveloperRequestsByProjectId(projectId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpPost("HandleDeveloperRequest")]
        [Authorize]
        public async Task<IActionResult> HandleDeveloperRequest( Guid adminUserId,  Guid developerRequestId, bool isAccepted)
        {
            try
            {
                var response = await _projectService
                    .HandleDeveloperRequest(adminUserId, developerRequestId, isAccepted);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
