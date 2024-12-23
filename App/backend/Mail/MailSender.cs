/// <summary>
/// This file contains the MailSender class, which is responsible for sending transactional emails using the Mailjet API.
/// The MailSender class communicates with Mailjet's transactional email service, handling email sending tasks such as
/// tour acceptance notifications, tour cancellation notices, and user-related communication (e.g., password reset, 
/// user registration confirmation).
/// </summary>
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace backend.Mail
{
    /// <summary>
    /// The MailSender class provides functionality for sending transactional emails using the Mailjet API.
    /// It is responsible for handling email sending tasks by connecting to the Mailjet transactional email service.
    /// </summary>
    public class MailSender
    {
        /// The Mailjet client used to communicate with the Mailjet API for sending emails.
        private readonly MailjetClient _client;

        /// <summary>
        /// Initializes a new instance of the <see cref="MailSender"/> class.
        /// The constructor initializes the MailjetClient with the API key and secret used for authenticating
        /// with the Mailj
        public MailSender() =>
            _client = new("f8db0a209537172c1f229f2b6eed8ab7", "bc1009fb9d29f2f899a411570d322491");

        /// <summary>
        /// Sends a transactional email using the Mailjet API.
        /// This method sends the provided email using the Mailjet API's transactional email service.
        /// </summary>
        /// <param name="mail">The transactional email to send.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result is a boolean indicating whether
        /// the email was successfully sent. The operation is considered successful if exactly one message is 
        /// returned in the API response.
        /// </returns>
        public async Task<bool> SendMail(TransactionalEmail mail)
        {
            // Sends the transactional email to Mailjet API
            var response = await _client.SendTransactionalEmailAsync(mail);

            // Returns true if exactly one message is sent; otherwise, false
            return response.Messages.Length == 1;
        }
    }
}
