using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Tour()
    {
        public string? TourRegistrationCode { get; set; }

        [NotMapped]
        public TourRegistration? TourRegistirationInfo { get; set; }
        public int? AssignedGuideID { get; private set; }
        private readonly List<int> AssignedCandidateGuideIDs = [];

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

        public bool AddCandidateGuide(User guide)
        {
            // if (!guide.isCandidate) return false; !!!!  IMPLEMENT FOR ALL OR CHECK IT IN TOURSYSTEM
            if (AssignedCandidateGuideIDs.Contains(guide.ID))
                return false;
            AssignedCandidateGuideIDs.Add(guide.ID);
            return true;
        }

        public bool RemoveCandidateGuide(User guide) => AssignedCandidateGuideIDs.Remove(guide.ID);

        public bool CandidateGuideAssigned(User guide) =>
            AssignedCandidateGuideIDs.Contains(guide.ID);
    }
}
