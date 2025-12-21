namespace Snera_Core.Models.UserModels
{
    public class LoginResponseModel
    {
        public Guid UserId { get; set; }
        public string? LoginResponseString { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? AccessToken {  get; set; }
        public string? RefreshToken { get; set; }
    }
}
