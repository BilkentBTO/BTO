using System.Net.Mail;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class Seeder
    {
        private readonly SystemDbSeeder _systemDbSeeder;

        public Seeder(SystemDbSeeder SystemDbSeeder)
        {
            _systemDbSeeder = SystemDbSeeder;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            await _systemDbSeeder.SeedAsync(serviceProvider);
        }
    }

    public class SystemDbSeeder
    {
        readonly ILogger _logger;

        public SystemDbSeeder(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger("SystemDbSeederLogger");
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using (
                var serviceScope = serviceProvider
                    .GetRequiredService<IServiceScopeFactory>()
                    .CreateScope()
            )
            {
                var SystemDbContext = serviceScope.ServiceProvider.GetService<SystemDbContext>();
                if (SystemDbContext == null)
                {
                    return;
                }
                if (await SystemDbContext.Database.EnsureCreatedAsync())
                {
                    if (!await SystemDbContext.Users.AnyAsync())
                    {
                        await InsertUsersSampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Credentials.AnyAsync())
                    {
                        await InsertCredentialsSampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Surveys.AnyAsync())
                    {
                        await InsertSurveySampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Visitors.AnyAsync())
                    {
                        await InsertVisitorSampleData(SystemDbContext);
                    }
                    /*
                    if (!await SystemDbContext.Tours.AnyAsync())
                    {
                        await InsertTourSampleData(SystemDbContext);
                    }
                    if (!await SystemDbContext.Fairs.AnyAsync())
                    {
                        await InsertFairSampleData(SystemDbContext);
                    }
                    */
                }
            }
        }

        public async Task InsertUsersSampleData(SystemDbContext db)
        {
            var users = GetUsers();
            db.Users.AddRange(users);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbSeeder)}: " + exp.Message);
                throw;
            }
        }

        private List<User> GetUsers()
        {
            User sampleUser1 = new User("Admin", "AdminSurname", "admin@gmail.com");
            sampleUser1.UserType = UserType.Admin;

            User sampleUser2 = new User("Coordinator", "CoordinatorSurname", "coord@gmail.com");
            sampleUser2.UserType = UserType.Coordinator;

            User sampleUser3 = new User("Advisor", "AdvisorrSurname", "advisor@gmail.com");
            sampleUser3.UserType = UserType.Advisor;

            Guide sampleUser4 = new Guide("Guide", "GuideSurname", "guide@gmail.com");
            sampleUser4.UserType = UserType.Guide;

            User sampleUser5 = new User("Candidate", "CandidateSurname", "candidate@gmail.com");
            sampleUser5.UserType = UserType.CandidateGuide;

            var users = new List<User>
            {
                sampleUser1,
                sampleUser2,
                sampleUser3,
                sampleUser4,
                sampleUser5,
            };

            return users;
        }

        public async Task InsertFairSampleData(SystemDbContext db)
        {
            List<Fair> fairs = new List<Fair> { new Fair(), new Fair(), new Fair() };

            db.Fairs.AddRange(fairs);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbContext)}: " + exp.Message);
                throw;
            }
        }

        public async Task InsertTourSampleData(SystemDbContext db)
        {
            var sampleTourRegistration1 = new TourRegistration
            {
                Code = "T-Ankara4531",
                CityName = "Ankara",
                SchoolCode = 3438,
                Time = DateTime.SpecifyKind(
                    DateTime.Parse("2024-12-20T16:34:45.327Z"),
                    DateTimeKind.Utc
                ),
                TimeBlock = new TimeBlock(),
                NumberOfVisitors = 21,
                SuperVisorName = "Ahmet Yavuz",
                SuperVisorDuty = "Rehber",
                SuperVisorPhoneNumber = "05359594521",
                SuperVisorMailAddress = "mehmetyavuz@gmail.com",
                Notes = "İstek kabulunde telefonla arar mısınız?",
                State = RegistrationState.Accepted,
            };
            Tour sampleTour1 = new Tour
            {
                Time = sampleTourRegistration1.Time,
                TourRegistrationCode = sampleTourRegistration1.Code,
                TourRegistirationInfo = sampleTourRegistration1,
            };
            List<Tour> tours = new List<Tour> { sampleTour1 };

            db.Tours.AddRange(tours);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbContext)}: " + exp.Message);
                throw;
            }
        }

        public async Task InsertCredentialsSampleData(SystemDbContext db)
        {
            var users = await db.Users.ToListAsync();
            var creds = users
                .Select(user => new Credential(user.Mail, "123", user.ID, user.UserType))
                .ToList();

            db.Credentials.AddRange(creds);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbSeeder)}: " + exp.Message);
                throw;
            }
        }

        // Insert sample survey data
        public async Task InsertSurveySampleData(SystemDbContext db)
        {
            var surveys = new List<Survey>
            {
                new Survey
                {
                    Title = "General Knowledge Survey",
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            QuestionText = "What is the capital of France?",
                            TimeLimitInSeconds = 30,
                            Options = new List<Option>
                            {
                                new Option { OptionLabel = "A", OptionText = "Berlin" },
                                new Option { OptionLabel = "B", OptionText = "Madrid" },
                                new Option { OptionLabel = "C", OptionText = "Paris" },
                                new Option { OptionLabel = "D", OptionText = "Rome" }
                            },
                            CorrectAnswers = new List<string> { "C" }
                        },
                        new Question
                        {
                            QuestionText = "Which planet is known as the Red Planet?",
                            TimeLimitInSeconds = 30,
                            Options = new List<Option>
                            {
                                new Option { OptionLabel = "A", OptionText = "Earth" },
                                new Option { OptionLabel = "B", OptionText = "Mars" },
                                new Option { OptionLabel = "C", OptionText = "Jupiter" },
                                new Option { OptionLabel = "D", OptionText = "Saturn" }
                            },
                            CorrectAnswers = new List<string> { "B" }
                        }
                    }
                },
                new Survey
                {
                    Title = "Science Quiz",
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            QuestionText = "What is the chemical symbol for water?",
                            TimeLimitInSeconds = 20,
                            Options = new List<Option>
                            {
                                new Option { OptionLabel = "A", OptionText = "H2O" },
                                new Option { OptionLabel = "B", OptionText = "O2" },
                                new Option { OptionLabel = "C", OptionText = "CO2" },
                                new Option { OptionLabel = "D", OptionText = "NaCl" }
                            },
                            CorrectAnswers = new List<string> { "A" }
                        }
                    }
                }
            };

            db.Surveys.AddRange(surveys);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbSeeder)}: " + exp.Message);
                throw;
            }
        }

        public async Task InsertVisitorSampleData(SystemDbContext db)
        {
            var visitors = new List<Visitor>
            {
                new Visitor
                {
                    Name = "John",
                    Surname = "Doe",
                    City = "New York",
                    School = "NYU",
                    GuideName = "Alice",
                    GuideRating = 4,
                    Comment = "Great experience!"
                },
                new Visitor
                {
                    Name = "Jane",
                    Surname = "Smith",
                    City = "Los Angeles",
                    School = "UCLA",
                    GuideName = "Bob",
                    GuideRating = 4,
                    Comment = "Interesting tour."
                },
                new Visitor
                {
                    Name = "Tom",
                    Surname = "Johnson",
                    City = "Chicago",
                    School = "University of Chicago",
                    GuideName = "Charlie",
                    GuideRating = 2,
                    Comment = "Loved it!"
                },
                new Visitor
                {
                    Name = "Emily",
                    Surname = "Davis",
                    City = "San Francisco",
                    School = "Stanford University",
                    GuideName = "Dave",
                    GuideRating = 1,
                    Comment = "Very informative."
                }
            };

            db.Visitors.AddRange(visitors);
            try
            {
                await db.SaveChangesAsync();
            }
            catch (Exception exp)
            {
                _logger.LogError($"Error in {nameof(SystemDbSeeder)}: " + exp.Message);
                throw;
            }
        }

    }
}
