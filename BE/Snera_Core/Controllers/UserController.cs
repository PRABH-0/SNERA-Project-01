using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snera_Core.Models.UserModels;
using Snera_Core.Services;
using System.Threading.Tasks;

namespace Snera_Core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel dto)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(dto);
                return CreatedAtAction(nameof(Register), new { id = user.Id }, new
                {
                    message = "User registered successfully!",
                    user.Id,
                    user.Email
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel dto)
        {
            try
            {
                var userResponse = await _userService.LoginUserAsync(dto);
                return Ok(userResponse);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(Guid id,UpdateUserModel model)
        {
            try
            {
                var userResponse = await _userService.UpdateUserAsync(id ,model);
                return Ok(userResponse);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize]
        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var userResponse = await _userService.SoftDeleteUserAsync(id);
                return Ok(userResponse);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize]
        [HttpGet("GetUserById")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            try
            {
                var userResponse = await _userService.GetUserByIdAsync(id);
                return Ok(userResponse);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize]
        [HttpGet("getall/{onlyActiveUsers}")]
        public async Task<IActionResult> GetAllUsers(bool onlyActiveUsers)
        {
            var users = await _userService.GetAllUsersAsync(onlyActiveUsers);
            return Ok(users);
        }
        [HttpPatch("PatchUser/{userId}")]
        public async Task<IActionResult> PatchUser(Guid userId, [FromBody] UserModel model)
        {
            var result = await _userService.PatchUserAsync(userId, model);
            return Ok(new { message = result });
        }
        [Authorize]
        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetUserProfile(Guid userId)
        {
            var profile = await _userService.GetUserProfileAsync(userId);
            return Ok(profile);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequestModel model)
        {
            var result = await _userService.LogoutAsync(model.RefreshToken);
            return Ok(new { message = result });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] string token)
        {
            var response = await _userService.RefreshTokenAsync(token);
            return Ok(response);
        }

    }
}
