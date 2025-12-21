using Microsoft.EntityFrameworkCore;
using Snera_Core.Entities;
using Snera_Core.Entities.ProjectEntities;
using Snera_Core.Entities.UserEntities;

namespace Snera_Core.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }
        public DbSet<ProjectDescription> ProjectDescription { get; set; }
        public DbSet<ProjectCurrentTasks> ProjectCurrentTasks { get; set; }
        public DbSet<ProjectDeveloperRequest> ProjectDeveloperRequests { get; set; }
        public DbSet<ProjectTeamMembers> ProjectTeamMembers { get; set; }
        public DbSet<ProjectTaskTimeline> ProjectTimelines { get; set; }
        public DbSet<UserProject> UserProject { get; set; }
        public DbSet<ProjectSkill> ProjectSkill { get; set; }
        public DbSet<ProjectLike> ProjectLike { get; set; }
        public DbSet<ProjectComment> ProjectComment { get; set; }
        public DbSet<ResourseLinks> ResourseLinks { get; set; }
        public DbSet<ProjectDeveloperRequestSkill> ProjectDeveloperRequestSkill { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
