//@CustomCode
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace programming_trainer.Logic.Entities.App
{
    /// <summary>
    /// Represents a student's response/submission for an assignment.
    /// A student can submit multiple responses for the same assignment to improve their score.
    /// </summary>
    [Table("StudentResponse")]
    [Index(nameof(AssignmentId), nameof(SubmissionDate), Name = "StudentResponse_Assignment_Date_Index")]
    public partial class StudentResponse : EntityObject
    {
        #region properties

        /// <summary>
        /// ID of the assignment this response belongs to.
        /// </summary>
        [ForeignKey(nameof(Assignment))]
        public IdType AssignmentId { get; set; }

        /// <summary>
        /// The submitted answer/solution from the student.
        /// Can be text, code, or any other form of response depending on the assignment type.
        /// </summary>
        [Required]
        public string SubmittedAnswer { get; set; } = string.Empty;

        /// <summary>
        /// Score/grade given by the AI for this submission (0-100).
        /// </summary>
        [Range(0, 100)]
        public int Score { get; set; }

        /// <summary>
        /// Detailed feedback from the AI with improvement suggestions.
        /// </summary>
        [Required]
        public string Feedback { get; set; } = string.Empty;

        /// <summary>
        /// Date and time when this response was submitted.
        /// </summary>
        public DateTime SubmissionDate { get; set; }

        #endregion properties

        #region navigation properties

        /// <summary>
        /// Navigation property to the assignment this response belongs to.
        /// </summary>
        public Assignment? Assignment { get; set; }

        #endregion navigation properties

        #region constructor

        public StudentResponse()
        {
            SubmissionDate = DateTime.UtcNow;
        }

        #endregion constructor

        #region overrides

        public override string ToString()
        {
            return $"Response for Assignment {AssignmentId} - Score: {Score}/100 ({SubmissionDate:yyyy-MM-dd HH:mm})";
        }

        #endregion overrides
    }
}
