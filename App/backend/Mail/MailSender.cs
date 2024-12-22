using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace backend.Mail
{
    public class MailSender
    {
        private readonly MailjetClient _client;

        public MailSender() =>
            _client = new("f8db0a209537172c1f229f2b6eed8ab7", "bc1009fb9d29f2f899a411570d322491");

        public async Task<bool> SendMail(TransactionalEmail mail)
        {
            var response = await _client.SendTransactionalEmailAsync(mail);

            return response.Messages.Length == 1;
        }
    }
}
