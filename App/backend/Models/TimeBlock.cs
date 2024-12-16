using System.Collections;
using System.Collections.Generic;

namespace backend.Models
{
    public class Schedule
    {
        public const int DAYS = 7;
        public const int HOURS = 24;

        public static TimeBlock?[,] TimeBlocks = new TimeBlock[DAYS, HOURS];

        public bool AddTour(Tour tour, int hour)
        {
            if (tour == null)
                return false;
            if (hour < 0 || hour >= 24)
                return false;

            TimeBlock? SelectedTimeBlock = TimeBlocks[(int)tour.Time.DayOfWeek, hour];
            if (SelectedTimeBlock == null)
                TimeBlocks[(int)tour.Time.DayOfWeek, hour] = SelectedTimeBlock = new TimeBlock();

            SelectedTimeBlock.AddTour(tour);
            return true;
        }
    }
    public class TimeBlock
    {
        private const byte MAX_TOURS_PER_BLOCK = 3;
        private const int PRIORITY_BIAS = 100;
        public int? ID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int MaxStudentCount { get; private set; }
        private readonly SortedList<Tour, int> ScheduledTours = new(MAX_TOURS_PER_BLOCK);
        private readonly SortedList<Tour, int> AlternativeTours = [];

        public int ToursCount => ScheduledTours.Count + AlternativeTours.Count;

        public void AddTour(Tour tour)
        {
            if (ScheduledTours.Count == MaxStudentCount)
            {
                int leastPriorityScheduled = ScheduledTours.GetValueAtIndex(0);
                if (leastPriorityScheduled + PRIORITY_BIAS < tour.Priority)
                {
                    Tour leastPriorityTour = ScheduledTours.GetKeyAtIndex(0);
                    ScheduledTours.RemoveAt(0);
                    ScheduledTours.Add(tour, tour.Priority);

                    // MAIL leastPriorityTour CANCEL
                }
                else
                    AlternativeTours.Add(tour, tour.Priority);
            }
            else
            {
                ScheduledTours.Add(tour, tour.Priority);
                // MAIL tour ACCEPTED
            }
        }

        public void AcceptAlternativeTour(Tour scheduledTour, Tour acceptedTour)
        {
            if (
                ScheduledTours.ContainsKey(scheduledTour)
                && AlternativeTours.ContainsKey(acceptedTour)
            )
            {
                AlternativeTours.Remove(acceptedTour);
                ScheduledTours.Remove(scheduledTour);

                ScheduledTours.Add(acceptedTour, acceptedTour.Priority);

                // MAIL scheduledTour CANCELLED acceptedTour ACCEPTED
            }
        }

        public void RemoveTour(Tour tour)
        {
            if (AlternativeTours.Remove(tour))
                return;

            if (ScheduledTours.Remove(tour) && AlternativeTours.Count != 0)
            {
                int lastIndex = AlternativeTours.Count - 1;
                Tour nextPriorityTour = AlternativeTours.GetKeyAtIndex(lastIndex);
                AlternativeTours.RemoveAt(lastIndex);
                ScheduledTours.Add(nextPriorityTour, nextPriorityTour.Priority);
            }
        }

        public Tour[] GetScheduledTours() => ScheduledTours.Keys.ToArray();

        public Tour[] GetAlternativeTours() => AlternativeTours.Keys.ToArray();
    }
}
