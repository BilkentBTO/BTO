using System.Collections;
using System.Linq;

using static BTO.Constrains.TimeConstrains;

namespace backend.Models
{
    public class Availability
    {
        private readonly int TimeBlockCount = Convert.ToInt32((END_HOURS - START_HOURS) * (MINUTES_PER_HOUR / TIME_INTERVAL_MINUTES));

        private bool[,] Data;

        public Availability()
        {
            Data = new bool[DAYS, TimeBlockCount];
        }
    }
    public class Survey_temp { }

    [Serializable]
    public class Comment(string comment)
    {
        public readonly int ID = comment.GetHashCode();
        public string Text = comment;
    }

    [Serializable]
    public struct TourRegistirationInfo(School school, string mailAddress, ushort studenCount)
    {
        public readonly School School = school;
        public string MailAddress = mailAddress;
        public ushort StudentCount = studenCount;
    }

    public class Tour(DateTime time, TourRegistirationInfo regInfo)
    {
        public readonly int ID = time.GetHashCode() + regInfo.GetHashCode();
        public DateTime Time { get; private set; } = time;
        public readonly TourRegistirationInfo RegistirationInfo = regInfo;

        private Guide? AssignedGuide;
        private readonly List<Guide> AssignedCandidateGuides = [];

        private Survey_temp? Survey;
        private readonly List<Comment> Comments = [];

        public int Priority => RegistirationInfo.School.GetPriority();

        public void ChangeTime(DateTime time) => Time = time;

        public bool HasGuide() => AssignedGuide != null;

        public Guide? GetAssignedGuide() => AssignedGuide;

        public void AssignGuide(Guide guide)
        {
            if (HasGuide())
                RemoveGuide();
            AssignedGuide = guide;
            // MAIL GUIDE ASSIGNED
        }

        public void RemoveGuide()
        {
            AssignedGuide = null;
            // MAIL GUIDE REMOVED
        }

        public bool AddCandidateGuide(Guide guide)
        {
            // if (!guide.isCandidate) return false; !!!!  IMPLEMENT FOR ALL OR CHECK IT IN TOURSYSTEM
            if (AssignedCandidateGuides.Contains(guide))
                return false;
            AssignedCandidateGuides.Add(guide);
            return true;
        }

        public bool RemoveCandidateGuide(Guide guide) => AssignedCandidateGuides.Remove(guide);

        public bool CandidateGuideAssigned(Guide guide) => AssignedCandidateGuides.Contains(guide);

        public void AddComment(Comment comment) => Comments.Add(comment);

        public void RemoveComment(int ID) => Comments.RemoveAll(c => c.ID == ID);

        public void RemoveAllComments() => Comments.Clear();

        public Comment[] GetComments() => Comments.ToArray();

        public bool HasSurvey() => Survey != null;

        public Survey? GetSurvey() => Survey;

        public void AssignSurvey(Survey survey) => Survey = survey;
    }
}
