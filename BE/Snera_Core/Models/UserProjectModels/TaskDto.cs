namespace Snera_Core.Models.UserProjectModels
{
    public class TaskDto
    {
        public Guid Id { get; set; }
        public string? Task_Name { get; set; }
        public DateTime? Task_End_Date { get; set; }
        public bool Is_Completed { get; set; }
    }
}
