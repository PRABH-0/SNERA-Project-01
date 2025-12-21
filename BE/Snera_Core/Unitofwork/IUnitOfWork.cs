using Snera_Core.Entities;
using Snera_Core.Entities.ProjectEntities;
using Snera_Core.Entities.UserEntities;
using Snera_Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Snera_Core.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        // User related repositories
        IRepository<User> Users { get; }
        IRepository<UserSkill> UserSkills { get; }

        // Project related repositories
        IRepository<UserProject> UserProject { get; }
        IRepository<ProjectCurrentTasks> ProjectCurrentTasks { get; }
        IRepository<ProjectDescription> ProjectDescription { get; }
        IRepository<ProjectDeveloperRequest> ProjectDeveloperRequest { get; }
        IRepository<ProjectTaskTimeline> ProjectTaskTimeline { get; }
        IRepository<ProjectTeamMembers> ProjectTeamMembers { get; }
        IRepository<ProjectSkill> ProjectSkill { get; }
        IRepository<ProjectLike> ProjectLike { get; }
        IRepository<ProjectComment> ProjectComment { get; }
        IRepository<ResourseLinks> ResourseLinks { get; }
        IRepository<ProjectDeveloperRequestSkill> ProjectDeveloperRequestSkill { get; }
        IRepository<RefreshToken> RefreshTokens { get; }

        // Generic repository
        IRepository<T> Repository<T>() where T : class;

        // Save
        Task<int> SaveAllAsync();

        // ⭐ Transaction support (REQUIRED by ProjectService)
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
