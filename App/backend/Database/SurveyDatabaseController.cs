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

        // Add a new survey with questions and options
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

        // Get survey by ID, including questions and options
        public async Task<Survey?> GetSurveyAsync(int surveyId)
        {
            return await _context.Surveys
                .Include(s => s.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(s => s.ID == surveyId);
        }
    }
}
