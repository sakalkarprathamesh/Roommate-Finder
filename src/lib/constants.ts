export const CREATOR_NAME = "Prathamesh Sakalkar";
export const SUPPORT_EMAIL = "workxash@gmail.com";

export const MIT_SCHOOLS = [
  "School of Computing",
  "School of Engineering",
  "Institute of Design",
  "College of Food Technology",
  "School of Broadcasting & Journalism",
  "School of Architecture",
  "School of Fine Arts",
  "College of Management",
  "School of Vedic Sciences",
] as const;

export const MIT_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "AI & Data Science",
  "Aerospace Engineering",
  "Mechanical Engineering",
  "Electronics & Communication",
  "User Experience (UX/UI)",
  "Product Design",
  "Graphic Design",
  "Food Technology",
  "Journalism & Mass Comm",
  "Architecture",
  "Management & Business",
] as const;

export const ACADEMIC_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
] as const;

export const LISTING_TYPES = {
  NEED_ROOMMATE: "I NEED A ROOMMATE",
  NEED_ACCOMMODATION: "I NEED ACCOMMODATION",
  HAVE_VACANCY: "I HAVE A VACANCY",
  HAVE_ROOM: "I HAVE A ROOM/FLAT AVAILABLE",
} as const;

export const LISTING_TYPE_KEYS = [
  "NEED_ROOMMATE",
  "NEED_ACCOMMODATION",
  "HAVE_VACANCY",
  "HAVE_ROOM",
] as const;

export const ACCOMMODATION_TYPES = [
  "Hostel",
  "Flat",
  "Room",
  "PG",
  "Other",
] as const;

export const ROOM_TYPES = [
  "Private",
  "Shared",
] as const;

export const PUNE_AREAS = [
  "Near MIT-ADT",
  "Loni Kalbhor",
  "Wagholi",
  "Kharadi",
  "Manjari",
  "Hadapsar",
  "Amanora / Magarpatta",
  "Kadamwakabasti",
] as const;

export const REPORT_REASONS = [
  "Fake information",
  "Spam",
  "Inappropriate content",
  "Listing no longer available",
  "Other",
] as const;

export const SUPPORTED_CITIES = [
  "Pune",
  "Mumbai",
  "Bangalore",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
] as const;

export const FLATMATE_PREFERENCES = [
  {
    id: "night_owl",
    emoji: "🦉",
    title: "Night Owl",
    description: "Active late at night.",
    iconUrl: "/preferences/night_owl.png",
  },
  {
    id: "early_bird",
    emoji: "🦚",
    title: "Early Bird",
    description: "Wakes up early.",
    iconUrl: "/preferences/early_bird.png",
  },
  {
    id: "studious",
    emoji: "📚",
    title: "Studious",
    description: "Focused & study-friendly.",
    iconUrl: "/preferences/studious.png",
  },
  {
    id: "fitness_freak",
    emoji: "🏋️",
    title: "Fitness Freak",
    description: "Fitness & workout lover.",
    iconUrl: "/preferences/fitness_freak.png",
  },
  {
    id: "sporty",
    emoji: "⚽",
    title: "Sporty",
    description: "Loves sports & games.",
    iconUrl: "/preferences/sporty.png",
  },
  {
    id: "wanderer",
    emoji: "🚐",
    title: "Wanderer",
    description: "Enjoys road trips & travel.",
    iconUrl: "/preferences/wanderer.png",
  },
  {
    id: "party_lover",
    emoji: "🥳",
    title: "Party Lover",
    description: "Social & fun loving.",
    iconUrl: "/preferences/party_lover.png",
  },
  {
    id: "pet_lover",
    emoji: "🐶",
    title: "Pet Lover",
    description: "Comfortable around pets.",
    iconUrl: "/preferences/pet_lover.png",
  },
  {
    id: "vegan",
    emoji: "🌱",
    title: "Vegan",
    description: "Plant-based & vegetarian diet.",
    iconUrl: "/preferences/vegan.png",
  },
  {
    id: "non_alcoholic",
    emoji: "🚫🍺",
    title: "Non Alcoholic",
    description: "Alcohol-free lifestyle.",
    iconUrl: "/preferences/non_alcoholic.png",
  },
  {
    id: "music_lover",
    emoji: "🎸",
    title: "Music Lover",
    description: "Passionate about music.",
    iconUrl: "/preferences/music_lover.png",
  },
  {
    id: "no_smoker",
    emoji: "🚭",
    title: "Non Smoker",
    description: "Smoke-free environment.",
    iconUrl: "/preferences/no_smoker.png",
  },
] as const;

export const PG_AMENITIES = [
  { id: "tv", label: "TV", emoji: "📺" },
  { id: "fridge", label: "Fridge", emoji: "🧊" },
  { id: "cctv", label: "CCTV", emoji: "📹" },
  { id: "wifi", label: "Wi-Fi", emoji: "📶" },
  { id: "washing_machine", label: "Washing Machine", emoji: "🧺" },
  { id: "ac", label: "AC", emoji: "❄️" },
  { id: "power_backup", label: "Power Backup", emoji: "🔋" },
  { id: "parking", label: "Parking", emoji: "🚲" },
  { id: "food_service", label: "Food / Mess", emoji: "🍲" },
  { id: "water_purifier", label: "RO Water Purifier", emoji: "💧" },
  { id: "housekeeping", label: "Daily Housekeeping", emoji: "🧹" },
  { id: "security", label: "24x7 Security Guard", emoji: "🛡️" },
] as const;

export const FLAT_AMENITIES = [
  { id: "wifi", label: "High-Speed Wi-Fi", emoji: "📶" },
  { id: "ac", label: "Air Conditioning", emoji: "❄️" },
  { id: "refrigerator", label: "Refrigerator", emoji: "🧊" },
  { id: "washing_machine", label: "Washing Machine", emoji: "🧺" },
  { id: "geyser", label: "Geyser / Water Heater", emoji: "🚿" },
  { id: "gas_pipeline", label: "Modular Kitchen & Gas", emoji: "🍳" },
  { id: "power_backup", label: "Inverter / Power Backup", emoji: "🔋" },
  { id: "parking", label: "Bike & Car Parking", emoji: "🚗" },
  { id: "lift", label: "Elevator / Lift", emoji: "🛗" },
  { id: "balcony", label: "Spacious Balcony", emoji: "🪴" },
  { id: "security", label: "Gated Society Security", emoji: "🛡️" },
] as const;
