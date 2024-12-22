using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class QuizDatabaseController
    {
        private readonly SystemDbContext _context;

        public QuizDatabaseController(SystemDbContext context)
        {
            _context = context;
        }

        // Create a new quiz
        public async Task<string> CreateQuizAsync(int surveyId)
        {
            var code = GenerateUniqueCode();
            var quiz = new Quiz { SurveyID = surveyId, Code = code };

            await _context.Quizzes.AddAsync(quiz);
            await _context.SaveChangesAsync();
            return code;
        }

        // Start a quiz
        public async Task<bool> StartQuizAsync(string code)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Code == code);
            if (quiz == null || quiz.IsStarted || quiz.IsFinished)
                return false;

            quiz.IsStarted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        // End a quiz
        public async Task<bool> EndQuizAsync(string code)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Code == code);
            if (quiz == null || quiz.IsFinished)
                return false;

            quiz.IsStarted = false;
            quiz.IsFinished = true;
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<(string Name, string Surname)> GetVisitorByIdAsync(int visitorId)
        {
            await Task.Delay(10);
            return ($"Name_{visitorId}", $"Surname_{visitorId}");
        }

        // Generate unique 6-character code
        private string GenerateUniqueCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(
                Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray()
            );
        }

        public async Task<bool> AddVisitorAnswerAsync(string quizCode, VisitorAnswer visitorAnswer)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Code == quizCode);

            if (quiz == null || !quiz.IsStarted || quiz.IsFinished)
            {
                return false;
            }

            var existingAnswer = quiz.VisitorAnswer.FirstOrDefault(va =>
                va.VisitorId == visitorAnswer.VisitorId
            );
            if (existingAnswer != null)
            {
                return false;
            }

            quiz.VisitorAnswer.Add(visitorAnswer);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Quiz?> GetQuizByCodeAsync(string code)
        {
            return await _context
                .Quizzes.Include(q => q.VisitorAnswer)
                .FirstOrDefaultAsync(q => q.Code == code);
        }

        public async Task<List<Quiz>> GetAllQuizzesAsync()
        {
            return await _context.Quizzes.Include(q => q.VisitorAnswer).ToListAsync();
        }
    }
}
