#if GENERATEDCODE_ON
using programming_trainer.Logic.Contracts;
using System.ComponentModel.DataAnnotations;

namespace programming_trainer.Logic.Entities.Data
{
    /// <summary>
    /// Validation logic for ProgrammingLanguage entity.
    /// </summary>
    public partial class ProgrammingLanguage : IValidatableEntity
    {
        private const int NameMinLength = 1;
        private const int FileExtensionMinLength = 2;

        /// <summary>
        /// Validates the ProgrammingLanguage entity.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="entityState">The entity state.</param>
        public void Validate(IContext context, EntityState entityState)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(Name))
                errors.Add($"{nameof(Name)} must not be empty");
            else if (Name.Length < NameMinLength)
                errors.Add($"{nameof(Name)} must be at least {NameMinLength} character long");

            if (string.IsNullOrWhiteSpace(FileExtension))
                errors.Add($"{nameof(FileExtension)} must not be empty");
            else if (FileExtension.Length < FileExtensionMinLength)
                errors.Add($"{nameof(FileExtension)} must be at least {FileExtensionMinLength} characters long");
            else if (!FileExtension.StartsWith("."))
                errors.Add($"{nameof(FileExtension)} must start with a dot (e.g., .cs)");

            if (errors.Any())
                throw new ValidationException(string.Join(" | ", errors));
        }
    }
}
#endif