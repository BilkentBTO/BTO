using System.Collections;
using System.Collections.Generic;

namespace backend.Models
{
    public class TimeBlock
    {
        private const byte MAX_TOURS_PER_BLOCK = 3;
        private const int PRIORITY_BIAS = 100;

        public int MaxStudentCount { get; private set; }
        private readonly SortedList<Tour, int> ScheduledTours = new(MAX_TOURS_PER_BLOCK);
        private readonly SortedList<Tour, int> AlternativeTours = [];

        public void AddTour(Tour tour)
        {
            if(ScheduledTours.Count == MaxStudentCount)
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
            if(ScheduledTours.ContainsKey(scheduledTour) && AlternativeTours.ContainsKey(acceptedTour))
            {
                AlternativeTours.Remove(acceptedTour);
                ScheduledTours.Remove(scheduledTour);

                ScheduledTours.Add(acceptedTour, acceptedTour.Priority);

                // MAIL scheduledTour CANCELLED acceptedTour ACCEPTED
            }
        }
        public void RemoveTour(Tour tour)
        {
            if (!ScheduledTours.Remove(tour))
                AlternativeTours.Remove(tour);
        }



        public Tour[] GetScheduledTours() => ScheduledTours.Keys.ToArray();
        public Tour[] GetAlternativeTours() => AlternativeTours.Keys.ToArray();
    }
}