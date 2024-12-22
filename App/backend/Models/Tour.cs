using System.ComponentModel.DataAnnotations.Schema;

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
        public string? TourRegistrationCode { get; set; }

        [NotMapped]
        public TourRegistration? TourRegistirationInfo { get; set; }
        public int? AssignedGuideID { get; private set; }
        private readonly List<int> AssignedCandidateGuideIDs = [];

        private Survey_temp? Survey;
        private readonly List<Comment> Comments = [];

        public int Priority { get; set; }

        public bool HasGuide() => AssignedGuideID != null;

        public void FillTourRegistrationInfo(TourRegistration registration)
        {
            this.TourRegistirationInfo = registration;
        }

        public void AssignGuide(User guide)
        {
            if (HasGuide())
                RemoveGuide();
            AssignedGuideID = guide.ID;
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
            if (AssignedCandidateGuideIDs.Contains(guide.ID))
                return false;
            AssignedCandidateGuideIDs.Add(guide.ID);
            return true;
        }

        public bool RemoveCandidateGuide(Guide guide) => AssignedCandidateGuideIDs.Remove(guide.ID);

        public bool CandidateGuideAssigned(Guide guide) =>
            AssignedCandidateGuideIDs.Contains(guide.ID);

        public void AddComment(Comment comment) => Comments.Add(comment);

        public void RemoveComment(int ID) => Comments.RemoveAll(c => c.ID == ID);

        public void RemoveAllComments() => Comments.Clear();

        public Comment[] GetComments() => Comments.ToArray();

        public bool HasSurvey() => Survey != null;

        public Survey_temp? GetSurvey() => Survey;

        public void AssignSurvey(Survey_temp survey) => Survey = survey;
    }
}
