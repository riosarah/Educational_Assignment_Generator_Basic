#if GENERATEDCODE_ON
using programming_trainer.Logic.Contracts;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace programming_trainer.Logic.Entities.App
{
    /// <summary>
    /// Validation logic for Student entity.
    /// </summary>
    public partial class Student : IValidatableEntity
    {
        private const int NameMinLength = 2;
        private const int StudentNumberMinLength = 3;

        /// <summary>
        /// Validates the Student entity.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="entityState">The entity state.</param>
        public void Validate(IContext context, EntityState entityState)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(FirstName))
                errors.Add($"{nameof(FirstName)} must not be empty");
            else if (FirstName.Length < NameMinLength)
                errors.Add($"{nameof(FirstName)} must be at least {NameMinLength} characters long");

            if (string.IsNullOrWhiteSpace(LastName))
                errors.Add($"{nameof(LastName)} must not be empty");
            else if (LastName.Length < NameMinLength)
                errors.Add($"{nameof(LastName)} must be at least {NameMinLength} characters long");

            if (string.IsNullOrWhiteSpace(Email))
                errors.Add($"{nameof(Email)} must not be empty");
            else if (!IsValidEmail(Email))
                errors.Add($"{nameof(Email)} must be a valid email address");

            if (string.IsNullOrWhiteSpace(StudentNumber))
                errors.Add($"{nameof(StudentNumber)} must not be empty");
            else if (StudentNumber.Length < StudentNumberMinLength)
                errors.Add($"{nameof(StudentNumber)} must be at least {StudentNumberMinLength} characters long");

            if (RegistrationDate > DateTime.Now)
                errors.Add($"{nameof(RegistrationDate)} cannot be in the future");

            if (errors.Any())
                throw new ValidationException(string.Join(" | ", errors));
        }

        /// <summary>
        /// Validates email format.
        /// </summary>
        /// <param name="email">Email to validate.</param>
        /// <returns>True if valid, false otherwise.</returns>
        private static bool IsValidEmail(string email)
        {
            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, emailPattern);
        }
    }
}
#endif