using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BTO.Constrains
{
    public static class TimeConstrains
    {
        [Serializable]
        public readonly struct Time(byte hour, byte minutes)
        {
            public readonly byte Hour = hour;
            public readonly byte Minutes = minutes;
        }

        public static readonly Time[] EntranceTimeBlocks = // entrance time block ID = index of time block
        { new(9, 0), new(11, 0), new(13, 30), new(16, 0) };
        public static readonly int TimeBlocksPerDay = EntranceTimeBlocks.Length;
    }

    public static class TourVisitorConstrains
    {
        public const int MAX_TOURS_PER_BLOCK = 3;
        public const int MAX_VISITORS_COUNT = 150;

        public const int PRIORITY_BIAS = 100;
        public const int VISITOR_BIAS = 10;
    }
}
