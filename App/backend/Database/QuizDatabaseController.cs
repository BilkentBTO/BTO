using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class QuizDatabaseController
    {
        private readonly SystemDbContext _SystemContext;

        public QuizDatabaseController(SystemDbContext context)
        {
            _SystemContext = context;
        }

        public async Task<ErrorTypes> ValidateQuizCode(string quizCode)
        {
            if (string.IsNullOrEmpty(quizCode))
            {
                return ErrorTypes.QuizNotFound;
            }
            var quiz = await _SystemContext
                .Quizzes.Include(q => q.Surveys)
                .FirstOrDefaultAsync(q => q.Code == quizCode);

            if (quiz == null)
            {
                return ErrorTypes.QuizNotFound;
            }
            return ErrorTypes.Success;
        }

        public async Task<ErrorTypes> FillSurveyForQuiz(string quizCode, SurveyForm form)
        {
            if (form == null)
            {
                return ErrorTypes.InvalidSurveyForm;
            }
            var quiz = await _SystemContext
                .Quizzes.Include(q => q.Surveys)
                .FirstOrDefaultAsync(q => q.Code == quizCode);

            if (quiz == null)
            {
                return ErrorTypes.QuizNotFound;
            }

            var survey = new Survey
            {
                Name = form.Name,
                Surname = form.Surname,
                RateGuide = form.RateGuide,
                RateTour = form.RateTour,
                RateBilkent = form.RateBilkent,
                ApplyToBilkent = form.ApplyToBilkent,
                Comments = form.Comments,
                QuizCode = quiz.Code,
            };

            quiz.Surveys.Add(survey);
            var guideData = await _SystemContext.GuideData.FirstOrDefaultAsync(g =>
                g.UID == quiz.UID
            );

            if (guideData == null)
            {
                guideData = new GuideData
                {
                    UID = quiz.UID,
                    AveragePoints = survey.RateGuide,
                    CompletedTours = 1,
                };

                _SystemContext.GuideData.Add(guideData);
            }
            else
            {
                guideData.AveragePoints =
                    ((guideData.AveragePoints * guideData.CompletedTours) + survey.RateGuide)
                    / (guideData.CompletedTours + 1);
                guideData.CompletedTours += 1;
            }

            var schoolData = await _SystemContext.SchoolData.FirstOrDefaultAsync(s =>
                s.SchoolCode == quiz.SchoolCode
            );

            if (schoolData == null)
            {
                schoolData = new SchoolData
                {
                    SchoolCode = quiz.SchoolCode,
                    TotalTours = 1,
                    RateTour = survey.RateTour,
                    RateBilkent = survey.RateBilkent,
                    ApplyToBilkent = survey.ApplyToBilkent,
                };

                _SystemContext.SchoolData.Add(schoolData);
            }
            else
            {
                schoolData.TotalTours += 1;
                schoolData.RateTour =
                    ((schoolData.RateTour * (schoolData.TotalTours - 1)) + survey.RateTour)
                    / schoolData.TotalTours;
                schoolData.RateBilkent =
                    ((schoolData.RateBilkent * (schoolData.TotalTours - 1)) + survey.RateBilkent)
                    / schoolData.TotalTours;
                schoolData.ApplyToBilkent =
                    (
                        (schoolData.ApplyToBilkent * (schoolData.TotalTours - 1))
                        + survey.ApplyToBilkent
                    ) / schoolData.TotalTours;
            }

            await _SystemContext.Surveys.AddAsync(survey);
            await _SystemContext.SaveChangesAsync();

            return ErrorTypes.Success;
        }
    }
}
