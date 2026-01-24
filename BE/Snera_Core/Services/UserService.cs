using Microsoft.AspNetCore.Identity;
using Snera_Core.Common;
using Snera_Core.Entities.ProjectEntities;
using Snera_Core.Entities.UserEntities;
using Snera_Core.Models.UserModels;
using Snera_Core.Models.UserProjectModels;
using Snera_Core.UnitOfWork;
using System.Text.RegularExpressions;

namespace Snera_Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PasswordHasher<string> _passwordHasher;
        private readonly JwtService _tokenService;

        public UserService(IUnitOfWork unitOfWork, JwtService tokenService)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = new PasswordHasher<string>();
            _tokenService = tokenService;
        }

        public async Task<User> RegisterUserAsync(UserRegisterModel dto)
        {
            if (!Regex.IsMatch(dto.Email ?? "", @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                throw new Exception(CommonErrors.InvalidEmailFormat);

            var existingUser = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Record_State == "Active");

            if (existingUser != null)
                throw new Exception(CommonErrors.EmailAlreadyExists);

            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                throw new Exception(CommonErrors.WeakPassword);

            var hashedPassword = _passwordHasher.HashPassword(dto.Email, dto.Password);

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                FullName = dto.Full_Name,
                Avtar_Name = GenerateAvatarName(dto.Full_Name),
                Email = dto.Email,
                PasswordHash = hashedPassword,
                ProfileType = dto.Profile_Type,
                CurrentRole = dto.Current_Role,
                Experience = dto.Experience,
                Bio = dto.Bio,
                Created_Timestamp = DateTime.UtcNow,
                Record_State = "Active",
                User_Status = "Offline"
            };

            await _unitOfWork.Users.AddAsync(newUser);
            await _unitOfWork.SaveAllAsync();

            if (dto.UserSkills != null && dto.UserSkills.Any())
            {
                foreach (var skill in dto.UserSkills)
                {
                    await _unitOfWork.UserSkills.AddAsync(new UserSkill
                    {
                        Id = Guid.NewGuid(),
                        UserId = newUser.Id,
                        Skill_Name = skill,
                        Skill_Type = string.Empty,
                        Record_State = "Active"
                    });
                }

                await _unitOfWork.SaveAllAsync();
            }

            return newUser;

        }

        public async Task<LoginResponseModel> LoginUserAsync(UserLoginModel dto)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Record_State == "Active");

            if (user == null)
                throw new Exception(CommonErrors.UserNotFound);

            var result = _passwordHasher.VerifyHashedPassword(dto.Email, user.PasswordHash, dto.Password);

            if (result != PasswordVerificationResult.Success)
                throw new Exception(CommonErrors.InvalidCredentials);

            var accessToken = _tokenService.CreateToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(1) 
            };

            await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity);
            await _unitOfWork.SaveAllAsync();


            return new LoginResponseModel
            {
                UserId = user.Id,
                UserName = user.FullName,
                LoginResponseString = "Login successful",
                UserEmail = dto.Email,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }
        public async Task<LoginResponseModel> RefreshTokenAsync(string token)
        {
            var storedToken = await _unitOfWork.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == token && !t.IsRevoked);

            if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
                throw new Exception("Invalid refresh token");

            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == storedToken.UserId);

            if (user == null)
                throw new Exception("User not found");

            storedToken.IsRevoked = true;

            var newRefreshToken = _tokenService.GenerateRefreshToken();

            await _unitOfWork.RefreshTokens.AddAsync(new RefreshToken
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Token = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            var newAccessToken = _tokenService.CreateToken(user);


            await _unitOfWork.SaveAllAsync();

            return new LoginResponseModel
            {
                UserId = user.Id,
                UserName = user.FullName,
                UserEmail = user.Email,
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task<IEnumerable<UserModel>> GetAllUsersAsync(bool onlyActiveUsers)
        {
            IEnumerable<User> users = onlyActiveUsers
                ? await _unitOfWork.Users.FindAsync(u => u.Record_State == "Active")
                : await _unitOfWork.Users.GetAllAsync();

            return users.Select(u => new UserModel
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Record_State = u.Record_State
            });
        }

        public async Task<UserModel?> GetUserByIdAsync(Guid userId)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            var skills = await _unitOfWork.UserSkills
                .FindAsync(s => s.UserId == userId);

            return new UserModel
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                ProfileType = user.ProfileType,
                CurrentRole = user.CurrentRole,
                Experience = user.Experience,
                Bio = user.Bio,
                Created_Timestamp = user.Created_Timestamp,
                User_Status = user.User_Status,
                Record_State = user.Record_State,
                UserSkills = skills.Select(s => s.Skill_Name).ToList()
            };
        }

        public async Task<string> SoftDeleteUserAsync(Guid userId)
        {
            var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return "User not found";

            if (user.Record_State == "Soft_Deleted")
                return "User already deleted";

            user.Record_State = "Soft_Deleted";

            await _unitOfWork.SaveAllAsync();
            return "User deleted successfully";
        }

        public async Task<string> UpdateUserAsync(Guid userId, UpdateUserModel dto)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.Record_State == "Active");

            if (user == null)
                return "User not found";

            user.FullName = dto.FullName;
            user.ProfileType = dto.ProfileType;
            user.CurrentRole = dto.CurrentRole;
            user.Experience = dto.Experience;
            user.Bio = dto.Bio;

            if (dto.UserSkills != null)
            {
                var oldSkills = await _unitOfWork.UserSkills.FindAsync(s => s.UserId == userId);

                foreach (var s in oldSkills)
                    _unitOfWork.UserSkills.Delete(s);

                foreach (var skill in dto.UserSkills)
                {
                    await _unitOfWork.UserSkills.AddAsync(new UserSkill
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        Skill_Name = skill,
                        Skill_Type = string.Empty
                    });
                }
            }

            await _unitOfWork.SaveAllAsync();
            return "User updated successfully";
        }
        public async Task<string> LogoutAsync(string refreshToken)
        {
            var storedToken = await _unitOfWork.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked);
            var user = (await _unitOfWork.Users.FindAsync(u => u.Id == storedToken.UserId)).FirstOrDefault();
            if (user.User_Status != "Offline")
                user.User_Status = "Offline";
            if (storedToken == null)
                return "Already logged out";

            storedToken.IsRevoked = true;

            await _unitOfWork.SaveAllAsync();

            return "Logout successful";
        }

        public async Task<string> PatchUserAsync(Guid userId, UserModel dto)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.Record_State == "Active");

            if (user == null)
                return "User not found";

            if (!string.IsNullOrWhiteSpace(dto.FullName))
            {
                user.FullName = dto.FullName;
                user.Avtar_Name = GenerateAvatarName(dto.FullName);
            }

            if (!string.IsNullOrWhiteSpace(dto.ProfileType))
                user.ProfileType = dto.ProfileType;

            if (!string.IsNullOrWhiteSpace(dto.CurrentRole))
                user.CurrentRole = dto.CurrentRole;

            if (!string.IsNullOrWhiteSpace(dto.Experience))
                user.Experience = dto.Experience;

            if (!string.IsNullOrWhiteSpace(dto.Bio))
                user.Bio = dto.Bio;

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                if (!Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                    throw new Exception(CommonErrors.InvalidEmailFormat);

                var emailExists = await _unitOfWork.Users
                    .FirstOrDefaultAsync(u =>
                        u.Email == dto.Email &&
                        u.Id != userId &&
                        u.Record_State == "Active");

                if (emailExists != null)
                    throw new Exception(CommonErrors.EmailAlreadyExists);

                user.Email = dto.Email;
            }


            if (dto.UserSkills != null)
            {
                var oldSkills = await _unitOfWork.UserSkills
                    .FindAsync(s => s.UserId == userId);

                foreach (var s in oldSkills)
                    _unitOfWork.UserSkills.Delete(s);

                foreach (var skill in dto.UserSkills)
                {
                    await _unitOfWork.UserSkills.AddAsync(new UserSkill
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        Skill_Name = skill,
                        Skill_Type = string.Empty
                    });
                }
            }

            await _unitOfWork.SaveAllAsync();
            return "User updated successfully (partial)";
        }
        public async Task<UserProfileResponseModel> GetUserProfileAsync(Guid userId)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.Record_State == "Active");

            if (user == null)
                throw new Exception("User not found");

            var skills = (await _unitOfWork.UserSkills
                .FindAsync(s => s.UserId == userId && s.Record_State == "Active"))
                ?? Enumerable.Empty<UserSkill>();

            var preferences = (await _unitOfWork.UserPreference
                .FindAsync(p => p.UserId == userId && p.Record_State == "Active"))
                ?? Enumerable.Empty<UserPreference>();

            var profileDetail = await _unitOfWork.UserProfileDetail
                .FirstOrDefaultAsync(p => p.UserId == userId && p.Record_State == "Active");

            var projects = (await _unitOfWork.UserProject
                .FindAsync(p => p.Record_State == "Active"))
                ?? Enumerable.Empty<UserProject>();

            var userProjects = projects
                .Where(p => p.ProjectTeamMembers != null &&
                            p.ProjectTeamMembers.Any(m => m.User_Id == userId))
                .ToList();
            var links = (await _unitOfWork.UserLinks
    .FindAsync(l => l.UserId == userId && l.Record_State == "Active"))
    ?? Enumerable.Empty<UserLink>();

            return new UserProfileResponseModel
            {
                // ✅ BASIC INFO
                UserId = user.Id,
                Name = user.FullName ?? "",
                Title = user.CurrentRole ?? "",
                ProfileType = user.ProfileType ?? "",
                ExperienceLevel = user.Experience ?? "",

                // ✅ ABOUT
                Bio = user.Bio ?? "",
                Location = profileDetail?.Location ?? "",
                Availability = profileDetail?.Availability ?? "",
                PreferredRole = profileDetail?.PreferredRole ?? "",
                Education = profileDetail?.Education ?? "",

                // ✅ CONTACT
                Email = links.FirstOrDefault(l => l.LinkType == "EMAIL")?.LinkValue
        ?? user.Email ?? "",

                GitHub = links.FirstOrDefault(l => l.LinkType == "GITHUB")?.LinkValue ?? "",

                LinkedIn = links.FirstOrDefault(l => l.LinkType == "LINKEDIN")?.LinkValue ?? "",


                // ✅ STATS
                ProjectsCount = userProjects.Count,
                ConnectionsCount = 0,
                YearsOfExperience = ExtractYears(user.Experience),

                // ✅ SKILLS
                SkillsHave = skills
                    .Where(s => s.Skill_Type == "HAVE")
                    .Select(s => s.Skill_Name)
                    .ToList(),

                SkillsNeed = skills
                    .Where(s => s.Skill_Type == "NEED")
                    .Select(s => s.Skill_Name)
                    .ToList(),

                // ✅ PREFERENCES
                ProjectTypes = preferences
                    .Where(p => p.PreferenceType == "PROJECT_TYPE")
                    .Select(p => p.PreferenceValue)
                    .ToList(),

                WorkTypes = preferences
                    .Where(p => p.PreferenceType == "WORK_TYPE")
                    .Select(p => p.PreferenceValue)
                    .ToList(),

                // ✅ PROJECTS
                Projects = userProjects.Select(p => new ProjectResponseModel
                {
                    IsEditable = p.ProjectTeamMembers != null &&
                                 p.ProjectTeamMembers.Any(m => m.User_Id == userId),

                    DisplayJoinTeamButton = p.ProjectTeamMembers == null ||
                                            !p.ProjectTeamMembers.Any(m => m.User_Id == userId),

                    Project = new ProjectDto
                    {
                        Id = p.Id,
                        Created_Timestamp = p.Created_Timestamp
                    },

                    ProjectDescription = p.ProjectDescription?
                        .Select(d => new ProjectDescriptionDto
                        {
                            Description = d.Description
                        })
                        .FirstOrDefault(),

                    SkillsHave = p.ProjectSkills?
                        .Where(s => s.Skill_Type == "HAVE")
                        .Select(s => s.Skill_Name)
                        .ToList() ?? new(),

                    SkillsNeed = p.ProjectSkills?
                        .Where(s => s.Skill_Type == "NEED")
                        .Select(s => s.Skill_Name)
                        .ToList() ?? new(),

                    TeamMembers = p.ProjectTeamMembers?
                        .Select(m => new TeamMemberDto
                        {
                            User_Id = m.User_Id
                        })
                        .ToList() ?? new(),

                    CurrentTasks = p.ProjectCurrentTasks?
                        .Select(t => new TaskDto
                        {
                            Task_Name = t.Task_Name,
                            Is_Completed = t.Is_Completed
                        })
                        .ToList() ?? new(),

                    Timelines = p.ProjectTimelines?
                        .Select(t => new TimelineDto
                        {
                            TimeLine_Title = t.TimeLine_Title,
                            Date_TimeFrame = t.Date_TimeFrame
                        })
                        .ToList() ?? new(),

                    DeveloperRequests = p.ProjectDeveloperRequest?
                        .Select(r => new DeveloperRequestDto
                        {
                            Record_State = r.Record_State
                        })
                        .ToList() ?? new(),

                    ResourceLinks = p.ResourseLinks?
                        .Select(r => new ResourceLinkDto
                        {
                            Link = r.Link
                        })
                        .ToList() ?? new()

                }).ToList(),

                // ✅ DATE
                JoinDate = user.Created_Timestamp
            };
        }
        public async Task<string> UpdateUserProfileAsync(Guid userId, UpdateUserProfileModel dto)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.Record_State == "Active");

            if (user == null)
                throw new Exception("User not found");

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.FullName = dto.Name;
                user.Avtar_Name = GenerateAvatarName(dto.Name);
            }

            if (!string.IsNullOrWhiteSpace(dto.Title))
                user.CurrentRole = dto.Title;

            if (!string.IsNullOrWhiteSpace(dto.ProfileType))
                user.ProfileType = dto.ProfileType;

            if (!string.IsNullOrWhiteSpace(dto.ExperienceLevel))
                user.Experience = dto.ExperienceLevel;

            if (!string.IsNullOrWhiteSpace(dto.Bio))
                user.Bio = dto.Bio;

            var profileDetail = await _unitOfWork.UserProfileDetail
                .FirstOrDefaultAsync(p => p.UserId == userId && p.Record_State == "Active");

            if (profileDetail == null)
            {
                profileDetail = new UserProfileDetail
                {
                    Id = Guid.NewGuid(),
                    UserId = userId
                };

                await _unitOfWork.UserProfileDetail.AddAsync(profileDetail);
            }

            profileDetail.Location = dto.Location ?? profileDetail.Location;
            profileDetail.Availability = dto.Availability ?? profileDetail.Availability;
            profileDetail.PreferredRole = dto.PreferredRole ?? profileDetail.PreferredRole;
            profileDetail.Education = dto.Education ?? profileDetail.Education;

            if (dto.SkillsHave != null || dto.SkillsNeed != null)
            {
                var oldSkills = await _unitOfWork.UserSkills
                    .FindAsync(s => s.UserId == userId);

                foreach (var s in oldSkills)
                    _unitOfWork.UserSkills.Delete(s);

                if (dto.SkillsHave != null)
                {
                    foreach (var skill in dto.SkillsHave)
                    {
                        await _unitOfWork.UserSkills.AddAsync(new UserSkill
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            Skill_Name = skill,
                            Skill_Type = "HAVE",
                            Record_State = "Active"
                        });
                    }
                }

                if (dto.SkillsNeed != null)
                {
                    foreach (var skill in dto.SkillsNeed)
                    {
                        await _unitOfWork.UserSkills.AddAsync(new UserSkill
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            Skill_Name = skill,
                            Skill_Type = "NEED",
                            Record_State = "Active"
                        });
                    }
                }
            }

            if (dto.ProjectTypes != null || dto.WorkTypes != null)
            {
                var oldPrefs = await _unitOfWork.UserPreference
                    .FindAsync(p => p.UserId == userId);

                foreach (var p in oldPrefs)
                    _unitOfWork.UserPreference.Delete(p);

                if (dto.ProjectTypes != null)
                {
                    foreach (var val in dto.ProjectTypes)
                    {
                        await _unitOfWork.UserPreference.AddAsync(new UserPreference
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            PreferenceType = "PROJECT_TYPE",
                            PreferenceValue = val,
                            Record_State = "Active"
                        });
                    }
                }

                if (dto.WorkTypes != null)
                {
                    foreach (var val in dto.WorkTypes)
                    {
                        await _unitOfWork.UserPreference.AddAsync(new UserPreference
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            PreferenceType = "WORK_TYPE",
                            PreferenceValue = val,
                            Record_State = "Active"
                        });
                    }
                }
            }

            await _unitOfWork.SaveAllAsync();
            return "Profile updated successfully";
        }
        public async Task<string> PatchUserProfileAsync(Guid userId, UpdateUserProfileModel dto)
        {
            var user = await _unitOfWork.Users
                .FirstOrDefaultAsync(u => u.Id == userId && u.Record_State == "Active");

            if (user == null)
                throw new Exception("User not found");

            // 1️⃣ BASIC FIELDS
            if (dto.Name != null)
            {
                user.FullName = dto.Name;
                user.Avtar_Name = GenerateAvatarName(dto.Name);
            }

            if (dto.Title != null) user.CurrentRole = dto.Title;
            if (dto.ProfileType != null) user.ProfileType = dto.ProfileType;
            if (dto.ExperienceLevel != null) user.Experience = dto.ExperienceLevel;
            if (dto.Bio != null) user.Bio = dto.Bio;

            // 2️⃣ PROFILE DETAILS
            if (
                dto.Location != null ||
                dto.Availability != null ||
                dto.PreferredRole != null ||
                dto.Education != null
            )
            {
                var profileDetail = await _unitOfWork.UserProfileDetail
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.Record_State == "Active");

                if (profileDetail == null)
                {
                    profileDetail = new UserProfileDetail
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        Record_State = "Active"
                    };

                    await _unitOfWork.UserProfileDetail.AddAsync(profileDetail);
                }

                if (dto.Location != null) profileDetail.Location = dto.Location;
                if (dto.Availability != null) profileDetail.Availability = dto.Availability;
                if (dto.PreferredRole != null) profileDetail.PreferredRole = dto.PreferredRole;
                if (dto.Education != null) profileDetail.Education = dto.Education;
            }

            // 3️⃣ SKILLS
            if (dto.SkillsHave != null || dto.SkillsNeed != null)
            {
                var oldSkills = await _unitOfWork.UserSkills
                    .FindAsync(s => s.UserId == userId);

                foreach (var s in oldSkills)
                    _unitOfWork.UserSkills.Delete(s);

                if (dto.SkillsHave != null)
                {
                    foreach (var skill in dto.SkillsHave)
                    {
                        await _unitOfWork.UserSkills.AddAsync(new UserSkill
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            Skill_Name = skill,
                            Skill_Type = "HAVE",
                            Record_State = "Active"
                        });
                    }
                }

                if (dto.SkillsNeed != null)
                {
                    foreach (var skill in dto.SkillsNeed)
                    {
                        await _unitOfWork.UserSkills.AddAsync(new UserSkill
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            Skill_Name = skill,
                            Skill_Type = "NEED",
                            Record_State = "Active"
                        });
                    }
                }
            }

            // 4️⃣ PREFERENCES
            if (dto.ProjectTypes != null || dto.WorkTypes != null)
            {
                var oldPrefs = await _unitOfWork.UserPreference
                    .FindAsync(p => p.UserId == userId);

                foreach (var p in oldPrefs)
                    _unitOfWork.UserPreference.Delete(p);

                if (dto.ProjectTypes != null)
                {
                    foreach (var val in dto.ProjectTypes)
                    {
                        await _unitOfWork.UserPreference.AddAsync(new UserPreference
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            PreferenceType = "PROJECT_TYPE",
                            PreferenceValue = val,
                            Record_State = "Active"
                        });
                    }
                }

                if (dto.WorkTypes != null)
                {
                    foreach (var val in dto.WorkTypes)
                    {
                        await _unitOfWork.UserPreference.AddAsync(new UserPreference
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            PreferenceType = "WORK_TYPE",
                            PreferenceValue = val,
                            Record_State = "Active"
                        });
                    }
                }
            }

            // 5️⃣ LINKS (THIS WAS THE BROKEN PART)
            if (
                dto.Email != null ||
                dto.GitHub != null ||
                dto.LinkedIn != null
            )
            {
                await UpsertUserLink(userId, "EMAIL", dto.Email);
                await UpsertUserLink(userId, "GITHUB", dto.GitHub);
                await UpsertUserLink(userId, "LINKEDIN", dto.LinkedIn);
            }

            // ✅ SAVE EVERYTHING AT THE END
            await _unitOfWork.SaveAllAsync();

            return "Profile patched successfully";
        }

        private async Task UpsertUserLink(
    Guid userId,
    string linkType,
    string? value
)
        {
            var existing = await _unitOfWork.UserLinks
                .FirstOrDefaultAsync(l =>
                    l.UserId == userId &&
                    l.LinkType == linkType &&
                    l.Record_State == "Active");
            
            if (string.IsNullOrWhiteSpace(value))
            {
                if (existing != null)
                    _unitOfWork.UserLinks.Delete(existing);

                return;
            }
            if (existing == null)
            {
                await _unitOfWork.UserLinks.AddAsync(new UserLink
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    LinkType = linkType,
                    LinkValue = value,
                    Record_State = "Active",
                    Created_Timestamp = DateTime.UtcNow
                });
            }
            else
            {
                existing.LinkValue = value;
            }
        }

        private static int ExtractYears(string experience)
        {
            if (string.IsNullOrWhiteSpace(experience))
                return 0;

            var match = Regex.Match(experience, @"\d+");
            return match.Success ? int.Parse(match.Value) : 0;
        }

        private static string GenerateAvatarName(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                return string.Empty;

            var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length == 1
                ? parts[0].Substring(0, Math.Min(2, parts[0].Length)).ToUpper()
                : $"{parts.First()[0]}{parts.Last()[0]}".ToUpper();
        }
    }
}
