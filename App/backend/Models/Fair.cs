using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CsvHelper;
using Microsoft.Net.Http.Headers;

namespace backend.Models
{
    public class Fair()
    {
        public DateTime? Time { get; set; }
        public string? FairRegistrationCode { get; set; }

        [NotMapped]
        public FairRegistration? FairRegistirationInfo { get; set; }
        private readonly List<int> AssignedGuideIDs = [];
        private readonly List<Comment> Comments = [];

        public bool AddGuide(Guide guide)
        {
            if (AssignedGuideIDs.Contains(guide.Id))
                return false;
            AssignedGuideIDs.Add(guide.Id);
            return true;
        }

        public void FillFairRegistrationInfo(FairRegistration registration)
        {
            this.FairRegistirationInfo = registration;
        }

        public bool RemoveCandidateGuide(Guide guide) => AssignedGuideIDs.Remove(guide.Id);

        public bool CandidateGuideAssigned(Guide guide) => AssignedGuideIDs.Contains(guide.Id);

        public void AddComment(Comment comment) => Comments.Add(comment);

        public void RemoveComment(int ID) => Comments.RemoveAll(c => c.ID == ID);

        public void RemoveAllComments() => Comments.Clear();

        public Comment[] GetComments() => Comments.ToArray();
    }
}
