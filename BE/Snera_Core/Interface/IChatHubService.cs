using Snera_Core.Entities.ChatEntities;
using Snera_Core.Models.ChatHubModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Snera_Core.Services
{ 
    public interface IChatHubService
    {
        /// Create or get an existing one-to-one private conversation
        Task<Guid> CreatePrivateConversationAsync(Guid user1Id, Guid user2Id);

        /// Get all conversations for a specific user
        Task<IEnumerable<ConversationResponseDto>> GetUserConversationsAsync(Guid userId);


        /// Get message history for a conversation
        Task<IEnumerable<Message>> GetMessagesAsync(Guid conversationId);
        Task<bool> UpdateConversationAsync(Guid conversationId, UpdateConversationDto model);

    }
}
