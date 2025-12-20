namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectTaskResponseModel
    {
        public Guid Id { get; set; }
        public string? Task_Name { get; set; }
        public DateTime? Task_End_Date { get; set; }
        public bool Is_Completed { get; set; } = false;
        public bool Is_Trashed { get; set; } = false;
        public Guid? User_Id { get; set; }
        public string? User_Name { get; set; }
        public Guid? Project_Id { get; set; }
        public DateTime Created_At { get; set; }
    }
}
