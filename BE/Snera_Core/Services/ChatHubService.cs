using Snera_Core.Entities.ChatEntities;
using Snera_Core.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snera_Core.Services
{
    public class ChatHubService : IChatHubService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ChatHubService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 🔹 Create or get private chat
        public async Task<Guid> CreatePrivateConversationAsync(Guid user1, Guid user2)
        {
            var existingConversation = (await _unitOfWork.Conversation
                .FindAsync(c =>
                    c.ConversationType == "Private" &&
                    c.Participants.Any(p => p.UserId == user1) &&
                    c.Participants.Any(p => p.UserId == user2)))
                .FirstOrDefault();

            if (existingConversation != null)
                return existingConversation.Id;

            var conversation = new Conversation
            {
                Id = Guid.NewGuid(),
                ConversationType = "Private",
                Created_Timestamp = DateTime.UtcNow,
                Participants = new List<ConversationParticipant>
                {
                    new() { Id = Guid.NewGuid(), UserId = user1 },
                    new() { Id = Guid.NewGuid(), UserId = user2 }
                }
            };

            await _unitOfWork.Conversation.AddAsync(conversation);
            await _unitOfWork.SaveAllAsync();

            return conversation.Id;
        }

        // 🔹 Get user conversations
        public async Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId)
        {
            return await _unitOfWork.Conversation
                .FindAsync(c => c.Participants.Any(p => p.UserId == userId));
        }

        // 🔹 Get chat history
        public async Task<IEnumerable<Message>> GetMessagesAsync(Guid conversationId)
        {
            return await _unitOfWork.Message
                .FindAsync(m => m.ConversationId == conversationId);
        }
    }
}
