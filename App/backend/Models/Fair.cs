/// <summary>
/// This file contains the Fair model, which represents a fair event with related registration and guide management functionalities.
/// </summary>
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CsvHelper;
using Microsoft.Net.Http.Headers;

namespace backend.Models
{
    /// <summary>
    /// Represents a fair event, including registration information and assigned guides.
    /// Constraints: 
    /// - FairRegistrationCode may be null.
    /// - FairRegistirationInfo is optional and not mapped to the database.
    /// - AssignedGuideIDs must contain unique entries and may be empty.
    /// </summary>
    public class Fair()
    {
        public string? FairRegistrationCode { get; set; }

        [NotMapped]
        public FairRegistration? FairRegistirationInfo { get; set; }
        public List<int>? AssignedGuideIDs { get; set; } = new();

        /// <summary>
        /// Adds a guide to the fair by their user ID if not already assigned.
        /// </summary>
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

        /// <summary>
        /// Removes a guide from the fair by their user ID if present.
        /// </summary>
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

        /// <summary>
        /// Updates the fair's registration information with the provided details.
        /// </summary>
        public void FillFairRegistrationInfo(FairRegistration registration)
        {
            this.FairRegistirationInfo = registration;
        }
    }
}
