namespace Snera_Core.Models.SearchModels
{
    public class GlobalSearchResponseModel
    {
        public List<SearchUserResponseModel> Users { get; set; } = new();
        public List<SearchProjectResponseModel> Projects { get; set; } = new();
    }
}
