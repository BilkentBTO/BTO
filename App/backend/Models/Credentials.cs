/// <summary>
/// This file contains the model classes for handling user credentials and login functionality.
/// It includes the `Credential` class for storing and managing user credentials, and the `LoginStatus` enum for representing login results.
/// The `Credential` class supports user login verification and password changes using BCrypt encryption.
/// </summary>
using BCrypt.Net;

namespace backend.Models
{
    /// <summary>
    /// Enum representing the different possible statuses of a login attempt.
    /// </summary>
    public enum LoginStatus
    {
        WrongUsername = 0,
        WrongPassword = 1,
        Success = 2,
    }

    /// <summary>
    /// Represents a user's credentials in the system, including username, password, and user type.
    /// Provides methods for verifying login and changing the password.
    /// Constraints:
    /// - The `Username` and `Password` properties must be provided for creating a valid `Credential`.
    /// - `Password` is hashed using BCrypt with a work factor defined by `JWTCryptWorkFactor` (default 12).
    /// - The `UID` must be a unique identifier for each credential.
    /// - The `UserType` is set to `UserType.Invalid` by default, but can be changed during initialization.
    /// </summary>
    public class Credential
    {
        public string? Username { get; private set; }
        public string? Password { get; private set; }
        public UserType UserType { get; set; } = UserType.Invalid; //Defaults to Invalid
        public int UID { get; set; }
        private static int JWTCryptWorkFactor = 12;

        /// <summary>
        /// Constructor for initializing the `Credential` object with username, password, UID, and an optional user type.
        /// </summary>
        public Credential(
            string username,
            string plainPassword,
            int uID,
            UserType userType = UserType.Invalid
        )
        {
            Username = username;
            Password = BCrypt.Net.BCrypt.HashPassword(
                plainPassword,
                workFactor: JWTCryptWorkFactor
            );
            UserType = userType;
            UID = uID;
        }

        /// <summary>
        /// Empty constructor for initializing the `Credential` object
        /// </summary>
        public Credential() { }
        
        /// <summary>
        /// Verifies whether the provided password matches the stored hashed password.
        /// </summary>
        public bool VerifyLogin(string plainPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, this.Password);
        }

        /// <summary>
        /// Changes the password for the user if the old password is correct and the username matches.
        /// </summary>
        public bool ChangePassword(string username, string oldPlainPassword, string plainPassword)
        {
            if (!this.VerifyLogin(oldPlainPassword) || this.Username != username)
            {
                return false;
            }
            this.Password = BCrypt.Net.BCrypt.HashPassword(
                plainPassword,
                workFactor: JWTCryptWorkFactor
            );
            return true;
        }
    }
}
