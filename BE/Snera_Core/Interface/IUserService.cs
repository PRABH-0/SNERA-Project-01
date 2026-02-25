using Snera_Core.Entities.UserEntities;
using Snera_Core.Models.UserModels;

public interface IUserService
{
    Task<User> RegisterUserAsync(UserRegisterModel dto);
    Task<LoginResponseModel> LoginUserAsync(UserLoginModel dto);
    Task<string> RefreshTokenAsync(string token);
    Task<IEnumerable<UserModel>> GetAllUsersAsync(bool onlyActiveUsers);
    Task<UserModel?> GetUserByIdAsync(Guid userId);
    Task<string> SoftDeleteUserAsync(Guid userId);
    Task<string> UpdateUserAsync(UpdateUserModel dto); // No userId parameter
    Task<string> LogoutAsync(string refreshToken);
    Task<string> PatchUserAsync(UserModel dto); // No userId parameter
    Task<UserProfileResponseModel> GetUserProfileAsync(); // No userId parameter
    Task<string> UpdateUserProfileAsync(UpdateUserProfileModel dto); // No userId parameter
    Task<UserProfileResponseModel> GetCurrentUserAsync(); // No userId parameter
    Task<string> PatchUserProfileAsync(UpdateUserProfileModel dto); // No userId parameter
}