using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using static BTO.Constrains.TimeConstrains;
using static BTO.Constrains.TourVisitorConstrains;

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

    public class TourRegistirationRequest
    {
        [Required]
        public int? TimeBlockID;
        [Required]
        public string? TourToBeInsertedCode;

        public string? TourToBeReplacedCode = null;
    }

    public class TimeBlock
    {
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

        public int CurrentVisitorCount { get; private set; }

        public readonly List<KeyValuePair<string, int>> ScheduledTours = new(MAX_TOURS_PER_BLOCK);
        public readonly List<KeyValuePair<string, int>> AlternativeTours = [];

        public int ToursCount => ScheduledTours.Count + AlternativeTours.Count;

        // if schedule, sen to frontend for accept, which then uses AcceptTour, if not add to alternatives
        public TourRegistirationRequest? RequestTour(Tour tour)
        {
            if(string.IsNullOrEmpty(tour.TourRegistrationCode) || tour.TourRegistirationInfo == null)
                return null;

            if (CurrentVisitorCount + tour.TourRegistirationInfo.NumberOfVisitors + VISITOR_BIAS == MAX_VISITORS_COUNT)
            {
                var leastPriorityScheduled = ScheduledTours.OrderBy(t => t.Value).First();
                if (leastPriorityScheduled.Value + PRIORITY_BIAS < tour.Priority)
                {
                    return new TourRegistirationRequest
                    {
                        TimeBlockID = ID,
                        TourToBeReplacedCode = leastPriorityScheduled.Key,
                        TourToBeInsertedCode = tour.TourRegistrationCode
                    };
                }
                else
                {
                    AlternativeTours.Add(new KeyValuePair<string, int>(tour.TourRegistrationCode, tour.Priority));
                    AlternativeTours.Sort((a, b) => a.Value.CompareTo(b.Value));
                    return null;
                }
            }
            else
                return new TourRegistirationRequest 
                { 
                    TimeBlockID = ID, TourToBeInsertedCode = tour.TourRegistrationCode 
                };
        }

        // Does not check constrains & conditions here, BTO can make exceptions when manually added.
        public bool AcceptTour(Tour tourToBeInserted, Tour? tourToBeReplaced = null) 
        {
            if (string.IsNullOrEmpty(tourToBeInserted.TourRegistrationCode) || tourToBeInserted.TourRegistirationInfo == null)
                return false;

            if(tourToBeReplaced != null && tourToBeReplaced.TourRegistirationInfo != null)
            {
                var removeTourEntry = ScheduledTours.FirstOrDefault(t => t.Key == tourToBeReplaced.TourRegistrationCode);
                if (!removeTourEntry.Equals(default(KeyValuePair<string, int>)))
                {
                    ScheduledTours.Remove(removeTourEntry);
                    CurrentVisitorCount -= tourToBeReplaced.TourRegistirationInfo.NumberOfVisitors;
                }
            }

            var acceptTourEntry = AlternativeTours.FirstOrDefault(t => t.Key == tourToBeInserted.TourRegistrationCode);
            if (!acceptTourEntry.Equals(default(KeyValuePair<string, int>)))
            {
                AlternativeTours.Remove(acceptTourEntry);
                ScheduledTours.Add(acceptTourEntry);
            }
            else
                ScheduledTours.Add(new KeyValuePair<string, int>(tourToBeInserted.TourRegistrationCode, tourToBeInserted.Priority));

            CurrentVisitorCount += tourToBeInserted.TourRegistirationInfo.NumberOfVisitors;
            ScheduledTours.Sort((a, b) => a.Value.CompareTo(b.Value));

            return true;
        }

        // if removal of a tour opens up space in shcedule, return tourregistiation request
        public TourRegistirationRequest? RemoveTour(Tour tour)
        {
            if (tour.TourRegistirationInfo == null)
                return null;

            var alternativeTourEntry = AlternativeTours.FirstOrDefault(t =>
                t.Key == tour.TourRegistrationCode
            );
            if (!alternativeTourEntry.Equals(default(KeyValuePair<string, int>)))
            {
                AlternativeTours.Remove(alternativeTourEntry);
                return null;
            }

            var scheduledTourEntry = ScheduledTours.FirstOrDefault(t =>
                t.Key == tour.TourRegistrationCode
            );

            if (!scheduledTourEntry.Equals(default(KeyValuePair<string, int>)))
            {
                ScheduledTours.Remove(scheduledTourEntry);
                CurrentVisitorCount -= tour.TourRegistirationInfo.NumberOfVisitors;

                if (AlternativeTours.Count != 0)
                {
                    var nextPriorityTour = AlternativeTours.OrderByDescending(t => t.Value).First();

                    AlternativeTours.Remove(nextPriorityTour);
                    return new TourRegistirationRequest 
                    { 
                        TimeBlockID = ID, 
                        TourToBeInsertedCode = nextPriorityTour.Key 
                    };
                }
            }

            return null;
        }
    }
}
