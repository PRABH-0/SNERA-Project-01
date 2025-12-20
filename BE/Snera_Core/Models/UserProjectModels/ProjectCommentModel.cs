namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectCommentModel
    {
        public Guid Comment_Id { get; set; }
        public Guid? User_Id { get; set; }
        public string? User_Name { get; set; }
        public string? Comment_Text { get; set; }
        public DateTime? Created_At { get; set; }
    }
}
