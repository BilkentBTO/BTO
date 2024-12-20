using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using static BTO.Constrains.TimeConstrains;

namespace backend.Models
{
    public struct Availability()
    {
        private int DailySchedule = 0;

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

        DateTime _day;

        [Required]
        DateTime Day
        {
            get => _day;
            set
            {
                _day = value;
                ReCalculateID();
            }
        }
        int _timeBlockIndex;

        [Required]
        int TimeBlockIndex
        {
            get => _timeBlockIndex;
            set
            {
                if (value < 0 || value >= TimeBlocksPerDay)
                    return;
                _timeBlockIndex = value;
                ReCalculateID();
            }
        }

        public int ID { get; set; }

        private void ReCalculateID() => ID = Day.GetHashCode() * TimeBlocksPerDay + TimeBlockIndex;

        public int MaxStudentCount { get; private set; }

        // int, int = tourID, tourPriority
        public readonly SortedList<int, int> ScheduledTours = new(MAX_TOURS_PER_BLOCK);
        public readonly SortedList<int, int> AlternativeTours = [];

        public int ToursCount => ScheduledTours.Count + AlternativeTours.Count;

        public void AddTour(Tour tour)
        {
            if (ScheduledTours.Count == MaxStudentCount)
            {
                int leastPriorityScheduled = ScheduledTours.GetValueAtIndex(0);
                if (leastPriorityScheduled + PRIORITY_BIAS < tour.Priority)
                {
                    int leastPriorityTour = ScheduledTours.GetKeyAtIndex(0);
                    ScheduledTours.RemoveAt(0);
                    ScheduledTours.Add(tour.ID, tour.Priority);

                    // MAIL leastPriorityTour CANCEL
                }
                else
                    AlternativeTours.Add(tour.ID, tour.Priority);
            }
            else
            {
                ScheduledTours.Add(tour.ID, tour.Priority);
                // MAIL tour ACCEPTED
            }
        }

        public void AcceptAlternativeTour(Tour scheduledTour, Tour acceptedTour)
        {
            if (
                ScheduledTours.ContainsKey(scheduledTour.ID)
                && AlternativeTours.ContainsKey(acceptedTour.ID)
            )
            {
                AlternativeTours.Remove(acceptedTour.ID);
                ScheduledTours.Remove(scheduledTour.ID);

                ScheduledTours.Add(acceptedTour.ID, acceptedTour.Priority);

                // MAIL scheduledTour CANCELLED acceptedTour ACCEPTED
            }
        }

        public void RemoveTour(Tour tour)
        {
            if (AlternativeTours.Remove(tour.ID))
                return;

            if (ScheduledTours.Remove(tour.ID) && AlternativeTours.Count != 0)
            {
                int lastIndex = AlternativeTours.Count - 1;
                KeyValuePair<int, int> nextPriorityTour = AlternativeTours.ElementAt(lastIndex);
                AlternativeTours.RemoveAt(lastIndex);
                ScheduledTours.Add(nextPriorityTour.Key, nextPriorityTour.Value);
            }
        }
    }
}
