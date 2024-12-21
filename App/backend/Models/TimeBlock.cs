using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using static BTO.Constrains.TimeConstrains;

namespace backend.Models
{
    public struct Availability
    {
        private int DailySchedule { get; set; }

        public readonly bool IsAvailableAt(int timeBlockID)
        {
            if (timeBlockID < 0 || timeBlockID >= TimeBlocksPerDay)
                return false;

            int mask = 1 << timeBlockID;
            return (DailySchedule & mask) != 0;
        }

        public void SetAvailabilityAt(int timeBlockID, bool isAvailable)
        {
            if (timeBlockID < 0 || timeBlockID >= TimeBlocksPerDay)
                return;

            byte mask = (byte)(1 << timeBlockID);
            DailySchedule = isAvailable ? (DailySchedule | mask) : (DailySchedule & ~mask);
        }
    }

    public class TimeBlock
    {
        private const byte MAX_TOURS_PER_BLOCK = 3;
        private const int PRIORITY_BIAS = 100;

        public DateTime Time { get; set; }

        public List<string> ScheduledTours { get; set; } = new List<string>();

        public void AddTour(string tourCode)
        {
            if (string.IsNullOrEmpty(tourCode))
            {
                return;
            }

            ScheduledTours.Add(tourCode);
        }

        public void RemoveTour(string tourCode)
        {
            var scheduledTourEntry = ScheduledTours.FirstOrDefault(t => t == tourCode);

            if (
                scheduledTourEntry != null
                && !scheduledTourEntry.Equals(default(KeyValuePair<string, int>))
            )
            {
                ScheduledTours.Remove(scheduledTourEntry);
            }
        }
    }
}
