namespace Snera_Core.Models.HelperModels
{
    public class FilterModel
    {
        public int PageNumber { get; set; } = 1;     
        public int PageSize { get; set; } = 10;    
        
        public Guid? User_Id { get; set; }
        public bool IsDescending { get; set; } = true;           

    }
}
