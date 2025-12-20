namespace Snera_Core.Models.UserProjectModels
{
    public class TimelineDto
    {
        public Guid Id { get; set; }
        public string? TimeLine_Title { get; set; }
        public string? Date_TimeFrame { get; set; }
        public string? Timeline_Description { get; set; }
        public DateTime Created_At { get; set; }
    }
}
