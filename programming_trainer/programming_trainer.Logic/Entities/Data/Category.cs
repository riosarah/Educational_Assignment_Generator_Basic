
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace programming_trainer.Logic.Entities.Data
{
    /// <summary>
    /// Represents a category for programming assignments.
    /// </summary>
    [Table("Categories")]
    [Index(nameof(Name), IsUnique = true, Name = "Category_Name_Index")]
    public partial class Category : EntityObject
    {
        #region properties

        /// <summary>
        /// Name of the category (e.g., Sorting Algorithms, Data Structures).
        /// </summary>
        [MaxLength(100)]
        [Required]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Description of the category.
        /// </summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        #endregion properties

        #region navigational properties

        /// <summary>
        /// Assignments in this category.
        /// </summary>
        public List<programming_trainer.Logic.Entities.App.Assignment> Assignments { get; set; } = [];

        #endregion navigational properties

        #region constructor

        /// <summary>
        /// Initializes a new instance of the Category class.
        /// </summary>
        public Category()
        {
        }

        #endregion constructor

        #region overrides

        /// <summary>
        /// Returns a string representation of the category.
        /// </summary>
        /// <returns>String representation.</returns>
        public override string ToString()
        {
            return Name;
        }

        #endregion overrides
    }
}
