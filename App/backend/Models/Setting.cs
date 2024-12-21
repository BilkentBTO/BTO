namespace BTO.Setting
{
    public class Setting
    {
        public const int ALLOWED_CONCURRENT_TOUR_COUNT = 3;
        public int Id { get; set; }
        public int AllowedConcurrentTourCount { get; set; } = ALLOWED_CONCURRENT_TOUR_COUNT;
    }
}
