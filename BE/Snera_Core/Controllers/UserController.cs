using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snera_Core.Models.UserModels;
using Snera_Core.Services;
using System;
using System.Threading.Tasks;

namespace Snera_Core.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
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
            await _userService.LoginUserAsync(dto);

            return Ok(new
            {
                message = "Login successful"
            });
        }


        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserModel model)
        {
            try
            {
                var userResponse = await _userService.UpdateUserAsync(model);
                return Ok(userResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            try
            {
                var userResponse = await _userService.SoftDeleteUserAsync(userId);
                return Ok(userResponse);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("get/{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            try
            {
                var userResponse = await _userService.GetUserByIdAsync(userId);
                return Ok(userResponse);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("my-profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var result = await _userService.GetCurrentUserAsync();
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("all/{onlyActiveUsers}")]
        public async Task<IActionResult> GetAllUsers(bool onlyActiveUsers)
        {
            try
            {
                var users = await _userService.GetAllUsersAsync(onlyActiveUsers);
                return Ok(users);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPatch("patch")]
        public async Task<IActionResult> PatchUser([FromBody] UserModel model)
        {
            try
            {
                var result = await _userService.PatchUserAsync(model);
                return Ok(new { message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            try
            {
                var profile = await _userService.GetUserProfileAsync();
                return Ok(profile);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // 🧹 DELETE COOKIES HERE
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Ok(new { message = "Logout successful" });
        }


        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileModel dto)
        {
            try
            {
                var result = await _userService.UpdateUserProfileAsync(dto);
                return Ok(new { message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpPatch("patch-profile")]
        public async Task<IActionResult> PatchProfile([FromBody] UpdateUserProfileModel model)
        {
            try
            {
                var result = await _userService.PatchUserProfileAsync(model);
                return Ok(new { message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refresh_token"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return Unauthorized(new { error = "Refresh token missing" });
                }

                var response = await _userService.RefreshTokenAsync(refreshToken);

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }


}