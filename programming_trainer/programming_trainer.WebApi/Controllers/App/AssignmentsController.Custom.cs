//@CustomCode
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using programming_trainer.WebApi.Models.App;
using System.Text.Json;

namespace programming_trainer.WebApi.Controllers.App
{
    /// <summary>
    /// Custom endpoints for n8n workflow integration (synchronous).
    /// </summary>
    public partial class AssignmentsController
    {
        private IConfiguration? Configuration => 
            HttpContext?.RequestServices.GetService<IConfiguration>();

        private IHttpClientFactory? HttpClientFactory => 
            HttpContext?.RequestServices.GetService<IHttpClientFactory>();

        /// <summary>
        /// Request model for generating an assignment via n8n workflow.
        /// </summary>
        public class GenerateAssignmentRequest
        {
            /// <summary>
            /// Student ID who requests the assignment.
            /// </summary>
            public IdType StudentId { get; set; }

            /// <summary>
            /// The prompt from the student describing what they want to learn.
            /// </summary>
            public string StudentPrompt { get; set; } = string.Empty;

            /// <summary>
            /// Category name for the assignment (e.g., "Programming - C#", "Mathematics - Algebra").
            /// Will be created automatically if it doesn't exist.
            /// </summary>
            public string CategoryName { get; set; } = string.Empty;

            /// <summary>
            /// Specific topic within the category (e.g., "Astronomie", "Arrays", "Algebra").
            /// Optional parameter for more focused assignments.
            /// </summary>
            public string? Topic { get; set; }

            /// <summary>
            /// Difficulty level: "easy", "medium", "hard".
            /// Optional parameter to control assignment complexity.
            /// </summary>
            public string? Difficulty { get; set; }

            /// <summary>
            /// Language code for the assignment (e.g., "de", "en").
            /// Optional parameter to specify output language.
            /// </summary>
            public string? Language { get; set; }

            /// <summary>
            /// Output format: "markdown", "text", "html".
            /// Optional parameter to control formatting.
            /// </summary>
            public string? OutputFormat { get; set; }
        }

        /// <summary>
        /// Request model for evaluating a student's submitted answer via n8n workflow.
        /// </summary>
        public class EvaluateAssignmentRequest
        {
            /// <summary>
            /// Assignment ID to evaluate.
            /// </summary>
            public IdType AssignmentId { get; set; }

            /// <summary>
            /// The answer/solution submitted by the student.
            /// </summary>
            public string SubmittedAnswer { get; set; } = string.Empty;
        }

        /// <summary>
        /// Response model from n8n workflow (assignment generation).
        /// </summary>
        public class N8nGenerateResponse
        {
            public bool Success { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string? Error { get; set; }
            public string Timestamp { get; set; } = string.Empty;
        }

        /// <summary>
        /// Response model from n8n workflow (assignment evaluation).
        /// </summary>
        public class N8nEvaluateResponse
        {
            public bool Success { get; set; }
            public int Score { get; set; }
            public string Feedback { get; set; } = string.Empty;
            public string? Error { get; set; }
            public string Timestamp { get; set; } = string.Empty;
        }

        /// <summary>
        /// Response model for workflow operations.
        /// </summary>
        public class WorkflowResponse
        {
            /// <summary>
            /// Assignment ID that was created or updated.
            /// </summary>
            public IdType AssignmentId { get; set; }

            /// <summary>
            /// Student Response ID (for evaluate endpoint).
            /// </summary>
            public IdType? ResponseId { get; set; }

            /// <summary>
            /// Status message from the workflow.
            /// </summary>
            public string Message { get; set; } = string.Empty;

            /// <summary>
            /// Indicates if the workflow was successful.
            /// </summary>
            public bool Success { get; set; }

            /// <summary>
            /// Generated title (for generate endpoint).
            /// </summary>
            public string? Title { get; set; }

            /// <summary>
            /// Generated description (for generate endpoint).
            /// </summary>
            public string? Description { get; set; }

            /// <summary>
            /// Score (for evaluate endpoint).
            /// </summary>
            public int? Score { get; set; }

            /// <summary>
            /// Feedback (for evaluate endpoint).
            /// </summary>
            public string? Feedback { get; set; }
        }

        /// <summary>
        /// Detailed assignment with statistics and latest response.
        /// </summary>
        public class AssignmentWithStats
        {
            public IdType Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string StudentPrompt { get; set; } = string.Empty;
            public string Status { get; set; } = string.Empty;
            public DateTime CreatedDate { get; set; }
            
            // Student info
            public IdType StudentId { get; set; }
            public string StudentName { get; set; } = string.Empty;
            public string StudentEmail { get; set; } = string.Empty;
            
            // Category info
            public IdType CategoryId { get; set; }
            public string CategoryName { get; set; } = string.Empty;
            
            // Statistics
            public int TotalResponses { get; set; }
            public int? BestScore { get; set; }
            public int? LatestScore { get; set; }
            public double? AverageScore { get; set; }
            
            // Latest response details
            public IdType? LatestResponseId { get; set; }
            public string? LatestAnswer { get; set; }
            public string? LatestFeedback { get; set; }
            public DateTime? LatestSubmissionDate { get; set; }
        }

        /// <summary>
        /// Statistics summary for a student.
        /// </summary>
        public class StudentAssignmentStats
        {
            public IdType StudentId { get; set; }
            public string StudentName { get; set; } = string.Empty;
            public int TotalAssignments { get; set; }
            public int CompletedAssignments { get; set; }
            public int InProgressAssignments { get; set; }
            public int CreatedAssignments { get; set; }
            public double? AverageScore { get; set; }
            public int? BestScore { get; set; }
            public int TotalResponses { get; set; }
            public List<AssignmentWithStats> Assignments { get; set; } = [];
        }

        /// <summary>
        /// Generates a new learning assignment via n8n workflow (synchronous).
        /// POST: /api/assignments/generate
        /// </summary>
        /// <param name="request">Request containing student prompt and assignment parameters.</param>
        /// <returns>Assignment details with generated content.</returns>
        [HttpPost("generate")]
        [ProducesResponseType(typeof(WorkflowResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GenerateAssignment([FromBody] GenerateAssignmentRequest request)
        {
            try
            {
                // Validate request
                if (request.StudentId <= 0)
                    return BadRequest("Invalid StudentId");
                if (string.IsNullOrWhiteSpace(request.StudentPrompt))
                    return BadRequest("StudentPrompt is required");
                if (string.IsNullOrWhiteSpace(request.CategoryName))
                    return BadRequest("CategoryName is required");

                var context = ContextAccessor.GetContext();

                // Validate that student exists
                var student = await context.StudentSet.GetByIdAsync(request.StudentId);
                if (student == null)
                    return BadRequest($"Student with ID {request.StudentId} not found");

                // Find or create category
                var allCategories = await context.CategorySet.GetAsync();
                var category = allCategories.FirstOrDefault(c => c.Name == request.CategoryName);
                
                if (category == null)
                {
                    // Create new category
                    category = new Logic.Entities.Data.Category
                    {
                        Name = request.CategoryName,
                        Description = $"Category: {request.CategoryName}"
                    };
                    
                    var addedCategory = await context.CategorySet.AddAsync(category);
                    await context.SaveChangesAsync();
                    category = addedCategory;
                }




                // Call n8n workflow (synchronous) - waits for AI response
                var n8nWebhookUrl = Configuration?["N8n:GenerateAssignmentWebhookUrl"] 
                    ?? "http://localhost:5678/webhook/generate-assignment";

                var workflowPayload = new
                {
                    studentPrompt = request.StudentPrompt,
                    categoryId = category.Id,
                    categoryName = request.CategoryName,
                    topic = request.Topic,
                    difficulty = request.Difficulty,
                    language = request.Language,
                    outputFormat = request.OutputFormat
                };

                var httpClient = HttpClientFactory?.CreateClient() ?? new HttpClient();
                httpClient.Timeout = TimeSpan.FromSeconds(60); // AI kann bis zu 60 Sekunden brauchen

                var response = await httpClient.PostAsJsonAsync(n8nWebhookUrl, workflowPayload);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new WorkflowResponse
                    {
                        Message = $"n8n workflow failed: {errorContent}",
                        Success = false
                    });
                }

                // Parse n8n response
                var n8nResponse = await response.Content.ReadFromJsonAsync<N8nGenerateResponse>();

                if (n8nResponse == null || !n8nResponse.Success)
                {
                    return StatusCode(500, new WorkflowResponse
                    {
                        Message = $"n8n workflow returned error: {n8nResponse?.Error ?? "Unknown error"}",
                        Success = false
                    });
                }

                // Create assignment entity with generated content
                var entity = new Logic.Entities.App.Assignment
                {
                    StudentId = request.StudentId,
                    StudentPrompt = request.StudentPrompt,
                    CategoryId = category.Id,
                    Title = n8nResponse.Title,
                    Description = n8nResponse.Description,
                    Status = "Created",
                    CreatedDate = DateTime.UtcNow
                };

                var addedEntity = await context.AssignmentSet.AddAsync(entity);
                await context.SaveChangesAsync();

                return Ok(new WorkflowResponse
                {
                    AssignmentId = addedEntity.Id,
                    Message = "Assignment generated successfully",
                    Success = true,
                    Title = n8nResponse.Title,
                    Description = n8nResponse.Description
                });
            }
            catch (HttpRequestException httpEx)
            {
                return StatusCode(500, new WorkflowResponse
                {
                    Message = $"Error calling n8n: {httpEx.Message}. Is n8n running?",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new WorkflowResponse
                {
                    Message = $"Error: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Evaluates a student's submitted answer via n8n workflow (synchronous).
        /// Creates a new StudentResponse entry for this submission.
        /// POST: /api/assignments/evaluate
        /// </summary>
        /// <param name="request">Request containing assignment ID and submitted answer.</param>
        /// <returns>Evaluation results with score and feedback.</returns>
        [HttpPost("evaluate")]
        [ProducesResponseType(typeof(WorkflowResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EvaluateAssignment([FromBody] EvaluateAssignmentRequest request)
        {
            try
            {
                // Validate request
                if (request.AssignmentId <= 0)
                    return BadRequest("Invalid AssignmentId");
                if (string.IsNullOrWhiteSpace(request.SubmittedAnswer))
                    return BadRequest("SubmittedAnswer is required");

                // Load assignment
                var context = ContextAccessor.GetContext();
                var entity = await context.AssignmentSet.GetByIdAsync(request.AssignmentId);

                if (entity == null)
                    return NotFound($"Assignment with ID {request.AssignmentId} not found");

                // Call n8n workflow (synchronous) - waits for AI evaluation
                var n8nWebhookUrl = Configuration?["N8n:EvaluateAssignmentWebhookUrl"] 
                    ?? "http://localhost:5678/webhook/evaluate-assignment";

                var workflowPayload = new
                {
                    submittedAnswer = request.SubmittedAnswer,
                    description = entity.Description,
                    categoryId = entity.CategoryId
                };

                var httpClient = HttpClientFactory?.CreateClient() ?? new HttpClient();
                httpClient.Timeout = TimeSpan.FromSeconds(60); // AI kann bis zu 60 Sekunden brauchen

                var response = await httpClient.PostAsJsonAsync(n8nWebhookUrl, workflowPayload);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new WorkflowResponse
                    {
                        AssignmentId = request.AssignmentId,
                        Message = $"n8n workflow failed: {errorContent}",
                        Success = false
                    });
                }

                // Parse n8n response
                var n8nResponse = await response.Content.ReadFromJsonAsync<N8nEvaluateResponse>();

                if (n8nResponse == null || !n8nResponse.Success)
                {
                    return StatusCode(500, new WorkflowResponse
                    {
                        AssignmentId = request.AssignmentId,
                        Message = $"n8n workflow returned error: {n8nResponse?.Error ?? "Unknown error"}",
                        Success = false
                    });
                }

                // Create StudentResponse entity with evaluation results
                var studentResponse = new Logic.Entities.App.StudentResponse
                {
                    AssignmentId = request.AssignmentId,
                    SubmittedAnswer = request.SubmittedAnswer,
                    Score = n8nResponse.Score,
                    Feedback = n8nResponse.Feedback,
                    SubmissionDate = DateTime.UtcNow
                };

                var addedResponse = await context.StudentResponseSet.AddAsync(studentResponse);
                await context.SaveChangesAsync();

                // Update assignment status
                entity.Status = "InProgress"; // Student has submitted at least one answer
                await context.SaveChangesAsync();

                return Ok(new WorkflowResponse
                {
                    AssignmentId = request.AssignmentId,
                    ResponseId = addedResponse.Id,
                    Message = "Assignment evaluated successfully",
                    Success = true,
                    Score = n8nResponse.Score,
                    Feedback = n8nResponse.Feedback
                });
            }
            catch (HttpRequestException httpEx)
            {
                return StatusCode(500, new WorkflowResponse
                {
                    AssignmentId = request.AssignmentId,
                    Message = $"Error calling n8n: {httpEx.Message}. Is n8n running?",
                    Success = false
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new WorkflowResponse
                {
                    AssignmentId = request.AssignmentId,
                    Message = $"Error: {ex.Message}",
                    Success = false
                });
            }
        }

        /// <summary>
        /// Gets detailed assignments with statistics for a specific student.
        /// GET: /api/assignments/student/{studentId}/with-stats
        /// </summary>
        /// <param name="studentId">ID of the student.</param>
        /// <returns>Student assignments with detailed statistics.</returns>
        [HttpGet("student/{studentId}/with-stats")]
        [ProducesResponseType(typeof(StudentAssignmentStats), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetStudentAssignmentsWithStats(IdType studentId)
        {
            try
            {
                var context = ContextAccessor.GetContext();

                // Validate student exists
                var student = await context.StudentSet.GetByIdAsync(studentId);
                if (student == null)
                    return NotFound($"Student with ID {studentId} not found");

                // Load all assignments for this student with related data
                var allAssignments = await context.AssignmentSet.GetAsync();
                var studentAssignments = allAssignments.Where(a => a.StudentId == studentId).ToList();

                // Load all categories
                var allCategories = await context.CategorySet.GetAsync();
                
                // Load all responses for these assignments
                var allResponses = await context.StudentResponseSet.GetAsync();
                var assignmentResponses = allResponses
                    .Where(r => studentAssignments.Any(a => a.Id == r.AssignmentId))
                    .GroupBy(r => r.AssignmentId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                // Build detailed assignment list
                var assignmentsWithStats = new List<AssignmentWithStats>();

                foreach (var assignment in studentAssignments)
                {
                    var responses = assignmentResponses.ContainsKey(assignment.Id) 
                        ? assignmentResponses[assignment.Id] 
                        : new List<Logic.Entities.App.StudentResponse>();

                    var latestResponse = responses
                        .OrderByDescending(r => r.SubmissionDate)
                        .FirstOrDefault();

                    var scores = responses.Where(r => r.Score > 0).Select(r => r.Score).ToList();

                    var category = allCategories.FirstOrDefault(c => c.Id == assignment.CategoryId);

                    assignmentsWithStats.Add(new AssignmentWithStats
                    {
                        Id = assignment.Id,
                        Title = assignment.Title,
                        Description = assignment.Description,
                        StudentPrompt = assignment.StudentPrompt,
                        Status = assignment.Status,
                        CreatedDate = assignment.CreatedDate,
                        StudentId = student.Id,
                        StudentName = $"{student.FirstName} {student.LastName}",
                        StudentEmail = student.Email,
                        CategoryId = assignment.CategoryId,
                        CategoryName = category?.Name ?? "Unknown",
                        TotalResponses = responses.Count,
                        BestScore = scores.Any() ? scores.Max() : null,
                        LatestScore = latestResponse?.Score,
                        AverageScore = scores.Any() ? Math.Round(scores.Average(), 2) : null,
                        LatestResponseId = latestResponse?.Id,
                        LatestAnswer = latestResponse?.SubmittedAnswer,
                        LatestFeedback = latestResponse?.Feedback,
                        LatestSubmissionDate = latestResponse?.SubmissionDate
                    });
                }

                // Calculate overall statistics
                var allScores = assignmentsWithStats
                    .Where(a => a.AverageScore.HasValue)
                    .SelectMany(a => assignmentResponses.ContainsKey(a.Id) 
                        ? assignmentResponses[a.Id].Where(r => r.Score > 0).Select(r => r.Score) 
                        : Enumerable.Empty<int>())
                    .ToList();

                var result = new StudentAssignmentStats
                {
                    StudentId = student.Id,
                    StudentName = $"{student.FirstName} {student.LastName}",
                    TotalAssignments = studentAssignments.Count,
                    CompletedAssignments = studentAssignments.Count(a => a.Status == "Completed"),
                    InProgressAssignments = studentAssignments.Count(a => a.Status == "InProgress"),
                    CreatedAssignments = studentAssignments.Count(a => a.Status == "Created"),
                    AverageScore = allScores.Any() ? Math.Round(allScores.Average(), 2) : null,
                    BestScore = allScores.Any() ? allScores.Max() : null,
                    TotalResponses = assignmentResponses.Values.Sum(r => r.Count),
                    Assignments = assignmentsWithStats.OrderByDescending(a => a.CreatedDate).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
