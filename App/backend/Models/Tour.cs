/// <summary>
/// Defines the `Tour` class, which encapsulates the management of tours, 
/// including guide assignments and candidate guides. 
/// It includes methods to assign and remove guides, add and remove candidate guides, and check the status of these assignments. 
/// Additionally, the class handles tour registration information and priority.
/// </summary>

using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models
{
    /// <summary>
    /// Represents a tour with guide assignments and related functionality.
    /// </summary>
    public class Tour()
    {
        // The unique registration code for the tour.
        public string? TourRegistrationCode { get; set; }
        public string? QuizCode { get; set; }

        // Tour registration information (non-mapped).
        [NotMapped]
        public TourRegistration? TourRegistirationInfo { get; set; }

        // The ID of the assigned guide.
        public int? AssignedGuideID { get; private set; }

        // List of candidate guide IDs for the tour.
        private readonly List<int> AssignedCandidateGuideIDs = [];

        // The priority of the tour.
        public int Priority { get; set; }

        /// <summary>
        /// Checks if the tour has an assigned guide.
        /// </summary>
        /// <returns>True if a guide is assigned; otherwise, false.</returns>
        public bool HasGuide() => AssignedGuideID != null;


        /// <summary>
        /// Fills the tour registration information.
        /// </summary>
        /// <param name="registration">Tour registration information to fill.</param>
        public void FillTourRegistrationInfo(TourRegistration registration)
        {
            this.TourRegistirationInfo = registration;
        }

        /// <summary>
        /// Assigns a guide to the tour.
        /// </summary>
        /// <param name="guide">The guide to be assigned to the tour.</param>
        public void AssignGuide(User guide)
        {
            if (HasGuide())
                RemoveGuide();
            AssignedGuideID = guide.ID;
            // MAIL GUIDE ASSIGNED
        }

        /// <summary>
        /// Removes the assigned guide from the tour.
        /// </summary>
        public void RemoveGuide()
        {
            AssignedGuideID = null;
            // MAIL GUIDE REMOVED
        }

        /// <summary>
        /// Adds a candidate guide to the tour.
        /// </summary>
        /// <param name="guide">The candidate guide to be added.</param>
        /// <returns>True if the guide was added; false if already assigned.</returns>
        public bool AddCandidateGuide(User guide)
        {
            // if (!guide.isCandidate) return false; !!!!  IMPLEMENT FOR ALL OR CHECK IT IN TOURSYSTEM
            if (AssignedCandidateGuideIDs.Contains(guide.ID))
                return false;
            AssignedCandidateGuideIDs.Add(guide.ID);
            return true;
        }

        /// <summary>
        /// Removes a candidate guide from the tour.
        /// </summary>
        /// <param name="guide">The candidate guide to be removed.</param>
        /// <returns>True if the guide was removed; otherwise, false.</returns>
        public bool RemoveCandidateGuide(User guide) => AssignedCandidateGuideIDs.Remove(guide.ID);

        /// <summary>
        /// Checks if a specific candidate guide is assigned to the tour.
        /// </summary>
        /// <param name="guide">The candidate guide to check.</param>
        /// <returns>True if the guide is assigned; otherwise, false.</returns>
        public bool CandidateGuideAssigned(User guide) =>
            AssignedCandidateGuideIDs.Contains(guide.ID);
    }
}
