using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/quiz")]
    public class QuizController : ControllerBase
    {
        private readonly QuizDatabaseController _controller;

        public QuizController(QuizDatabaseController quizController)
        {
            _controller = quizController;
        }

        [HttpGet("validate/{quizCode}")]
        public async Task<IActionResult> ValidateQuiz(string quizCode)
        {
            var result = await _controller.ValidateQuizCode(quizCode);

            return ErrorHandler.HandleError(result);
        }

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
