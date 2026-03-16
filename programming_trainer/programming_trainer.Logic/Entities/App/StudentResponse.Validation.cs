#if GENERATEDCODE_ON
//@CustomCode
using Microsoft.EntityFrameworkCore;
using programming_trainer.Logic.Contracts;

namespace programming_trainer.Logic.Entities.App
{
    public partial class StudentResponse : IValidatableEntity
    {
        public void Validate(IContext context, EntityState entityState)
        {
            var errors = new List<string>();

            // Validate AssignmentId
            if (AssignmentId <= 0)
                errors.Add($"{nameof(AssignmentId)} must be greater than 0");

            // Validate SubmittedAnswer
            if (string.IsNullOrWhiteSpace(SubmittedAnswer))
                errors.Add($"{nameof(SubmittedAnswer)} must not be empty");

            // Validate Score
            if (Score < 0 || Score > 100)
                errors.Add($"{nameof(Score)} must be between 0 and 100");

            // Validate Feedback
            if (string.IsNullOrWhiteSpace(Feedback))
                errors.Add($"{nameof(Feedback)} must not be empty");

            // Validate SubmissionDate
            if (SubmissionDate == default)
                errors.Add($"{nameof(SubmissionDate)} must be set");
            if (SubmissionDate > DateTime.UtcNow.AddMinutes(5))
                errors.Add($"{nameof(SubmissionDate)} cannot be in the future");

            if (errors.Any())
                throw new ValidationException(string.Join(" | ", errors));
        }
    }
}
#endif
