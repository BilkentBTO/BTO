using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using static BTO.Constrains.TimeConstrains;

namespace backend.Models
{
    public class Availability
    {
        [Key]
        public int Id { get; set; }

        private bool[] Data;

        public Availability()
        {
            Data = new bool[TimeBlocksPerDay];
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

    public class Tour()
    {
        public int ID { get; set; }
        public DateTime Time { get; private set; }
        public readonly TourRegistirationInfo RegistirationInfo;

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

        public Survey_temp? GetSurvey() => Survey;

        public void AssignSurvey(Survey_temp survey) => Survey = survey;
    }
}
