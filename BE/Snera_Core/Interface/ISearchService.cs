using Snera_Core.Models.SearchModels;

namespace Snera_Core.Interface
{
    public interface ISearchService
    {
        Task<GlobalSearchResponseModel> GlobalSearchAsync(string query);
    }
}
