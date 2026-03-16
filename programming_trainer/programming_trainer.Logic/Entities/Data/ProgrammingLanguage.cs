//@AiCode
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace programming_trainer.Logic.Entities.Data
{
    /// <summary>
    /// Represents a programming language available in the system.
    /// </summary>
    [Table("ProgrammingLanguages")]
    [Index(nameof(Name), IsUnique = true, Name = "ProgrammingLanguage_Name_Index")]
    public partial class ProgrammingLanguage : EntityObject
    {
        #region properties

        /// <summary>
        /// Name of the programming language (e.g., C#, Java, Python).
        /// </summary>
        [MaxLength(50)]
        [Required]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// File extension for this programming language (e.g., .cs, .java, .py).
        /// </summary>
        [MaxLength(10)]
        [Required]
        public string FileExtension { get; set; } = string.Empty;

        /// <summary>
        /// Indicates whether this programming language is currently active.
        /// </summary>
        public bool IsActive { get; set; } = true;

        #endregion properties

        #region navigational properties

        /// <summary>
        /// Assignments using this programming language.
        /// </summary>
        public List<programming_trainer.Logic.Entities.App.Assignment> Assignments { get; set; } = [];

        #endregion navigational properties

        #region constructor

        /// <summary>
        /// Initializes a new instance of the ProgrammingLanguage class.
        /// </summary>
        public ProgrammingLanguage()
        {
        }

        #endregion constructor

        #region overrides

        /// <summary>
        /// Returns a string representation of the programming language.
        /// </summary>
        /// <returns>String representation.</returns>
        public override string ToString()
        {
            return $"{Name} ({FileExtension})";
        }

        #endregion overrides
    }
}
