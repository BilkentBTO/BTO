using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;

namespace backend.Models
{
    // https://www.kgm.gov.tr/sayfalar/kgm/sitetr/uzakliklar/illerarasimesafe.aspx

    public readonly record struct City(string name, int distance, int cityCode);

    public struct CityData
    {
        public static readonly City[] Cities =
        {
            new City("Adana", 490, 1),
            new City("Adıyaman", 755, 2),
            new City("Afyonkarahisar", 256, 3),
            new City("Ağrı", 1056, 4),
            new City("Aksaray", 225, 68),
            new City("Amasya", 333, 5),
            new City("Ankara", 0, 6),
            new City("Antalya", 544, 7),
            new City("Ardahan", 1089, 75),
            new City("Artvin", 980, 8),
            new City("Aydın", 598, 9),
            new City("Balıkesir", 535, 10),
            new City("Bartın", 283, 74),
            new City("Batman", 1006, 72),
            new City("Bayburt", 774, 69),
            new City("Bilecik", 315, 11),
            new City("Bingöl", 895, 12),
            new City("Bitlis", 1087, 13),
            new City("Bolu", 191, 14),
            new City("Burdur", 422, 15),
            new City("Bursa", 384, 16),
            new City("Çanakkale", 655, 17),
            new City("Çankırı", 131, 18),
            new City("Çorum", 241, 19),
            new City("Denizli", 475, 20),
            new City("Diyarbakır", 906, 21),
            new City("Düzce", 236, 81),
            new City("Edirne", 683, 22),
            new City("Elazığ", 758, 23),
            new City("Erzincan", 685, 24),
            new City("Erzurum", 875, 25),
            new City("Eskişehir", 233, 26),
            new City("Gaziantep", 667, 27),
            new City("Giresun", 608, 28),
            new City("Gümüşhane", 752, 29),
            new City("Hakkari", 1364, 30),
            new City("Hatay", 681, 31),
            new City("Iğdır", 1166, 76),
            new City("Isparta", 421, 32),
            new City("İstanbul", 453, 34),
            new City("İzmir", 579, 35),
            new City("Kahramanmaraş", 591, 46),
            new City("Karabük", 215, 78),
            new City("Karaman", 369, 70),
            new City("Kars", 1075, 36),
            new City("Kastamonu", 243, 37),
            new City("Kayseri", 318, 38),
            new City("Kilis", 738, 79),
            new City("Kırıkkale", 75, 71),
            new City("Kırklareli", 664, 39),
            new City("Kırşehir", 184, 40),
            new City("Kocaeli", 342, 41),
            new City("Konya", 258, 42),
            new City("Kütahya", 311, 43),
            new City("Malatya", 657, 44),
            new City("Manisa", 563, 45),
            new City("Mardin", 992, 47),
            new City("Mersin", 483, 33),
            new City("Muğla", 620, 48),
            new City("Muş", 1004, 49),
            new City("Nevşehir", 275, 50),
            new City("Niğde", 348, 51),
            new City("Ordu", 564, 52),
            new City("Osmaniye", 577, 80),
            new City("Rize", 819, 53),
            new City("Sakarya", 305, 54),
            new City("Samsun", 413, 55),
            new City("Şanlıurfa", 804, 63),
            new City("Siirt", 1093, 56),
            new City("Sinop", 412, 57),
            new City("Sivas", 439, 58),
            new City("Şırnak", 1175, 73),
            new City("Tekirdağ", 585, 59),
            new City("Tokat", 379, 60),
            new City("Trabzon", 744, 61),
            new City("Tunceli", 816, 62),
            new City("Uşak", 368, 64),
            new City("Van", 1222, 65),
            new City("Yalova", 407, 77),
            new City("Yozgat", 220, 66),
            new City("Zonguldak", 268, 67),
        };
    }

    public class School()
    {
        public int PresistanceScore { get; set; }
        public int QualityScore { get; set; }
        public string? CityName { get; set; }
        public int CityCode { get; set; }

        [NotMapped]
        public City City =>
            CityData.Cities.FirstOrDefault(c =>
                c.name.Equals(CityName, StringComparison.OrdinalIgnoreCase)
            );

        public int SchoolCode { get; set; }
        public string? SchoolName { get; set; }

        public const float PERSISTANCE_MULTIPLIER = 1.5f;
        public const float QUALITY_MULTIPLIER = 2.0f;
        public const float DISTANCE_MULTIPLIER = 1.2f;

        public int GetPriority() =>
            Convert.ToInt32(
                PERSISTANCE_MULTIPLIER * PresistanceScore
                    + QUALITY_MULTIPLIER * QualityScore
                    + DISTANCE_MULTIPLIER * City.distance
            );
    }
}
