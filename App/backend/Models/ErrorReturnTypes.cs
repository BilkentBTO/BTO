namespace backend.Models
{
    public enum ErrorTypes
    {
        Success = 0,
        UserNotFound = 1,
        TourNotFound = 2,
        InvalidTourID = 3,
        InvalidUserID = 4,
        InvalidUserName = 5,
        InvalidMail = 6,
        InvalidSurname = 7,
        UserAlreadyExists = 8,
    }
}
