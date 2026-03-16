#if GENERATEDCODE_ON
//@CustomCode
using Microsoft.EntityFrameworkCore;
using programming_trainer.Logic.Contracts;

namespace programming_trainer.Logic.Entities.App
{
    public partial class Assignment :  IValidatableEntity
    {
        public void Validate(IContext context, EntityState entityState)
        {
            var errors = new List<string>();

            // Validate StudentId
            if (StudentId <= 0)
                errors.Add($"{nameof(StudentId)} must be greater than 0");

            // Validate StudentPrompt
            if (string.IsNullOrWhiteSpace(StudentPrompt))
                errors.Add($"{nameof(StudentPrompt)} must not be empty");
            if (StudentPrompt.Length > 500)
                errors.Add($"{nameof(StudentPrompt)} must not exceed 500 characters");

            // Validate CategoryId
            if (CategoryId <= 0)
                errors.Add($"{nameof(CategoryId)} must be greater than 0");

            // Validate Title
            if (string.IsNullOrWhiteSpace(Title))
                errors.Add($"{nameof(Title)} must not be empty");
            if (Title.Length > 100)
                errors.Add($"{nameof(Title)} must not exceed 100 characters");

            // Validate Description
            if (string.IsNullOrWhiteSpace(Description))
                errors.Add($"{nameof(Description)} must not be empty");

            // Validate Status
            var validStatuses = new[] { "Created", "InProgress", "Completed" };
            if (!validStatuses.Contains(Status))
                errors.Add($"{nameof(Status)} must be one of: {string.Join(", ", validStatuses)}");

            // Validate CreatedDate
            if (CreatedDate == default)
                errors.Add($"{nameof(CreatedDate)} must be set");
            if (CreatedDate > DateTime.UtcNow.AddMinutes(5))
                errors.Add($"{nameof(CreatedDate)} cannot be in the future");

            if (errors.Any())
                throw new ValidationException(string.Join(" | ", errors));
        }
    }
}
#endif

