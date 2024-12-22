using backend.Models;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace backend.Mail
{
    public class MailController
    {
        private readonly MailSender _sender;

        private readonly SendContact SenderMailAddress = new("kerem.cindaruk@ug.bilkent.edu.tr");

        public MailController() => _sender = new MailSender();

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
