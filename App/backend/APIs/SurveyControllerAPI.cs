using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/survey")]
    public class SurveyController : ControllerBase
    {
        private readonly SurveyDatabaseController _controller;

        public SurveyController(SurveyDatabaseController controller)
        {
            _controller = controller;
        }

        // Create a new survey with questions
        [HttpPost("create")]
        public async Task<ActionResult> CreateSurvey([FromBody] Survey survey)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var surveyId = await _controller.AddSurveyAsync(survey);
            if (surveyId == 0)
                return BadRequest("Unable to create survey.");

            return Ok(new { SurveyId = surveyId });
        }
    
        [HttpGet("{surveyId}")]
        public async Task<IActionResult> GetSurvey(int surveyId)
        {
            var survey = await _controller.GetSurveyAsync(surveyId);

            if (survey == null)
            {
                return NotFound("Survey not found.");
            }

            return Ok(survey);
        }

        //Get all surveys
        [HttpGet]
        public async Task<IActionResult> GetAllSurveys()
        {
            var surveys = await _controller.GetAllSurveysAsync();
            
            if (surveys == null || surveys.Count == 0)
            {
                return NotFound("No surveys found.");
            }

            return Ok(surveys);
        }

        //Get the number of questions in a specific survey by ID
        [HttpGet("{surveyId}/question-count")]
        public async Task<IActionResult> GetSurveyQuestionCount(int surveyId)
        {
            var survey = await _controller.GetSurveyAsync(surveyId);

            if (survey == null)
            {
                return NotFound("Survey not found.");
            }

            int questionCount = survey.Questions.Count;
            return Ok(new { SurveyId = surveyId, QuestionCount = questionCount });
        }
    }
}
