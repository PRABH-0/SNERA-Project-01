namespace Snera_Core.Models.UserProjectModels
{
    public class CurrentTaskModel
    {
        public string Task_Name { get; set; } = string.Empty;
        public DateTime? Task_End_Date { get; set; }
        public bool Is_Trashed { get; set; } = false;
        public bool Is_Completed { get; set; }
    }
}
