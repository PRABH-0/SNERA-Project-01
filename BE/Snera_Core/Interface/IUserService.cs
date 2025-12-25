using Microsoft.AspNetCore.Mvc;
using Snera_Core.Entities;
using Snera_Core.Entities.UserEntities;
using Snera_Core.Models.UserModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Snera_Core.Services
{
    public interface IUserService
    {
        Task<User> RegisterUserAsync(UserRegisterModel dto);
        Task<LoginResponseModel> LoginUserAsync(UserLoginModel dto);
        Task<IEnumerable<UserModel>> GetAllUsersAsync(bool onlyActiveUsers);
        Task<string> SoftDeleteUserAsync(Guid userId);
        Task<string> UpdateUserAsync(Guid userId, UpdateUserModel dto);
        Task<UserModel?> GetUserByIdAsync(Guid userId);
        Task<LoginResponseModel> RefreshTokenAsync(string token);
        Task<string> LogoutAsync(string refreshToken);
        Task<string> PatchUserAsync(Guid userId, UserModel dto);
    }
}