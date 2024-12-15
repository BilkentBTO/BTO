using System.Collections;
using System.Collections.Generic;

namespace backend.Models
{
    public class TimeBlock
    {
        private const byte MaxToursPerBlock = 3;
        private const int PriorityBias = 1;

        public int MaxStudentCount { get; private set; }
        private readonly SortedList<Tour, int> ScheduledTours = new(MaxToursPerBlock);
        private readonly SortedList<Tour, int> AlternativeTours = [];

        public void AddTour(Tour tour, int priority)
        {
            if(ScheduledTours.Count == MaxStudentCount)
            {
                int leastPriorityScheduled = ScheduledTours.GetValueAtIndex(0);
                if (leastPriorityScheduled + PriorityBias < priority)
                {
                    Tour leastPriorityTour = ScheduledTours.GetKeyAtIndex(0);
                    ScheduledTours.RemoveAt(0);
                    ScheduledTours.Add(tour, priority);

                    // MAIL leastPriorityTour CANCEL
                }
                else
                    AlternativeTours.Add(tour, priority);
            }
            else
            {
                ScheduledTours.Add(tour, priority);
                // MAIL tour ACCEPTED
            }
        }
        public void AcceptAlternativeTour(Tour scheduledTour, Tour acceptedTour)
        {
            if(ScheduledTours.ContainsKey(scheduledTour) && AlternativeTours.TryGetValue(acceptedTour, out int priorityOfAcceptedTour))
            {
                AlternativeTours.Remove(acceptedTour);
                ScheduledTours.Remove(scheduledTour);

                ScheduledTours.Add(acceptedTour, priorityOfAcceptedTour);

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