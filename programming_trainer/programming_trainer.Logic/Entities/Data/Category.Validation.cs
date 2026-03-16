#if GENERATEDCODE_ON
using programming_trainer.Logic.Contracts;
using System.ComponentModel.DataAnnotations;

namespace programming_trainer.Logic.Entities.Data
{
    /// <summary>
    /// Validation logic for Category entity.
    /// </summary>
    public partial class Category : IValidatableEntity
    {
        private const int NameMinLength = 2;

        /// <summary>
        /// Validates the Category entity.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="entityState">The entity state.</param>
        public void Validate(IContext context, EntityState entityState)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(Name))
                errors.Add($"{nameof(Name)} must not be empty");
            else if (Name.Length < NameMinLength)
                errors.Add($"{nameof(Name)} must be at least {NameMinLength} characters long");

            if (errors.Any())
                throw new ValidationException(string.Join(" | ", errors));
        }
    }
}
#endif 