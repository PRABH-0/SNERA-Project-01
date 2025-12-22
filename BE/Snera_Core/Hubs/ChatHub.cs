using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Snera_Core.Entities.ChatEntities;
using Snera_Core.UnitOfWork;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Snera_Core.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;

        public ChatHub(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 🔹 User connects
        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();

            if (userId == Guid.Empty)
                return;

            await _unitOfWork.UserConnection.AddAsync(new UserConnection
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ConnectionId = Context.ConnectionId,
                Connected_Timestamp = DateTime.UtcNow
            });

            var user = await _unitOfWork.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user != null)
                user.User_Status = "Online";

            await _unitOfWork.SaveAllAsync();
            await base.OnConnectedAsync();
        }

        // 🔹 User disconnects
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var connection = await _unitOfWork.UserConnection
                .FirstOrDefaultAsync(x => x.ConnectionId == Context.ConnectionId);

            if (connection != null)
            {
                _unitOfWork.UserConnection.Delete(connection);

                var stillConnected = (await _unitOfWork.UserConnection
                    .FindAsync(x => x.UserId == connection.UserId))
                    .Any();

                if (!stillConnected)
                {
                    var user = await _unitOfWork.Users
                        .FirstOrDefaultAsync(x => x.Id == connection.UserId);

                    if (user != null)
                        user.User_Status = "Offline";
                }

                await _unitOfWork.SaveAllAsync();
            }

            await base.OnDisconnectedAsync(exception);
        }

        // 🔹 Join chat (private or group)
        public async Task JoinConversation(Guid conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        // 🔹 Leave chat
        public async Task LeaveConversation(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        // 🔹 Send message
        public async Task SendMessage(Guid conversationId, string messageText)
        {
            var senderId = GetUserId();
            if (senderId == Guid.Empty)
                return;

            var message = new Message
            {
                Id = Guid.NewGuid(),
                ConversationId = conversationId,
                SenderId = senderId,
                MessageText = messageText,
                MessageStatus = "Sent",
                Sent_Timestamp = DateTime.UtcNow
            };

            await _unitOfWork.Message.AddAsync(message);
            await _unitOfWork.SaveAllAsync();

            await Clients.Group(conversationId.ToString())
                .SendAsync("ReceiveMessage", new
                {
                    message.Id,
                    message.ConversationId,
                    message.SenderId,
                    message.MessageText,
                    message.Sent_Timestamp
                });
        }

        // 🔐 Extract UserId from JWT
        private Guid GetUserId()
        {
            var claim = Context.User?.Claims
                .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

            return claim != null ? Guid.Parse(claim.Value) : Guid.Empty;
        }
    }
}
