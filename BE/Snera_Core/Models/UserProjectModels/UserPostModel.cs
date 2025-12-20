using Snera_Core.Models.UserModels;

namespace Snera_Core.Models.UserProjectModels
{
    public class UserPostModel
    {
        public Guid? User_Id { get; set; }

        // Basic Info
        public string Project_Title { get; set; } = string.Empty;
        public string Project_Description { get; set; } = string.Empty;
        public string Project_Type { get; set; } = string.Empty;
        public string Team_Name { get; set; } = string.Empty;

        // Additional Details
        public string Budget { get; set; } = string.Empty;
        public string Project_Timeline { get; set; } = string.Empty;

        public int Team_Size { get; set; } = 1;
        public string Experience_Level { get; set; } = string.Empty;

        // Dates
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }

        // Status & Visibility
        public string Project_Status { get; set; } = "Active";
        public string Project_Visibility { get; set; } = "Public";
        //links
        public List<string>? Link {  get; set; }
        public List<string>? SkillsHave { get; set; }
        public List<string>? SkillsNeed { get; set; }

    }
}
