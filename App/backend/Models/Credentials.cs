using BCrypt.Net;

namespace backend.Models
{
    public enum LoginStatus
    {
        WrongUsername = 0,
        WrongPassword = 1,
        Success = 2,
    }

    public class Credential
    {
        public string? Username { get; private set; }
        public string? Password { get; private set; }
        public UserType UserType { get; set; } = UserType.Invalid; //Defaults to Invalid
        public int UID { get; set; }
        private static int JWTCryptWorkFactor = 12;

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

        public Credential() { }

        public bool VerifyLogin(string plainPassword)
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, this.Password);
        }

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
