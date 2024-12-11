import {
    Fastfood,
    DirectionsCar,
    FitnessCenter,
    LocalDrink,
    SportsSoccer,
    Kitchen,
    LocalCafe,
    Restaurant,
    SportsBasketball,
    DirectionsRun,
    Pool,
    SportsCricket,
    Hiking,
    Biotech,
    Science,
    Healing,
    HealthAndSafety,
    MedicalServices,
    LocalPharmacy,
} from "@mui/icons-material";

const categoriesMegaMenu =  [
    {
        title: "Food & Beverages",
        child: [
            {
                title: "Restaurants",
                child: [
                    { title: "Fast Food", url: "#", Icon: Fastfood },
                    { title: "Cafes", url: "#", Icon: LocalCafe },
                    { title: "Restaurants", url: "#", Icon: Restaurant },
                    { title: "Bakeries", url: "#", Icon: Kitchen },
                    { title: "Ice Cream Shops", url: "#", Icon: LocalDrink },
                ],
            },
            {
                title: "Beverages",
                child: [
                    { title: "Juices", url: "#", Icon: LocalDrink },
                    { title: "Coffee", url: "#", Icon: LocalCafe },
                    { title: "Soft Drinks", url: "#", Icon: LocalDrink },
                    { title: "Alcohol", url: "#", Icon: LocalDrink },
                    { title: "Milkshakes", url: "#", Icon: LocalDrink },
                ],
            },
        ],
    },
    {
        title: "Health & Fitness",
        child: [
            {
                title: "Sports",
                child: [
                    { title: "Soccer", url: "#", Icon: SportsSoccer },
                    { title: "Basketball", url: "#", Icon: SportsBasketball },
                    { title: "Cricket", url: "#", Icon: SportsCricket },
                    { title: "Running", url: "#", Icon: DirectionsRun },
                    { title: "Swimming", url: "#", Icon: Pool },
                ],
            },
            {
                title: "Outdoor Activities",
                child: [
                    { title: "Hiking", url: "#", Icon: Hiking },
                    { title: "Camping", url: "#", Icon: DirectionsCar },
                    { title: "Biking", url: "#", Icon: DirectionsCar },
                    { title: "Fishing", url: "#", Icon: DirectionsCar },
                    { title: "Climbing", url: "#", Icon: DirectionsCar },
                ],
            },
        ],
    },
    {
        title: "Healthcare",
        child: [
            {
                title: "Medical",
                child: [
                    { title: "Hospitals", url: "#", Icon: MedicalServices },
                    { title: "Pharmacies", url: "#", Icon: LocalPharmacy },
                    { title: "Clinics", url: "#", Icon: HealthAndSafety },
                    { title: "Medical Equipment", url: "#", Icon: Biotech },
                    { title: "First Aid", url: "#", Icon: Healing },
                ],
            },
            {
                title: "Research & Science",
                child: [
                    { title: "Biotechnology", url: "#", Icon: Science },
                    { title: "Genetic Research", url: "#", Icon: Biotech },
                    { title: "Laboratories", url: "#", Icon: Science },
                    { title: "Medical Research", url: "#", Icon: Science },
                    { title: "Pharmaceuticals", url: "#", Icon: Science },
                ],
            },
        ],
    },
    {
        title: "Automotive",
        child: [
            {
                title: "Car Services",
                child: [
                    { title: "Car Repair", url: "#", Icon: DirectionsCar },
                    { title: "Oil Change", url: "#", Icon: DirectionsCar },
                    { title: "Car Wash", url: "#", Icon: DirectionsCar },
                    { title: "Tire Services", url: "#", Icon: DirectionsCar },
                    { title: "Car Rentals", url: "#", Icon: DirectionsCar },
                ],
            },
            {
                title: "Vehicle Types",
                child: [
                    { title: "Sedans", url: "#", Icon: DirectionsCar },
                    { title: "SUVs", url: "#", Icon: DirectionsCar },
                    { title: "Trucks", url: "#", Icon: DirectionsCar },
                    { title: "Motorcycles", url: "#", Icon: DirectionsCar },
                    { title: "Electric Cars", url: "#", Icon: DirectionsCar },
                ],
            },
        ],
    },
];

export default categoriesMegaMenu;
