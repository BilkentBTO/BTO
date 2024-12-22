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
        public string? FairRegistrationCode { get; set; }

        [NotMapped]
        public FairRegistration? FairRegistirationInfo { get; set; }
        public List<int>? AssignedGuideIDs { get; set; } = new();
        private readonly List<Comment> Comments = [];

        public bool AddGuide(User guide)
        {
            if (AssignedGuideIDs == null)
            {
                AssignedGuideIDs = new List<int>();
            }
            if (AssignedGuideIDs.Contains(guide.ID))
                return false;
            AssignedGuideIDs.Add(guide.ID);
            return true;
        }

        public bool RemoveGuide(int guideUID)
        {
            if (AssignedGuideIDs == null)
            {
                AssignedGuideIDs = new List<int>();
            }
            if (!AssignedGuideIDs.Contains(guideUID))
                return false;
            AssignedGuideIDs.Remove(guideUID);
            return true;
        }

        public void FillFairRegistrationInfo(FairRegistration registration)
        {
            this.FairRegistirationInfo = registration;
        }

        public void AddComment(Comment comment) => Comments.Add(comment);

        public void RemoveComment(int ID) => Comments.RemoveAll(c => c.ID == ID);

        public void RemoveAllComments() => Comments.Clear();

        public Comment[] GetComments() => Comments.ToArray();
    }
}
