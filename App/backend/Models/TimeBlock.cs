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

        public static int GetID(DateTime day, int timeBlockIndex) =>
            day.GetHashCode() * TimeBlocksPerDay + timeBlockIndex;

        DateTime _day;

        [Required]
        DateTime Day
        {
            get => _day;
            set
            {
                _day = new DateTime(value.Year, value.Month, value.Day);
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

        private void ReCalculateID() => ID = GetID(Day, TimeBlockIndex);

        public int MaxStudentCount { get; private set; }

        public readonly List<KeyValuePair<string, int>> ScheduledTours = new(MAX_TOURS_PER_BLOCK);
        public readonly List<KeyValuePair<string, int>> AlternativeTours = [];

        public int ToursCount => ScheduledTours.Count + AlternativeTours.Count;

        public void AddTour(Tour tour)
        {
            if (string.IsNullOrEmpty(tour.TourRegistrationCode))
            {
                return;
            }

            if (ScheduledTours.Count == MaxStudentCount)
            {
                var leastPriorityScheduled = ScheduledTours.OrderBy(t => t.Value).First();
                if (leastPriorityScheduled.Value + PRIORITY_BIAS < tour.Priority)
                {
                    ScheduledTours.Remove(leastPriorityScheduled);

                    ScheduledTours.Add(
                        new KeyValuePair<string, int>(tour.TourRegistrationCode, tour.Priority)
                    );

                    // MAIL leastPriorityTour CANCEL
                }
                else
                    AlternativeTours.Add(
                        new KeyValuePair<string, int>(tour.TourRegistrationCode, tour.Priority)
                    );
            }
            else
            {
                ScheduledTours.Add(
                    new KeyValuePair<string, int>(tour.TourRegistrationCode, tour.Priority)
                );
                // MAIL tour ACCEPTED
            }
            ScheduledTours.Sort((a, b) => a.Value.CompareTo(b.Value));
        }

        public void AcceptAlternativeTour(Tour scheduledTour, Tour acceptedTour)
        {
            if (
                string.IsNullOrEmpty(acceptedTour.TourRegistrationCode)
                || string.IsNullOrEmpty(scheduledTour.TourRegistrationCode)
            )
            {
                return;
            }
            var scheduledTourEntry = ScheduledTours.FirstOrDefault(t =>
                t.Key == scheduledTour.TourRegistrationCode
            );
            var acceptedTourEntry = AlternativeTours.FirstOrDefault(t =>
                t.Key == acceptedTour.TourRegistrationCode
            );

            if (
                !scheduledTourEntry.Equals(default(KeyValuePair<string, int>))
                && !acceptedTourEntry.Equals(default(KeyValuePair<string, int>))
            )
            {
                AlternativeTours.Remove(acceptedTourEntry);

                ScheduledTours.Remove(scheduledTourEntry);

                ScheduledTours.Add(
                    new KeyValuePair<string, int>(
                        acceptedTour.TourRegistrationCode,
                        acceptedTour.Priority
                    )
                );

                ScheduledTours.Sort((a, b) => a.Value.CompareTo(b.Value));

                // MAIL scheduledTour CANCELLED acceptedTour ACCEPTED
            }
        }

        public void RemoveTour(Tour tour)
        {
            var alternativeTourEntry = AlternativeTours.FirstOrDefault(t =>
                t.Key == tour.TourRegistrationCode
            );
            if (!alternativeTourEntry.Equals(default(KeyValuePair<string, int>)))
            {
                AlternativeTours.Remove(alternativeTourEntry);
                return;
            }

            var scheduledTourEntry = ScheduledTours.FirstOrDefault(t =>
                t.Key == tour.TourRegistrationCode
            );

            if (!scheduledTourEntry.Equals(default(KeyValuePair<string, int>)))
            {
                ScheduledTours.Remove(scheduledTourEntry);

                if (AlternativeTours.Count != 0)
                {
                    var nextPriorityTour = AlternativeTours.OrderByDescending(t => t.Value).First();

                    AlternativeTours.Remove(nextPriorityTour);
                    ScheduledTours.Add(nextPriorityTour);

                    ScheduledTours.Sort((a, b) => a.Value.CompareTo(b.Value));
                }
            }
        }
    }
}
