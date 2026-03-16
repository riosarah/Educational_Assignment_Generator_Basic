//@AiCode
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace programming_trainer.Logic.Entities.App
{
    /// <summary>
    /// Represents a student in the programming trainer system.
    /// </summary>
    [Table("Students")]
    [Index(nameof(Email), IsUnique = true, Name = "Student_Email_Index")]

    public partial class Student : EntityObject
    {
        #region properties

        /// <summary>
        /// First name of the student.
        /// </summary>
        [MaxLength(100)]
        [Required]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Last name of the student.
        /// </summary>
        [MaxLength(100)]
        [Required]
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Email address of the student.
        /// </summary>
        [MaxLength(200)]
        [Required]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Student number (unique identifier).
        /// </summary>
        [MaxLength(50)]
        [Required]
        public string StudentNumber { get; set; } = string.Empty;

        /// <summary>
        /// Date when the student registered in the system.
        /// </summary>
        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        #endregion properties

        #region navigational properties

        /// <summary>
        /// Assignments created by this student.
        /// </summary>
        public List<Assignment> Assignments { get; set; } = [];

        #endregion navigational properties

        #region constructor

        /// <summary>
        /// Initializes a new instance of the Student class.
        /// </summary>
        public Student()
        {
        }

        #endregion constructor

        #region overrides

        /// <summary>
        /// Returns a string representation of the student.
        /// </summary>
        /// <returns>String representation.</returns>
        public override string ToString()
        {
            return $"{FirstName} {LastName} ({StudentNumber})";
        }

        #endregion overrides
    }
}
