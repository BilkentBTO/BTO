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
                    new { message = "Tour Registration not found." }
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

                _ => new StatusCodeResult(500), // Fallback for unexpected errors
            };
        }
    }
}
