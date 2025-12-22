using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snera_Core.Services;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Snera_Core.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatHubService _chatHubService;

        public ChatController(IChatHubService chatHubService)
        {
            _chatHubService = chatHubService;
        }
        [Authorize]
        [HttpPost("private/{receiverId}")]
        public async Task<IActionResult> CreatePrivateChat(Guid receiverId)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var conversationId = await _chatHubService.CreatePrivateConversationAsync(userId, receiverId);
            return Ok(conversationId);
        }
        [Authorize]
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await _chatHubService.GetUserConversationsAsync(userId));
        }
        [Authorize]
        [HttpGet("{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(Guid conversationId)
        {
            return Ok(await _chatHubService.GetMessagesAsync(conversationId));
        }
    }
}
