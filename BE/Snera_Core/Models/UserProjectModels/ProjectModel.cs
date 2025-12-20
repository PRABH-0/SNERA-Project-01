namespace Snera_Core.Models.UserProjectModels
{
    public class ProjectModel
    {
        //UserPostModel
        public string Post_Type { get; set; } = string.Empty;//Client_Project, Skill_Showcase
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Budget { get; set; }
        public int Post_Like { get; set; }
        //UserProjectModel
        public string Team_Name { get; set; } = string.Empty;
        public string Focus_Area { get; set; } = string.Empty;
        //userPost_Details Entitie
        public string Project_Duration { get; set; } = string.Empty;
        public string Weekly_Commitment { get; set; } = string.Empty;
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string Difficulty_Level { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Team_Info { get; set; } = string.Empty;
        public int Team_Size { get; set; }
        public string Author_Bio { get; set; } = string.Empty;
        public string Author_Experience { get; set; } = string.Empty;
        public double? Author_Rating { get; set; }
        public string Project_Status { get; set; } = "Active";//active || inactive || on hold || completed
        //PostSkills Model
        public List<ProjectSkillsModel>? Skills { get; set; }

        public List<CurrentTaskModel>? Current_Tasks { get; set; }

        public List<ProjectTeamMemberModel>? Project_Team_Members { get; set; }
        public List<ProjectTimeLineModel>? Project_TimeLine_List { get; set; }
        //Progres Tracking 
        public float? Overall_Progress { get; set; }
        public int Task_Count { get; set; } = 0;
        public int Task_Completed { get; set; } = 0;
        public int Team_Member_Count { get; set; } = 0;

    }
}
