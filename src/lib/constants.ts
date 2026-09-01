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
    id: "early_bird",
    emoji: "🌅",
    title: "Early Bird",
    description: "Likes waking up early.",
  },
  {
    id: "night_owl",
    emoji: "🌙",
    title: "Night Owl",
    description: "Usually active late at night.",
  },
  {
    id: "studious",
    emoji: "📚",
    title: "Studious",
    description: "Prefers a focused and study-friendly environment.",
  },
  {
    id: "fitness_freak",
    emoji: "🏋️",
    title: "Fitness Freak",
    description: "Fitness and workouts are important.",
  },
  {
    id: "music_lover",
    emoji: "🎵",
    title: "Music Lover",
    description: "Enjoys listening to music.",
  },
  {
    id: "non_alcoholic",
    emoji: "🚫🍺",
    title: "Non-Alcoholic",
    description: "Prefers an alcohol-free environment.",
  },
  {
    id: "no_smoker",
    emoji: "🚭",
    title: "No Smoker",
    description: "Prefers a smoke-free environment.",
  },
  {
    id: "pure_vegetarian",
    emoji: "🥗",
    title: "Pure Vegetarian",
    description: "Prefers a vegetarian household.",
  },
  {
    id: "party_lover",
    emoji: "🎉",
    title: "Party Lover",
    description: "Enjoys socialising and parties.",
  },
  {
    id: "explorer",
    emoji: "🌍",
    title: "Explorer",
    description: "Likes travelling, exploring and trying new things.",
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
