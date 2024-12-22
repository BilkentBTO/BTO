/// <summary>
/// This file contains the definition of the TimeBlock class. The TimeBlock class manages scheduled tours 
/// within a specific time slot and tracks whether there are any conflicts with the number of tours 
/// scheduled at the same time. The class includes methods to add and remove tours and updates the conflict status accordingly.
/// </summary>
using BTO.Setting;

namespace backend.Models
{
    /// <summary>
    /// Represents a time block for scheduled tours.
    /// This class stores the time, a flag indicating whether a conflict is solved, 
    /// and a list of tours scheduled within the time block.
    /// </summary>
    public class TimeBlock
    {
        // The time of the time block
        public DateTime Time { get; set; }

        // Flag indicating whether any conflict with the tour schedule has been resolved
        public bool ConflictSolved { get; set; }

        // List of scheduled tour codes within the time block
        public List<string> ScheduledTours { get; set; } = new List<string>();

        /// <summary>
        /// Adds a tour to the scheduled tours list.
        /// If the number of tours exceeds the allowed concurrent count, marks the conflict as unresolved.
        /// </summary>
        /// <param name="tourCode">The code of the tour to add.</param>
        public void AddTour(string tourCode)
        {
            if (string.IsNullOrEmpty(tourCode))
            {
                return;
            }

            // Add the tour to the list and check conflict
            ScheduledTours.Add(tourCode);
            if (ScheduledTours.Count >= Setting.ALLOWED_CONCURRENT_TOUR_COUNT)
            {
                ConflictSolved = false;
            }
            else
            {
                ConflictSolved = true;
            }
        }

        /// <summary>
        /// Removes a tour from the scheduled tours list.
        /// If the number of tours falls below the allowed concurrent count, resolves the conflict.
        /// </summary>
        /// <param name="tourCode">The code of the tour to remove.</param>
        public void RemoveTour(string tourCode)
        {
            // Find and remove the tour from the list
            var scheduledTourEntry = ScheduledTours.FirstOrDefault(t => t == tourCode);

            if (scheduledTourEntry != null)
            {
                ScheduledTours.Remove(scheduledTourEntry);
            }
            // Check if there are still conflicts after removal
            if (ScheduledTours.Count >= Setting.ALLOWED_CONCURRENT_TOUR_COUNT)
            {
                ConflictSolved = false;
            }
            else
            {
                ConflictSolved = true;
            }
        }
    }
}
