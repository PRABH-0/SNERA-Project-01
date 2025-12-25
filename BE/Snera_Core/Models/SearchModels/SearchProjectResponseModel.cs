namespace Snera_Core.Models.SearchModels
{
    public class SearchProjectResponseModel
    {
        public Guid ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;

        public List<string> Skills { get; set; } = new();
    }
}
