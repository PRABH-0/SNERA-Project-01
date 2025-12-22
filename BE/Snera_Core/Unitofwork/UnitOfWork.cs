using Microsoft.EntityFrameworkCore.Storage;
using Snera_Core.Data;
using Snera_Core.Entities;
using Snera_Core.Entities.ChatEntities;
using Snera_Core.Entities.ProjectEntities;
using Snera_Core.Entities.UserEntities;
using Snera_Core.Repositories;
using Snera_Core.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;
    private readonly Dictionary<Type, object> _repositories = new();
    private IDbContextTransaction? _transaction;
    public UnitOfWork(DataContext context)
    {
        _context = context;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        if (!_repositories.ContainsKey(typeof(T)))
            _repositories[typeof(T)] = new Repository<T>(_context);

        return (IRepository<T>)_repositories[typeof(T)];
    }


    private IRepository<User>? _userRepository;
    public IRepository<User> Users
    {
        get
        {
            if (_userRepository == null)
                _userRepository = Repository<User>();
            return _userRepository;
        }
    }

    private IRepository<UserSkill>? _userSkillRepository;
    public IRepository<UserSkill> UserSkills
    {
        get
        {
            if (_userSkillRepository == null)
                _userSkillRepository = Repository<UserSkill>();
            return _userSkillRepository;
        }
    }
    private IRepository<UserProject>? _userProjectRepository;
    public IRepository<UserProject> UserProject
    {
        get
        {
            if (_userProjectRepository == null)
                _userProjectRepository = Repository<UserProject>();
            return _userProjectRepository;
        }
    }

    private IRepository<ProjectDescription>? _projectDescriptionRepository;
    public IRepository<ProjectDescription> ProjectDescription
    {
        get
        {
            if (_projectDescriptionRepository == null)
                _projectDescriptionRepository = Repository<ProjectDescription>();
            return _projectDescriptionRepository;
        }
    }

    private IRepository<ProjectTeamMembers>? _projectTeamMembersRepository;
    public IRepository<ProjectTeamMembers> ProjectTeamMembers
    {
        get
        {
            if (_projectTeamMembersRepository == null)
                _projectTeamMembersRepository = Repository<ProjectTeamMembers>();
            return _projectTeamMembersRepository;
        }
    }

    private IRepository<ProjectCurrentTasks>? _projectCurrentTasksRepository;
    public IRepository<ProjectCurrentTasks> ProjectCurrentTasks
    {
        get
        {
            if (_projectCurrentTasksRepository == null)
                _projectCurrentTasksRepository = Repository<ProjectCurrentTasks>();
            return _projectCurrentTasksRepository;
        }
    }

    private IRepository<ProjectTaskTimeline>? _projectTaskTimelineRepository;
    public IRepository<ProjectTaskTimeline> ProjectTaskTimeline
    {
        get
        {
            if (_projectTaskTimelineRepository == null)
                _projectTaskTimelineRepository = Repository<ProjectTaskTimeline>();
            return _projectTaskTimelineRepository;
        }
    }

    private IRepository<ProjectDeveloperRequest>? _projectDeveloperRequestRepository;
    public IRepository<ProjectDeveloperRequest> ProjectDeveloperRequest
    {
        get
        {
            if (_projectDeveloperRequestRepository == null)
                _projectDeveloperRequestRepository = Repository<ProjectDeveloperRequest>();
            return _projectDeveloperRequestRepository;
        }
    }
    private IRepository<ProjectSkill>? _projectSkillRepository;
    public IRepository<ProjectSkill> ProjectSkill
    {
        get
        {
            if (_projectSkillRepository == null)
                _projectSkillRepository = Repository<ProjectSkill>();
            return _projectSkillRepository;
        }
    }

    private IRepository<ProjectLike>? _projectLikeRepository;
    public IRepository<ProjectLike> ProjectLike
    {
        get
        {
            if (_projectLikeRepository == null)
                _projectLikeRepository = Repository<ProjectLike>();
            return _projectLikeRepository;
        }
    }

    private IRepository<ProjectComment>? _projectCommentRepository;
    public IRepository<ProjectComment> ProjectComment
    {
        get
        {
            if (_projectCommentRepository == null)
                _projectCommentRepository = Repository<ProjectComment>();
            return _projectCommentRepository;
        }
    }
    private IRepository<ResourseLinks>? _resourseLnks;

    public IRepository<ResourseLinks> ResourseLinks
    {
        get
        {
            if (_resourseLnks == null)
                _resourseLnks = Repository<ResourseLinks>();
            return _resourseLnks;
        }
    }
    private IRepository<ProjectDeveloperRequestSkill>? _projectDeveloperRequestSkill;

    public IRepository<ProjectDeveloperRequestSkill> ProjectDeveloperRequestSkill
    {
        get
        {
            if (_projectDeveloperRequestSkill == null)
                _projectDeveloperRequestSkill = Repository<ProjectDeveloperRequestSkill>();
            return _projectDeveloperRequestSkill;
        }
    }
    private IRepository<RefreshToken>? _refreshTokens;
    public IRepository<RefreshToken> RefreshTokens 
    {
        get
        {
            if (_refreshTokens == null)
                _refreshTokens = Repository<RefreshToken>();
            return _refreshTokens;
        }
    }
    private IRepository<Conversation>? _conversation;
    public IRepository<Conversation> Conversation
    {
        get
        {
            if (_conversation == null)
                _conversation = Repository<Conversation>();
            return _conversation;
        }
    }
    private IRepository<ConversationParticipant>? _conversationParticipant;
    public IRepository<ConversationParticipant> ConversationParticipant
    {
        get
        {
            if (_conversationParticipant == null)
                _conversationParticipant = Repository<ConversationParticipant>();
            return _conversationParticipant;
        }
    }
    private IRepository<Message>? _message;
    public IRepository<Message> Message
    {
        get
        {
            if (_message == null)
                _message = Repository<Message>();
            return _message;
        }
    }
    private IRepository<UserConnection>? _userConnection;
    public IRepository<UserConnection> UserConnection
    {
        get
        {
            if (_userConnection == null)
                _userConnection = Repository<UserConnection>();
            return _userConnection;
        }
    }
    public async Task BeginTransactionAsync()
    {
        if (_transaction == null)
            _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
    public async Task<int> SaveAllAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
