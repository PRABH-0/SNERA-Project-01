namespace Snera_Core.Models.UserProjectModels
{
    public class CreateResourceLinkModel
    {
        public Guid User_Id { get; set; }
        public Guid Project_Id { get; set; }
        public string? Link { get; set; }
    }

}
