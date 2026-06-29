namespace BIACore.Model
{
    public class UserBase
    {
        /// <summary>
        /// The user's unique identifier (sysm currently, but may change).
        /// </summary>
        public string userId { get; set; }

        /// <summary>
        /// The user's Windows login id.
        /// </summary>
        public string adId { get; set; }

        /// <summary>
        /// The user's employee id - only valid for employees.
        /// </summary>
        public string employeeId { get; set; }

        /// <summary>
        /// The user's given name.
        /// </summary>
        public string firstName { get; set; }

        /// <summary>
        /// The user's family name.
        /// </summary>
        public string lastName { get; set; }

        /// <summary>
        /// The user's email address.
        /// </summary>
        public string email { get; set; }

        /// <summary>
        /// The user's phone number, if available.
        /// </summary>
        public string phone { get; set; }

        /// <summary>
        /// The department the user reports to.
        /// </summary>
        public string department { get; set; }
        //public string businessUnitId { get; set; }


        public string regionType { get; set; }
        public string region { get; set; }
        public string district { get; set; }
        public string jobLevel { get; set; }
        public string businessUnitId { get; set; }

        public UserBase() { }
    }
}
