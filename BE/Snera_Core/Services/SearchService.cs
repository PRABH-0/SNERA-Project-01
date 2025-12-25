using Snera_Core.Interface;
using Snera_Core.Models.SearchModels;
using Snera_Core.UnitOfWork;

namespace Snera_Core.Services
{
    public class SearchService : ISearchService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<GlobalSearchResponseModel> GlobalSearchAsync(string query)
        {
            query = query?.Trim() ?? string.Empty;


            var usersByText = await _unitOfWork.Users.FindAsync(u =>
                u.Record_State == "Active" &&
                (
                    u.FullName.Contains(query) ||
                    u.Email.Contains(query) ||
                    u.CurrentRole.Contains(query) ||
                    u.Experience.Contains(query)
                ));

            var userSkillsByQuery = await _unitOfWork.UserSkills.FindAsync(s =>
                s.Skill_Name.ToLower().Contains(query.ToLower()));

            var userIdsBySkill = userSkillsByQuery
                .Select(s => s.UserId)
                .Distinct()
                .ToList();

            var usersBySkill = await _unitOfWork.Users.FindAsync(u =>
                userIdsBySkill.Contains(u.Id) &&
                u.Record_State == "Active");

            var users = usersByText
                .Concat(usersBySkill)
                .GroupBy(u => u.Id)
                .Select(g => g.First())
                .ToList();

            var userIds = users.Select(u => u.Id).ToList();

            var allUserSkills = await _unitOfWork.UserSkills.FindAsync(s =>
                userIds.Contains(s.UserId) &&
                s.Record_State == "Active");

            var userSkillsLookup = allUserSkills
                .GroupBy(s => s.UserId)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.Skill_Name).Distinct().ToList()
                );

            var projectDescriptionsByText =
                await _unitOfWork.ProjectDescription.FindAsync(p =>
                    p.Record_State == "Active" &&
                    (
                        p.Project_Title.Contains(query) ||
                        p.Description.Contains(query)
                    ));

            var projectSkills = await _unitOfWork.ProjectSkill.FindAsync(ps =>
                ps.Skill_Name.Contains(query));

            var projectIdsBySkill = projectSkills
                .Select(ps => ps.Project_Id)
                .Distinct()
                .ToList();

            var projectDescriptionsBySkill =
                await _unitOfWork.ProjectDescription.FindAsync(p =>
                    projectIdsBySkill.Contains(p.Project_Id) &&
                    p.Record_State == "Active");

            var projectDescriptions = projectDescriptionsByText
                .Concat(projectDescriptionsBySkill)
                .GroupBy(p => p.Project_Id)
                .Select(g => g.First())
                .ToList();

            var projectSkillsLookup = projectSkills
                .GroupBy(ps => ps.Project_Id)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.Skill_Name).Distinct().ToList()
                );

            return new GlobalSearchResponseModel
            {
                Users = users.Select(u => new SearchUserResponseModel
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    CurrentRole = u.CurrentRole,
                    Experience = u.Experience,
                    Skills = userSkillsLookup.ContainsKey(u.Id)
    ? userSkillsLookup[u.Id]
        .Where(skill =>
            skill.Equals(query, StringComparison.OrdinalIgnoreCase))
        .ToList()
    : new List<string>()

                }).ToList(),

                Projects = projectDescriptions.Select(p => new SearchProjectResponseModel
                {
                    ProjectId = p.Project_Id,
                    Title = p.Project_Title,
                    Skills = projectSkillsLookup.ContainsKey(p.Project_Id)
                        ? projectSkillsLookup[p.Project_Id]
                        : new List<string>()
                }).ToList()
            };
        }

    }
}
