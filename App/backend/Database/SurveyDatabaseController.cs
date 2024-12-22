using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class SurveyDatabaseController
    {
        private readonly SystemDbContext _context;

        public SurveyDatabaseController(SystemDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddSurveyAsync(Survey survey)
        {
            try
            {
                await _context.Surveys.AddAsync(survey);
                await _context.SaveChangesAsync();
                return survey.ID;
            }
            catch
            {
                return 0;
            }
        }

        public async Task<Survey?> GetSurveyAsync(int surveyId)
        {
            var survey = await _context.Surveys.FirstOrDefaultAsync(s => s.ID == surveyId);
            return survey;
        }

        public async Task<List<Survey>> GetAllSurveysAsync()
        {
            return await _context.Surveys.ToListAsync();
        }
    }
}
