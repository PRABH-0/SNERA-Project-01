namespace Snera_Core.Models.UserProjectModels
{
    public class CreateTimelineModel
    {
        public Guid User_Id { get; set; }
        public Guid Project_Id { get; set; }
        public string? TimeLine_Title { get; set; }
        public string? Date_TimeFrame { get; set; }
        public string? Timeline_Description { get; set; }
    }

}
