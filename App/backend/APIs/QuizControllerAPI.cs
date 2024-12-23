/// <summary>
/// Controller for managing quiz operations such as validating quiz codes and handling survey form submissions.
/// </summary>
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller class for managing quiz-related operations, including validation of quiz codes and handling survey form submissions.
    /// Constraints:
    /// - `quizCode` for `ValidateQuiz` and `FillSurvey` methods must be a valid quiz code present in the database.
    /// - The `SurveyForm` parameter for the `FillSurvey` method must be a valid, non-null object.
    /// </summary>
    [ApiController]
    [Route("api/quiz")]
    public class QuizController : ControllerBase
    {
        private readonly QuizDatabaseController _controller;

        /// <summary>
        /// Initializes the QuizController with the specified quiz database controller.
        /// </summary>
        /// <param name="quizController">The QuizDatabaseController instance for interacting with the database.</param>
        public QuizController(QuizDatabaseController quizController)
        {
            _controller = quizController;
        }

        /// <summary>
        /// Validates the quiz code to ensure it is valid and exists in the system.
        /// </summary>
        /// <param name="quizCode">The unique code of the quiz to be validated.</param>
        /// <returns>A response indicating whether the quiz code is valid or an error message.</returns>
        [HttpGet("validate/{quizCode}")]
        public async Task<IActionResult> ValidateQuiz(string quizCode)
        {
            var result = await _controller.ValidateQuizCode(quizCode);

            return ErrorHandler.HandleError(result);
        }

        /// <summary>
        /// Allows a user to fill out a survey form for a specified quiz.
        /// </summary>
        /// <param name="quizCode">The unique code of the quiz for which the survey is being filled out.</param>
        /// <param name="form">The survey form containing the user's responses.</param>
        /// <returns>A response indicating whether the survey form submission was successful or failed.</returns>
        [HttpPost("fill/{quizCode}")]
        public async Task<IActionResult> FillSurvey(string quizCode, [FromBody] SurveyForm form)
        {
            if (form == null)
            {
                return BadRequest("Invalid survey form.");
            }

            var result = await _controller.FillSurveyForQuiz(quizCode, form);

            return ErrorHandler.HandleError(result);
        }
    }
}
