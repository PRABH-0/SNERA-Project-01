namespace Snera_Core.Models.HelperModels
{
    public class CommonResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public CommonResponse(bool success, string message)
        {
            Success = success;
            Message = message;
        }
    }
}
