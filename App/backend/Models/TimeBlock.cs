using BTO.Setting;

namespace backend.Models
{
    public struct Availability
    {
        private int DailySchedule { get; set; }
    }

    public class TimeBlock
    {
        public DateTime Time { get; set; }

        public bool ConflictSolved { get; set; }

        public List<string> ScheduledTours { get; set; } = new List<string>();

        public void AddTour(string tourCode)
        {
            if (string.IsNullOrEmpty(tourCode))
            {
                return;
            }

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

        public void RemoveTour(string tourCode)
        {
            var scheduledTourEntry = ScheduledTours.FirstOrDefault(t => t == tourCode);

            if (scheduledTourEntry != null)
            {
                ScheduledTours.Remove(scheduledTourEntry);
            }
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
