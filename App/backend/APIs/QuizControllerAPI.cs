using backend.Database;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/quiz")]
    public class QuizController : ControllerBase
    {
        private readonly QuizDatabaseController _quizDb;
        private readonly VisitorDatabaseController _visitorDb;

        public QuizController(QuizDatabaseController quizDb, VisitorDatabaseController visitorDb)
        {
            _quizDb = quizDb;
            _visitorDb = visitorDb;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateQuiz([FromQuery] int surveyId)
        {
            var code = await _quizDb.CreateQuizAsync(surveyId);
            return Ok(new { Code = code });
        }

        [HttpPut("{code}/start")]
        public async Task<IActionResult> StartQuiz(string code)
        {
            var success = await _quizDb.StartQuizAsync(code);
            return success ? Ok("Quiz started.") : BadRequest("Cannot start quiz.");
        }

        [HttpPut("{code}/end")]
        public async Task<IActionResult> EndQuiz(string code)
        {
            var success = await _quizDb.EndQuizAsync(code);
            return success ? Ok("Quiz ended.") : BadRequest("Cannot end quiz.");
        }

        
        [HttpPost("{code}/add-visitor-answer")]
        public async Task<IActionResult> AddVisitorAnswer(string code, [FromBody] VisitorAnswer visitorAnswer)
        {
            // Validate input fields
            if (visitorAnswer == null)
            {
                return BadRequest("VisitorAnswer cannot be null.");
            }
            if (visitorAnswer.VisitorId <= 0)
            {
                return BadRequest("VisitorId must be greater than 0.");
            }
            if (visitorAnswer.answers == null || !visitorAnswer.answers.Any())
            {
                return BadRequest("Answers must contain at least one answer.");
            }

            bool success = await _quizDb.AddVisitorAnswerAsync(code, visitorAnswer);

            if (!success)
            {
                return BadRequest("Could not add VisitorAnswer. Check if the quiz exists, is started, and not finished.");
            }

            return Ok("VisitorAnswer added successfully.");
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> GetQuizByCode(string code)
        {
            var quiz = await _quizDb.GetQuizByCodeAsync(code);
            if (quiz == null)
            {
                return NotFound("Quiz not found.");
            }
            return Ok(quiz);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var quizzes = await _quizDb.GetAllQuizzesAsync();
            return Ok(quizzes);
        }

        
    }
}
