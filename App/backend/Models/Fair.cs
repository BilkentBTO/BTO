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
    }
}
