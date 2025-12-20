namespace Snera_Core.Models.UserProjectModels
{
    public class CreateTaskModel
    {
        public Guid User_Id { get; set; }
        public Guid Project_Id { get; set; }
        public string? Task_Name { get; set; }
        public DateTime? Task_End_Date { get; set; }
    }

}
