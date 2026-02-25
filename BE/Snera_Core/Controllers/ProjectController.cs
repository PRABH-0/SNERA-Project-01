using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snera_Core.Interface;
using Snera_Core.Models.HelperModels;
using Snera_Core.Models.UserProjectModels;

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

        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateProject([FromBody] UserPostModel post)
        {
            try
            {
                var response = await _projectService.CreateProject(post);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("get/{projectId}")]
        [Authorize]
        public async Task<IActionResult> GetProject(Guid projectId)
        {
            try
            {
                var response = await _projectService.GetProject(projectId);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("all")]
        [Authorize]
        public async Task<IActionResult> GetAllProject([FromBody] FilterModel model)
        {
            try
            {
                var response = await _projectService.GetAllPosts(model);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("my-projects")]
        [Authorize]
        public async Task<IActionResult> GetMyProjects()
        {
            try
            {
                var response = await _projectService.GetUserProjects();
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize]
        [HttpPatch("patch-task")]
        public async Task<IActionResult> PatchCurrentTask([FromBody] PatchCurrentTaskModel model)
        {
            if (model == null || model.Task_Id == Guid.Empty)
                return BadRequest("Invalid request");

            var result = await _projectService.PatchCurrentTask(model);

            return Ok(new { message = result });
        }

        [HttpPost("like/{projectId}")]
        [Authorize]
        public async Task<IActionResult> LikeProjectPost(Guid projectId)
        {
            try
            {
                var response = await _projectService.LikeProjectPost(projectId);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("comment/{projectId}")]
        [Authorize]
        public async Task<IActionResult> CommentOnProject(Guid projectId, [FromBody] CommentRequestModel model)
        {
            try
            {
                var response = await _projectService.CommentOnProject(projectId, model.Comment);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("update-description")]
        [Authorize]
        public async Task<IActionResult> UpdateProjectDescription([FromBody] UpdateProjectDescriptionModel model)
        {
            try
            {
                var response = await _projectService.UpdateProjectDescription(model);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("add-task")]
        [Authorize]
        public async Task<IActionResult> AddCurrentTask([FromBody] CreateTaskModel model)
        {
            try
            {
                var response = await _projectService.AddCurrentTask(model);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("add-timeline")]
        [Authorize]
        public async Task<IActionResult> AddTimeline([FromBody] CreateTimelineModel model)
        {
            try
            {
                var response = await _projectService.AddProjectTimeline(model);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("tasks/{projectId}")]
        [Authorize]
        public async Task<IActionResult> GetAllCurrentTasks(Guid projectId)
        {
            try
            {
                var response = await _projectService.GetAllCurrentTasks(projectId);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("add-resource")]
        [Authorize]
        public async Task<IActionResult> AddResourceLink([FromBody] CreateResourceLinkModel model)
        {
            try
            {
                var response = await _projectService.AddResourceLink(model);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("trending-skills")]
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

        [HttpPost("send-request")]
        [Authorize]
        public async Task<IActionResult> SendDeveloperRequest([FromBody] JoinTeamRequestModel request)
        {
            try
            {
                var response = await _projectService.SendDeveloperRequest(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("requests/{projectId}")]
        [Authorize]
        public async Task<IActionResult> GetDeveloperRequestsByProjectId(Guid projectId)
        {
            try
            {
                var response = await _projectService.GetDeveloperRequestsByProjectId(projectId);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("handle-request/{developerRequestId}")]
        [Authorize]
        public async Task<IActionResult> HandleDeveloperRequest(Guid developerRequestId, [FromBody] HandleRequestModel model)
        {
            try
            {
                var response = await _projectService.HandleDeveloperRequest(developerRequestId, model.IsAccepted);
                return Ok(new { message = response });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

}