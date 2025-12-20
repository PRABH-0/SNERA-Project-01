namespace Snera_Core.Models.UserProjectModels
{
    public class UpdateProjectDescriptionModel
    {
        public Guid ProjectId { get; set; }

        public string Team_Name { get; set; }
        public string Project_Type { get; set; }
        public string Project_Title { get; set; }
        public string Description { get; set; }
        public string Budget { get; set; }

        public string Project_Timeline { get; set; }
        public string Project_Visibility { get; set; }
        public string Project_Status { get; set; }

        public int Team_Size { get; set; }
        public string Experience_Level { get; set; }

        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
    }
}
