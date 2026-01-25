using Snera_Core.Entities.ChatEntities;
using Snera_Core.Models.ChatHubModels;
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

        public async Task<IEnumerable<ConversationResponseDto>> GetUserConversationsAsync(Guid userId)
        {
            var conversations = await _unitOfWork.Conversation
                .FindAsync(c => c.Participants.Any(p => p.UserId == userId));

            var response = new List<ConversationResponseDto>();

            foreach (var conversation in conversations)
            {
                var participants = (await _unitOfWork.ConversationParticipant
                    .FindAsync(p => p.ConversationId == conversation.Id))
                    .ToList();

                var participantUserIds = participants.Select(p => p.UserId).Distinct().ToList();

                var users = await _unitOfWork.Users
                    .FindAsync(u => participantUserIds.Contains(u.Id));

                var userLookup = users.ToDictionary(u => u.Id, u => u);

                var messages = (await _unitOfWork.Message
                    .FindAsync(m => m.ConversationId == conversation.Id))
                    .OrderBy(m => m.Sent_Timestamp)
                    .ToList();

                string groupName;

                if (participants.Count == 2)
                {
                    var otherUserId = participants.First(p => p.UserId != userId).UserId;
                    groupName = userLookup.ContainsKey(otherUserId)
                        ? userLookup[otherUserId].FullName
                        : "Unknown User";
                }
                else
                {
                    groupName = conversation.GroupName ?? "Group Chat";
                }

                response.Add(new ConversationResponseDto
                {
                    Id = conversation.Id,
                    ConversationType = conversation.ConversationType,
                    Created_Timestamp = conversation.Created_Timestamp,
                    GroupName = groupName,

                    Participants = participants.Select(p => new ParticipantDto
                    {
                        UserId = p.UserId,
                        Role = p.Role,
                        isOnline = userLookup.ContainsKey(p.UserId) &&
                                   userLookup[p.UserId].User_Status == "Online"
                    }).ToList(),

                    Messages = messages.Select(m => new MessageDto
                    {
                        Sender = m.SenderId == userId
                            ? "You"
                            : userLookup.GetValueOrDefault(m.SenderId)?.FullName ?? "Unknown User",
                        Text = m.MessageText,
                        SentAt = m.Sent_Timestamp
                    }).ToList()
                });
            }

            return response;
        }

        public async Task<bool> UpdateConversationAsync(Guid conversationId, UpdateConversationDto model)
        {
            var conversation = (await _unitOfWork.Conversation
                .FindAsync(c => c.Id == conversationId))
                .FirstOrDefault();

            if (conversation == null)
                return false;

            if (!string.IsNullOrWhiteSpace(model.GroupName))
                conversation.GroupName = model.GroupName;

            if (!string.IsNullOrWhiteSpace(model.ConversationType))
                conversation.ConversationType = model.ConversationType;

            _unitOfWork.Conversation.Update(conversation);
            await _unitOfWork.SaveAllAsync();

            return true;
        }

        public async Task<IEnumerable<Message>> GetMessagesAsync(Guid conversationId)
        {
            return (await _unitOfWork.Message
                .FindAsync(m => m.ConversationId == conversationId))
                .OrderBy(m => m.Sent_Timestamp);
        }
    }
}
