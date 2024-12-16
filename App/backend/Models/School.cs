using System;
using System.Security.Cryptography;

namespace backend.Models
{
    // https://www.kgm.gov.tr/sayfalar/kgm/sitetr/uzakliklar/illerarasimesafe.aspx
    
    public readonly record struct City(string name, int distance);

    public class School()
    {
        private static readonly City[] CityData = [
            new City("Adana", 490),
            new City("Adıyaman", 755),
            new City("Afyonkarahisar", 256),
            new City("Ağrı", 1056),
            new City("Aksaray", 225),
            new City("Amasya", 333),
            new City("Ankara", 0),
            new City("Antalya", 544),
            new City("Ardahan", 1089),
            new City("Artvin", 980),
            new City("Aydın", 598),
            new City("Balıkesir", 535),
            new City("Bartın", 283),
            new City("Batman", 1006),
            new City("Bayburt", 774),
            new City("Bilecik", 315),
            new City("Bingöl", 895),
            new City("Bitlis", 1087),
            new City("Bolu", 191),
            new City("Burdur", 422),
            new City("Bursa", 384),
            new City("Çanakkale", 655),
            new City("Çankırı", 131),
            new City("Çorum", 241),
            new City("Denizli", 475),
            new City("Diyarbakır", 906),
            new City("Düzce", 236),
            new City("Edirne", 683),
            new City("Elazığ", 758),
            new City("Erzincan", 685),
            new City("Erzurum", 875),
            new City("Eskişehir", 233),
            new City("Gaziantep", 667),
            new City("Giresun", 608),
            new City("Gümüşhane", 752),
            new City("Hakkâri", 1364),
            new City("Hatay", 681),
            new City("Iğdır", 1166),
            new City("Isparta", 421),
            new City("İstanbul", 453),
            new City("İzmir", 579),
            new City("Kahramanmaraş", 591),
            new City("Karabük", 215),
            new City("Karaman", 369),
            new City("Kars", 1075),
            new City("Kastamonu", 243),
            new City("Kayseri", 318),
            new City("Kilis", 738),
            new City("Kırıkkale", 75),
            new City("Kırklareli", 664),
            new City("Kırşehir", 184),
            new City("Kocaeli", 342),
            new City("Konya", 258),
            new City("Kütahya", 311),
            new City("Malatya", 657),
            new City("Manisa", 563),
            new City("Mardin", 992),
            new City("Mersin", 483),
            new City("Muğla", 620),
            new City("Muş", 1004),
            new City("Nevşehir", 275),
            new City("Niğde", 348),
            new City("Ordu", 564),
            new City("Osmaniye", 577),
            new City("Rize", 819),
            new City("Sakarya", 305),
            new City("Samsun", 413),
            new City("Şanlıurfa", 804),
            new City("Siirt", 1093),
            new City("Sinop", 412),
            new City("Sivas", 439),
            new City("Şırnak", 1175),
            new City("Tekirdağ", 585),
            new City("Tokat", 379),
            new City("Trabzon", 744),
            new City("Tunceli", 816),
            new City("Uşak", 368),
            new City("Van", 1222),
            new City("Yalova", 407),
            new City("Yozgat", 220),
            new City("Zonguldak", 268)
        ];

        public int PresistanceScore { get; set; }
        public int QualityScore {  get; set; }
        public City City {  get; set; }

        public int SchoolCode { get; set; }
        public string? SchoolName { get; set; }

        public const float PERSISTANCE_MULTIPLIER = 1.5f;
        public const float QUALITY_MULTIPLIER = 2.0f;
        public const float DISTANCE_MULTIPLIER = 1.2f;

        public int GetPriority() => Convert.ToInt32(
            PERSISTANCE_MULTIPLIER * PresistanceScore +
            QUALITY_MULTIPLIER * QualityScore +
            DISTANCE_MULTIPLIER * City.distance);
    }
}
