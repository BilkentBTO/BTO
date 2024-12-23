/// <summary>
/// This file contains the MailController class, which is responsible for managing and sending transactional emails
/// related to the Bilkent Tanıtım Ofisi (BTO) system. The controller includes methods to send email notifications for 
/// various events such as tour or fair acceptance, cancellation, user registration, and password reset.
/// </summary>
///
/// <remarks>
/// The emails are sent using the Mailjet API, and the MailSender class is used to handle the actual sending of emails.
/// Each method builds a specific type of email using the TransactionalEmailBuilder and sends it to the relevant recipients.
///
/// Key features of the MailController:
/// - Sends email notifications about tour and fair acceptance and cancellation to relevant supervisors.
/// - Sends a welcome email to users who successfully join BTO.
/// - Sends password reset emails with a reset code to users who request a password reset.
/// </remarks>
/// 
/// <remarks>
/// This class assumes that the provided data (e.g., tour, fair, user) is valid and contains the necessary information 
/// for building and sending the email.
/// </remarks>
using backend.Models;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace backend.Mail
{
    /// <summary>
    /// This class provides functionality for sending transactional emails related to the Bilkent Tanıtım Ofisi (BTO) system.
    /// It includes methods for sending notifications about tour or fair acceptance/cancellation, user registration, and password reset.
    /// The emails are sent using the Mailjet API, leveraging a <see cref="MailSender"/> instance for the actual sending.
    /// </summary>
    public class MailController
    {
        private readonly MailSender _sender;

        // The sender's email address used in all transactional emails.
        private readonly SendContact SenderMailAddress = new("kerem.cindaruk@ug.bilkent.edu.tr");

        /// <summary>
        /// Initializes a new instance of the <see cref="MailController"/> class.
        /// Creates a new instance of the MailSender to be used for sending emails.
        /// </summary>
        public MailController() => _sender = new MailSender();

        /// <summary>
        /// Sends an email notification that a tour application has been accepted.
        /// The email is sent to the supervisor of the school associated with the tour.
        /// </summary>
        /// <param name="tour">The tour that was accepted.</param>
        /// <returns>A task representing the asynchronous operation. Returns true if the email was sent successfully, otherwise false.</returns>
        public async Task<bool> TourAccepted(Tour tour)
        {
            if (
                tour == null
                || tour.TourRegistirationInfo == null
                || tour.TourRegistirationInfo.School == null
            )
            {
                return false;
            }
            TourRegistration info = tour.TourRegistirationInfo;
            var email = new TransactionalEmailBuilder()
                .WithFrom(SenderMailAddress)
                .WithSubject("BTO - Bilkent Tur Başvurusu")
                .WithHtmlPart("<h1>Başvurunuz kabul edildi.</h1>")
                .WithTextPart($"{info.School.SchoolName}, {info.Time} tarihli tur kabul edildi.")
                .WithTo(new SendContact(info.SuperVisorMailAddress))
                .Build();

            return await _sender.SendMail(email);
        }

        /// <summary>
        /// Sends an email notification that a tour application has been cancelled.
        /// The email is sent to the supervisor of the school associated with the tour.
        /// </summary>
        /// <param name="tour">The tour that was cancelled.</param>
        /// <returns>A task representing the asynchronous operation. Returns true if the email was sent successfully, otherwise false.</returns>
        public async Task<bool> TourCancelled(Tour tour)
        {
            if (
                tour == null
                || tour.TourRegistirationInfo == null
                || tour.TourRegistirationInfo.School == null
            )
            {
                return false;
            }
            TourRegistration info = tour.TourRegistirationInfo;
            var email = new TransactionalEmailBuilder()
                .WithFrom(SenderMailAddress)
                .WithSubject("BTO - Bilkent Tur Başvurusu")
                .WithHtmlPart("<h1>Başvurunuz iptal edildi.</h1>")
                .WithTextPart($"{info.School.SchoolName}, {info.Time} tarihli tur iptal edildi.")
                .WithTo(new SendContact(info.SuperVisorMailAddress))
                .Build();

            return await _sender.SendMail(email);
        }

        /// <summary>
        /// Sends an email notification that a fair application has been accepted.
        /// The email is sent to the supervisor of the school associated with the fair.
        /// </summary>
        /// <param name="fair">The fair that was accepted.</param>
        /// <returns>A task representing the asynchronous operation. Returns true if the email was sent successfully, otherwise false.</returns>
        public async Task<bool> FairAccepted(Fair fair)
        {
            if (
                fair == null
                || fair.FairRegistirationInfo == null
                || fair.FairRegistirationInfo.School == null
            )
            {
                return false;
            }
            FairRegistration info = fair.FairRegistirationInfo;
            var email = new TransactionalEmailBuilder()
                .WithFrom(SenderMailAddress)
                .WithSubject("BTO - Bilkent Fuar Başvurusu")
                .WithHtmlPart("<h1>Başvurunuz kabul edildi.</h1>")
                .WithTextPart($"{info.School.SchoolName}, {info.Time} tarihli tur kabul edildi.")
                .WithTo(new SendContact(info.SuperVisorMailAddress))
                .Build();

            return await _sender.SendMail(email);
        }

        /// <summary>
        /// Sends an email notification that a fair application has been cancelled.
        /// The email is sent to the supervisor of the school associated with the fair.
        /// </summary>
        /// <param name="fair">The fair that was cancelled.</param>
        /// <returns>A task representing the asynchronous operation. Returns true if the email was sent successfully, otherwise false.</returns>
        public async Task<bool> FairCancelled(Fair fair)
        {
            if (
                fair == null
                || fair.FairRegistirationInfo == null
                || fair.FairRegistirationInfo.School == null
            )
            {
                return false;
            }
            FairRegistration info = fair.FairRegistirationInfo;
            var email = new TransactionalEmailBuilder()
                .WithFrom(SenderMailAddress)
                .WithSubject("BTO - Bilkent Fuar Başvurusu")
                .WithHtmlPart("<h1>Başvurunuz iptal edildi.</h1>")
                .WithTextPart($"{info.School.SchoolName}, {info.Time} tarihli tur iptal edildi.")
                .WithTo(new SendContact(info.SuperVisorMailAddress))
                .Build();

            return await _sender.SendMail(email);
        }

        /// <summary>
        /// Sends an email notification when a user has successfully joined the Bilkent Tanıtım Ofisi (BTO).
        /// The email is sent to the user's email address.
        /// </summary>
        /// <param name="user">The user who joined the BTO.</param>
        /// <returns>A task representing the asynchronous operation. Returns true if the email was sent successfully, otherwise false.</returns>
        public async Task<bool> UserJoinedBTO(User user)
        {
            var email = new TransactionalEmailBuilder()
                .WithFrom(SenderMailAddress)
                .WithSubject("BTO - BTO Başvurusu")
                .WithHtmlPart("<h1>BTO'ya Kabul Edildiniz.</h1>")
                .WithTextPart($"{user.Name}, Bilken Tanıtım Ofisi'ne Hoş Geldiniz")
                .WithTo(new SendContact(user.Mail))
                .Build();

            return await _sender.SendMail(email);
        }

        /// <summary>
        /// Sends a password reset email to a user.
        /// The email includes a password reset code that the user can use to reset their password.
        /// </summary>
        /// <param name="user">The user requesting a password reset.</param>
        /// <param name="code">The password reset code to be included in the email.</param>
        /// <returns>A task representing the asynchronous operation. Returns true if the email was sent successfully, otherwise false.</returns>
        public async Task<bool> ForgotPassword(User user, int code)
        {
            var email = new TransactionalEmailBuilder()
                .WithFrom(SenderMailAddress)
                .WithSubject("BTO - Reset Password")
                .WithTextPart($"Your password reset code is: {code}")
                .WithTo(new SendContact(user.Mail))
                .Build();

            return await _sender.SendMail(email);
        }
    }
}
