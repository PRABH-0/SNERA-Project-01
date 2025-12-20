using Snera_Core.Models.UserProjectModels;

public class ProjectListItemDto
{
    public Guid Project_Id { get; set; }

    public string ProjectTitle { get; set; } = string.Empty;
    public string ProjectType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Budget { get; set; } = string.Empty;
    public string Timeline { get; set; } = string.Empty;

    public int TeamSize { get; set; }
    public string ExperienceLevel { get; set; } = string.Empty;

    public string Project_Status { get; set; } = string.Empty;
    public string Project_Visibility { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string Team_Name { get; set; } = string.Empty;
    public DateTime? Start_Date { get; set; }
    public DateTime? End_Date { get; set; }

    public Guid? User_Id { get; set; }
    public string Author_Name { get; set; } = string.Empty;
    public string? Avtar_Name { get; set; }

    public List<string> SkillsHave { get; set; } = new();
    public List<string> SkillsNeed { get; set; } = new();

    public int LikeCount { get; set; }
    public bool IsLiked { get; set; }

    public int CommentCount { get; set; }
    public List<ProjectCommentModel> Comments { get; set; } = new();

    public List<string> ResourceLinks { get; set; } = new();
}
