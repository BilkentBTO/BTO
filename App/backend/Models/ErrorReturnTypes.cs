using Microsoft.AspNetCore.Mvc;

namespace backend.Models
{
    public enum ErrorTypes
    {
        Success = 0,
        UserNotFound = 1,
        TourNotFound = 2,
        InvalidTourCode = 3,
        InvalidUserID = 4,
        InvalidUserName = 5,
        InvalidMail = 6,
        InvalidSurname = 7,
        UserAlreadyExists = 8,
        GuideAlreadyAppliedToTour = 9,
        TourRegistrationNotFound = 10,
        InvalidCode = 11,
        FairRegistrationNotFound = 12,
        InvalidFairCode = 13,
        InvalidIndividualCode = 14,
        IndividualRegistrationNotFound = 15,
        WrongGuideIDForTour = 16,
        TourAlreadyAccepted = 17,
        TourRegistrationNotLinkedWithSchool = 18,
        FairAlreadyAccepted = 19,
        FairRegistrationNotLinkedWithSchool = 20,
        FairNotFound = 21,
        FairDoesNotHaveTheSpecifiedGuide = 22,
    }

    public static class ErrorHandler
    {
        public static ActionResult HandleError(ErrorTypes errorType)
        {
            return errorType switch
            {
                ErrorTypes.Success => new OkObjectResult(new { message = "Operation successful." }),

                ErrorTypes.UserNotFound => new NotFoundObjectResult(
                    new { message = "User not found." }
                ),

                ErrorTypes.TourNotFound => new NotFoundObjectResult(
                    new { message = "Tour not found." }
                ),

                ErrorTypes.TourRegistrationNotFound => new NotFoundObjectResult(
                    new { message = "Tour registration not found." }
                ),

                ErrorTypes.InvalidTourCode => new BadRequestObjectResult(
                    new { message = "Invalid tour code provided." }
                ),

                ErrorTypes.InvalidCode => new BadRequestObjectResult(
                    new { message = "Invalid code provided." }
                ),

                ErrorTypes.InvalidUserID => new BadRequestObjectResult(
                    new { message = "Invalid user ID provided." }
                ),

                ErrorTypes.InvalidUserName => new BadRequestObjectResult(
                    new { message = "Invalid user name provided." }
                ),

                ErrorTypes.InvalidMail => new BadRequestObjectResult(
                    new { message = "Invalid email address provided." }
                ),

                ErrorTypes.InvalidSurname => new BadRequestObjectResult(
                    new { message = "Invalid surname provided." }
                ),

                ErrorTypes.UserAlreadyExists => new ConflictObjectResult(
                    new { message = "User already exists." }
                ),

                ErrorTypes.GuideAlreadyAppliedToTour => new ConflictObjectResult(
                    new { message = "Guide has already applied to this or another tour." }
                ),

                ErrorTypes.FairRegistrationNotFound => new NotFoundObjectResult(
                    new { message = "Fair registration not found." }
                ),

                ErrorTypes.InvalidFairCode => new BadRequestObjectResult(
                    new { message = "Invalid fair code provided." }
                ),

                ErrorTypes.InvalidIndividualCode => new BadRequestObjectResult(
                    new { message = "Invalid individual code provided." }
                ),

                ErrorTypes.IndividualRegistrationNotFound => new NotFoundObjectResult(
                    new { message = "Individual registration not found." }
                ),

                ErrorTypes.WrongGuideIDForTour => new BadRequestObjectResult(
                    new { message = "Wrong guide ID for the specified tour." }
                ),

                ErrorTypes.TourAlreadyAccepted => new ConflictObjectResult(
                    new { message = "Tour has already been accepted." }
                ),

                ErrorTypes.TourRegistrationNotLinkedWithSchool => new BadRequestObjectResult(
                    new { message = "Tour registration is not linked with the specified school." }
                ),

                ErrorTypes.FairAlreadyAccepted => new ConflictObjectResult(
                    new { message = "Fair has already been accepted." }
                ),

                ErrorTypes.FairRegistrationNotLinkedWithSchool => new BadRequestObjectResult(
                    new { message = "Fair registration is not linked with the specified school." }
                ),

                ErrorTypes.FairNotFound => new NotFoundObjectResult(
                    new { message = "Fair not found." }
                ),

                ErrorTypes.FairDoesNotHaveTheSpecifiedGuide => new BadRequestObjectResult(
                    new { message = "The fair does not have the specified guide." }
                ),

                _ => new StatusCodeResult(500), // Fallback for unexpected errors
            };
        }
    }
}
