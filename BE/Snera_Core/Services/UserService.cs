using Microsoft.AspNetCore.Identity;
using Snera_Core.Common;
using Snera_Core.Entities.UserEntities;
using Snera_Core.Models.UserModels;
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
