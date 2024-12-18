using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;

namespace backend.Models
{
    // https://www.kgm.gov.tr/sayfalar/kgm/sitetr/uzakliklar/illerarasimesafe.aspx

    public readonly record struct City(string name, int distance, int cityCode);

    public static class CityData
    {
        public static readonly City[] Cities =
        {
            new("Adana", 490, 1),
            new("Adıyaman", 755, 2),
            new("Afyonkarahisar", 256, 3),
            new("Ağrı", 1056, 4),
            new("Aksaray", 225, 68),
            new("Amasya", 333, 5),
            new("Ankara", 0, 6),
            new("Antalya", 544, 7),
            new("Ardahan", 1089, 75),
            new("Artvin", 980, 8),
            new("Aydın", 598, 9),
            new("Balıkesir", 535, 10),
            new("Bartın", 283, 74),
            new("Batman", 1006, 72),
            new("Bayburt", 774, 69),
            new("Bilecik", 315, 11),
            new("Bingöl", 895, 12),
            new("Bitlis", 1087, 13),
            new("Bolu", 191, 14),
            new("Burdur", 422, 15),
            new("Bursa", 384, 16),
            new("Çanakkale", 655, 17),
            new("Çankırı", 131, 18),
            new("Çorum", 241, 19),
            new("Denizli", 475, 20),
            new("Diyarbakır", 906, 21),
            new("Düzce", 236, 81),
            new("Edirne", 683, 22),
            new("Elazığ", 758, 23),
            new("Erzincan", 685, 24),
            new("Erzurum", 875, 25),
            new("Eskişehir", 233, 26),
            new("Gaziantep", 667, 27),
            new("Giresun", 608, 28),
            new("Gümüşhane", 752, 29),
            new("Hakkari", 1364, 30),
            new("Hatay", 681, 31),
            new("Iğdır", 1166, 76),
            new("Isparta", 421, 32),
            new("İstanbul", 453, 34),
            new("İzmir", 579, 35),
            new("Kahramanmaraş", 591, 46),
            new("Karabük", 215, 78),
            new("Karaman", 369, 70),
            new("Kars", 1075, 36),
            new("Kastamonu", 243, 37),
            new("Kayseri", 318, 38),
            new("Kilis", 738, 79),
            new("Kırıkkale", 75, 71),
            new("Kırklareli", 664, 39),
            new("Kırşehir", 184, 40),
            new("Kocaeli", 342, 41),
            new("Konya", 258, 42),
            new("Kütahya", 311, 43),
            new("Malatya", 657, 44),
            new("Manisa", 563, 45),
            new("Mardin", 992, 47),
            new("Mersin", 483, 33),
            new("Muğla", 620, 48),
            new("Muş", 1004, 49),
            new("Nevşehir", 275, 50),
            new("Niğde", 348, 51),
            new("Ordu", 564, 52),
            new("Osmaniye", 577, 80),
            new("Rize", 819, 53),
            new("Sakarya", 305, 54),
            new("Samsun", 413, 55),
            new("Şanlıurfa", 804, 63),
            new("Siirt", 1093, 56),
            new("Sinop", 412, 57),
            new("Sivas", 439, 58),
            new("Şırnak", 1175, 73),
            new("Tekirdağ", 585, 59),
            new("Tokat", 379, 60),
            new("Trabzon", 744, 61),
            new("Tunceli", 816, 62),
            new("Uşak", 368, 64),
            new("Van", 1222, 65),
            new("Yalova", 407, 77),
            new("Yozgat", 220, 66),
            new("Zonguldak", 268, 67),
        };
    }

    public class School()
    {
        public int PersistanceScore { get; set; }
        public int Priority { get; set; }
        public int QualityScore { get; set; }
        public string? CityName { get; set; }
        public int CityCode { get; set; }

        [NotMapped]
        public City City =>
            CityData.Cities.FirstOrDefault(c =>
                c.name.Normalize(System.Text.NormalizationForm.FormC)
                    .Equals(
                        CityName.Normalize(System.Text.NormalizationForm.FormC),
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        public int SchoolCode { get; set; }
        public string? SchoolName { get; set; }

        public const float PERSISTANCE_MULTIPLIER = 1.5f;
        public const float QUALITY_MULTIPLIER = 2.0f;
        public const float DISTANCE_MULTIPLIER = 1.2f;

        public int GetPriority() =>
            Convert.ToInt32(
                PERSISTANCE_MULTIPLIER * PersistanceScore
                    + QUALITY_MULTIPLIER * QualityScore
                    + DISTANCE_MULTIPLIER * City.distance
            );

        public void CalculatePriority()
        {
            this.Priority = GetPriority();
        }

        //Debug purposes
        public override string ToString()
        {
            return $"School: {SchoolName ?? "N/A"}, "
                + $"Code: {SchoolCode}, "
                + $"City: {CityName ?? "N/A"}, "
                + $"Priority: {Priority}, "
                + $"Persistence Score: {PersistanceScore}, "
                + $"Quality Score: {QualityScore}";
        }
    }

    public class SchoolSuggestion
    {
        public string? SchoolName { get; set; }
        public int SchoolCode { get; set; }
    }
}
