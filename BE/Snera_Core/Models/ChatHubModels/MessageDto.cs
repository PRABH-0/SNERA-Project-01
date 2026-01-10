namespace Snera_Core.Models.ChatHubModels
{
    public class MessageDto
    {
        public string Sender { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }

}
