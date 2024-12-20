using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using static BTO.Constrains.TimeConstrains;

namespace backend.Models
{
    

    public class Survey_temp { }

    [Serializable]
    public struct Comment(string comment)
    {
        public readonly int ID = comment.GetHashCode();
        public string Text = comment;
    }

    public class Tour()
    {
        public int ID { get; set; }
        public DateTime Time { get; private set; }

        public string? TourRegistrationCode { get; set; }

        [NotMapped]
        public TourRegistration? TourRegistirationInfo { get; set; }

        public int? AssignedGuideID { get; private set; }
        private readonly List<int> AssignedCandidateGuideIDs = [];

        private Survey_temp? Survey;
        private readonly List<Comment> Comments = [];

        public int Priority { get; set; }

        public void ChangeTime(DateTime time) => Time = time;

        public bool HasGuide() => AssignedGuide != null;

        public bool HasGuide() => AssignedGuideID != null;

        public void FillTourRegistrationInfo(TourRegistration registration)
        {
            this.TourRegistirationInfo = registration;
        }

        public void AssignGuide(Guide guide)
        {
            if (HasGuide())
                RemoveGuide();
            AssignedGuideID = guide.Id;
            // MAIL GUIDE ASSIGNED
        }

        public void RemoveGuide()
        {
            AssignedGuideID = null;
            // MAIL GUIDE REMOVED
        }

        public bool AddCandidateGuide(Guide guide)
        {
            // if (!guide.isCandidate) return false; !!!!  IMPLEMENT FOR ALL OR CHECK IT IN TOURSYSTEM
            if (AssignedCandidateGuideIDs.Contains(guide.Id))
                return false;
            AssignedCandidateGuideIDs.Add(guide.Id);
            return true;
        }

        public bool RemoveCandidateGuide(Guide guide) => AssignedCandidateGuideIDs.Remove(guide.Id);

        public bool CandidateGuideAssigned(Guide guide) => AssignedCandidateGuideIDs.Contains(guide.Id);

        public void AddComment(Comment comment) => Comments.Add(comment);

        public void RemoveComment(int ID) => Comments.RemoveAll(c => c.ID == ID);

        public void RemoveAllComments() => Comments.Clear();

        public Comment[] GetComments() => Comments.ToArray();

        public bool HasSurvey() => Survey != null;

        public Survey_temp? GetSurvey() => Survey;

        public void AssignSurvey(Survey_temp survey) => Survey = survey;
    }
}
