namespace Snera_Core.Models.UserProjectModels
{
    public class DeveloperRequestDto
    {
        public Guid Id { get; set; }
        public Guid User_Id { get; set; }
        public string User_Name { get; set; } = "Unknown";
        public string User_Email { get; set; } = "";
        public string? Project_Interested_Text { get; set; }
        public string? Project_Experience_Text { get; set; }
        public int Active_Hour { get; set; }
        public DateTime Created_At { get; set; }
        public string? Record_State { get; set; }
        public List<string> Skills { get; set; } = new();
    }

}
