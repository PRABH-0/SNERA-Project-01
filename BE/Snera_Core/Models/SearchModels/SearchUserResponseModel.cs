namespace Snera_Core.Models.SearchModels
{
    public class SearchUserResponseModel
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CurrentRole { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;

        public List<string> Skills { get; set; } = new();
    }
}
