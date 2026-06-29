namespace BIACore.Model
{
    public class UserApp : UserBase
    {
        /// <summary>
        /// Indicates this user has multiple Application permissions.
        /// </summary>
        public bool multiple { get; set; }

        public UserApp() { }
    }
}
