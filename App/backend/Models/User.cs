namespace backend.Models
{
    public class User
    {
        public required string Name { get; set; }

        public int id { get; set; }

        public string? Summary { get; set; }
    }
}
