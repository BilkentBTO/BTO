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

        // Create a new survey with questions and options
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

        // Get survey by ID
        [HttpGet("{surveyId}")]
        public async Task<ActionResult> GetSurvey(int surveyId)
        {
            var survey = await _controller.GetSurveyAsync(surveyId);
            if (survey == null)
                return NotFound("Survey not found.");

            return Ok(survey);
        }
    }
}
