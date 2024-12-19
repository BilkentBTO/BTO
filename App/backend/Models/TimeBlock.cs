using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using static BTO.Constrains.TimeConstrains;

namespace backend.Models
{
    
    public class Schedule
    {
        public int weekID { get; }

        private readonly int TimeBlockCount = Convert.ToInt32((END_HOURS - START_HOURS) * (MINUTES_PER_HOUR / TIME_INTERVAL_MINUTES));
 
        public TimeBlock[,] TimeBlocks;

        public Schedule(int week)
        {
            weekID = week;
            TimeBlocks = new TimeBlock[DAYS, TimeBlockCount];
        }

        public bool AddTour(Tour tour, int hour)
        {
            if (tour == null)
                return false;
            if (hour < START_HOURS || hour >= END_HOURS)
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

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
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
