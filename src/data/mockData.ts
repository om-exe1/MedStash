export interface Medicine {
  id: string;
  name: string;
  generic: string;
  form: "Tablet" | "Capsule" | "Gel" | "Syrup" | "Inhaler";
  strength: string;
  category: "Pain relief" | "Antibiotic" | "Allergy" | "Cold & flu" | "Digestive" | "Cardiac";
  prescriptionRequired: boolean;
  basePrice: number;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  storage: string;
  popular?: boolean;
}

export interface PharmacyStock {
  status: "Available" | "Low stock" | "Out of stock";
  quantity: number;
  price: number;
  lastUpdated: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  area: string;
  distance: number; // in km
  distanceText: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  openStatus: "Open 24 Hours" | "Open until 11:00 PM" | "Open until 10:00 PM" | "Closed";
  phone: string;
  coordinates: { x: number; y: number }; // percentage on map canvas
  inventory: Record<string, PharmacyStock>; // medicine.id -> stock
}

export const medicines: Medicine[] = [
  {
    id: "dolo-650",
    name: "Dolo 650",
    generic: "Paracetamol",
    form: "Tablet",
    strength: "650 mg",
    category: "Pain relief",
    prescriptionRequired: false,
    basePrice: 35,
    description: "Antipyretic and analgesic medication used widely for fast relief from high fever, body ache, headache, and mild to moderate pain.",
    uses: ["Fever reduction", "Headache & migraine relief", "Muscle & joint aches", "Post-vaccination body pain"],
    dosage: "Take 1 tablet every 6 to 8 hours with water as needed. Do not exceed 4 tablets in 24 hours without medical consultation.",
    sideEffects: ["Mild nausea (rare)", "Stomach discomfort if taken on empty stomach"],
    storage: "Store below 25°C in a dry place away from direct sunlight.",
    popular: true
  },
  {
    id: "azithral-500",
    name: "Azithral 500",
    generic: "Azithromycin",
    form: "Tablet",
    strength: "500 mg",
    category: "Antibiotic",
    prescriptionRequired: true,
    basePrice: 118,
    description: "Broad-spectrum macrolide antibiotic used to treat bacterial infections of the respiratory tract, sinuses, throat, lungs, and skin.",
    uses: ["Chest & throat infections", "Tonsillitis & Sinusitis", "Bronchitis", "Skin bacterial infections"],
    dosage: "Usually taken once daily, 1 hour before food or 2 hours after food, for 3 to 5 consecutive days as prescribed by a physician.",
    sideEffects: ["Mild diarrhea", "Nausea or abdominal cramps", "Temporary dizziness"],
    storage: "Store in original strip in a cool, moisture-free location.",
    popular: true
  },
  {
    id: "cetirizine-10",
    name: "Cetirizine 10",
    generic: "Cetirizine Hydrochloride",
    form: "Tablet",
    strength: "10 mg",
    category: "Allergy",
    prescriptionRequired: false,
    basePrice: 22,
    description: "Second-generation antihistamine that relieves allergy symptoms like runny nose, sneezing, itchy eyes, hives, and seasonal hay fever.",
    uses: ["Allergic rhinitis (hay fever)", "Itchy watery eyes & sneezing", "Urticaria & skin hives", "Dust and pollen allergies"],
    dosage: "Take 1 tablet once daily in the evening or night with or without food.",
    sideEffects: ["Mild drowsiness", "Dry mouth", "Fatigue"],
    storage: "Store at room temperature between 15°C and 30°C.",
    popular: true
  },
  {
    id: "volini-gel",
    name: "Volini Pain Relief Gel",
    generic: "Diclofenac Diethylamine, Methyl Salicylate & Menthol",
    form: "Gel",
    strength: "30 g",
    category: "Pain relief",
    prescriptionRequired: false,
    basePrice: 145,
    description: "Fast-absorbing topical pain relief gel with micro-particles that penetrate deep to soothe backache, neck pain, joint stiffness, and sprains.",
    uses: ["Sprains and muscle strains", "Lower back pain & stiff neck", "Arthritic joint pain", "Sports injury soreness"],
    dosage: "Apply 3 to 4 times daily gently onto the affected area. Do not massage vigorously. Wash hands after application.",
    sideEffects: ["Mild skin redness or tingling sensation at application site"],
    storage: "Keep tube tightly closed. Protect from freezing and direct heat.",
    popular: true
  },
  {
    id: "pan-40",
    name: "Pan 40",
    generic: "Pantoprazole Gastro-resistant",
    form: "Tablet",
    strength: "40 mg",
    category: "Digestive",
    prescriptionRequired: true,
    basePrice: 155,
    description: "Proton pump inhibitor (PPI) that reduces stomach acid production, treating acid reflux, GERD, gastritis, and peptic ulcers.",
    uses: ["Acid reflux & heartburn", "Gastric and duodenal ulcers", "Erosive esophagitis", "NSAID-induced stomach protection"],
    dosage: "Take 1 tablet in the morning 30 minutes before breakfast with a full glass of water. Swallow whole without crushing.",
    sideEffects: ["Headache", "Mild flatulence or stomach ache", "Dry throat"],
    storage: "Store in moisture-proof pack below 25°C.",
    popular: false
  },
  {
    id: "augmentin-625",
    name: "Augmentin 625 Duo",
    generic: "Amoxicillin and Potassium Clavulanate",
    form: "Tablet",
    strength: "625 mg",
    category: "Antibiotic",
    prescriptionRequired: true,
    basePrice: 210,
    description: "Potent penicillin-class antibiotic combined with clavulanate to overcome bacterial resistance, treating ear, dental, respiratory, and urinary tract infections.",
    uses: ["Dental abscesses", "Severe bronchitis & pneumonia", "Ear and sinus infections", "Urinary tract infections (UTI)"],
    dosage: "Take 1 tablet twice daily at the start of a meal to minimize gastrointestinal discomfort. Complete the full course.",
    sideEffects: ["Mild diarrhea", "Nausea", "Mild skin rash"],
    storage: "Keep in a cool dry place away from moisture. Desiccant pouch must stay in container.",
    popular: false
  },
  {
    id: "allegra-120",
    name: "Allegra 120",
    generic: "Fexofenadine Hydrochloride",
    form: "Tablet",
    strength: "120 mg",
    category: "Allergy",
    prescriptionRequired: false,
    basePrice: 198,
    description: "Non-sedating antihistamine that provides 24-hour relief from seasonal allergies, allergic skin itching, and rhinitis without causing sleepiness.",
    uses: ["Seasonal hay fever", "Allergic skin wheals", "Sneezing & watery nose", "Allergy flare-ups during work/study"],
    dosage: "Take 1 tablet once daily with water. Avoid taking with fruit juices (like apple or orange) as they reduce absorption.",
    sideEffects: ["Mild headache", "Dizziness (infrequent)"],
    storage: "Store between 20°C and 25°C.",
    popular: true
  },
  {
    id: "combiflam",
    name: "Combiflam",
    generic: "Ibuprofen & Paracetamol",
    form: "Tablet",
    strength: "400 mg / 325 mg",
    category: "Cold & flu",
    prescriptionRequired: false,
    basePrice: 42,
    description: "Dual-action pain and fever remedy combining an anti-inflammatory (ibuprofen) with an analgesic (paracetamol) for acute pain episodes.",
    uses: ["Toothache & dental discomfort", "Fever with severe body chills", "Post-surgical pain", "Period cramps & severe headaches"],
    dosage: "Take 1 tablet after meals with milk or water. Do not take on an empty stomach. Max 3 tablets a day.",
    sideEffects: ["Mild heartburn", "Stomach upset"],
    storage: "Protect from light and moisture.",
    popular: true
  }
];

export const pharmacies: Pharmacy[] = [
  {
    id: "xyz-pharmacy",
    name: "XYZ Neighborhood Pharmacy",
    address: "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
    area: "Indiranagar",
    distance: 0.8,
    distanceText: "0.8 km away",
    rating: 4.8,
    reviewsCount: 312,
    verified: true,
    openStatus: "Open until 11:00 PM",
    phone: "+91 98450 12384",
    coordinates: { x: 54, y: 38 },
    inventory: {
      "dolo-650": { status: "Available", quantity: 45, price: 34, lastUpdated: "5 mins ago" },
      "azithral-500": { status: "Available", quantity: 18, price: 115, lastUpdated: "12 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 60, price: 20, lastUpdated: "8 mins ago" },
      "volini-gel": { status: "Low stock", quantity: 3, price: 140, lastUpdated: "20 mins ago" },
      "pan-40": { status: "Available", quantity: 24, price: 150, lastUpdated: "15 mins ago" },
      "augmentin-625": { status: "Available", quantity: 12, price: 205, lastUpdated: "10 mins ago" },
      "allegra-120": { status: "Available", quantity: 30, price: 192, lastUpdated: "18 mins ago" },
      "combiflam": { status: "Available", quantity: 50, price: 40, lastUpdated: "5 mins ago" }
    }
  },
  {
    id: "apollo-pharmacy",
    name: "Apollo Pharmacy 24x7",
    address: "Plot 88, 100 Feet Road, HAL 2nd Stage",
    area: "100 Feet Road",
    distance: 1.2,
    distanceText: "1.2 km away",
    rating: 4.7,
    reviewsCount: 840,
    verified: true,
    openStatus: "Open 24 Hours",
    phone: "+91 80 2520 4400",
    coordinates: { x: 32, y: 52 },
    inventory: {
      "dolo-650": { status: "Available", quantity: 120, price: 35, lastUpdated: "2 mins ago" },
      "azithral-500": { status: "Available", quantity: 35, price: 118, lastUpdated: "15 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 90, price: 22, lastUpdated: "4 mins ago" },
      "volini-gel": { status: "Available", quantity: 28, price: 145, lastUpdated: "6 mins ago" },
      "pan-40": { status: "Available", quantity: 40, price: 155, lastUpdated: "3 mins ago" },
      "augmentin-625": { status: "Available", quantity: 25, price: 210, lastUpdated: "5 mins ago" },
      "allegra-120": { status: "Available", quantity: 45, price: 198, lastUpdated: "10 mins ago" },
      "combiflam": { status: "Available", quantity: 110, price: 42, lastUpdated: "2 mins ago" }
    }
  },
  {
    id: "wellness-forever",
    name: "Wellness Forever Chemist",
    address: "Ground Floor, Metro Pillar 42, CMH Road",
    area: "CMH Road",
    distance: 1.5,
    distanceText: "1.5 km away",
    rating: 4.6,
    reviewsCount: 420,
    verified: true,
    openStatus: "Open 24 Hours",
    phone: "+91 80 4112 8990",
    coordinates: { x: 74, y: 64 },
    inventory: {
      "dolo-650": { status: "Available", quantity: 80, price: 35, lastUpdated: "7 mins ago" },
      "azithral-500": { status: "Low stock", quantity: 4, price: 116, lastUpdated: "18 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 45, price: 21, lastUpdated: "12 mins ago" },
      "volini-gel": { status: "Available", quantity: 14, price: 142, lastUpdated: "9 mins ago" },
      "pan-40": { status: "Low stock", quantity: 2, price: 152, lastUpdated: "25 mins ago" },
      "augmentin-625": { status: "Low stock", quantity: 3, price: 208, lastUpdated: "14 mins ago" },
      "allegra-120": { status: "Available", quantity: 22, price: 195, lastUpdated: "16 mins ago" },
      "combiflam": { status: "Available", quantity: 65, price: 41, lastUpdated: "8 mins ago" }
    }
  },
  {
    id: "medplus-chemist",
    name: "MedPlus Superstore",
    address: "24, Double Road, Defence Colony",
    area: "Defence Colony",
    distance: 2.1,
    distanceText: "2.1 km away",
    rating: 4.5,
    reviewsCount: 195,
    verified: true,
    openStatus: "Open until 10:00 PM",
    phone: "+91 80 2341 5566",
    coordinates: { x: 42, y: 78 },
    inventory: {
      "dolo-650": { status: "Available", quantity: 60, price: 33, lastUpdated: "14 mins ago" },
      "azithral-500": { status: "Available", quantity: 15, price: 114, lastUpdated: "30 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 50, price: 19, lastUpdated: "20 mins ago" },
      "volini-gel": { status: "Available", quantity: 18, price: 138, lastUpdated: "15 mins ago" },
      "pan-40": { status: "Available", quantity: 20, price: 148, lastUpdated: "10 mins ago" },
      "augmentin-625": { status: "Out of stock", quantity: 0, price: 204, lastUpdated: "1 hour ago" },
      "allegra-120": { status: "Available", quantity: 19, price: 190, lastUpdated: "40 mins ago" },
      "combiflam": { status: "Available", quantity: 70, price: 39, lastUpdated: "12 mins ago" }
    }
  },
  {
    id: "lifecare-meds",
    name: "LifeCare Pharma & Surgicals",
    address: "Shop 12, Krishna Temple Road, Domlur",
    area: "Domlur",
    distance: 2.8,
    distanceText: "2.8 km away",
    rating: 4.4,
    reviewsCount: 88,
    verified: false,
    openStatus: "Open until 10:00 PM",
    phone: "+91 98860 77123",
    coordinates: { x: 82, y: 32 },
    inventory: {
      "dolo-650": { status: "Available", quantity: 30, price: 36, lastUpdated: "45 mins ago" },
      "azithral-500": { status: "Low stock", quantity: 2, price: 120, lastUpdated: "50 mins ago" },
      "cetirizine-10": { status: "Available", quantity: 25, price: 22, lastUpdated: "35 mins ago" },
      "volini-gel": { status: "Out of stock", quantity: 0, price: 145, lastUpdated: "2 hours ago" },
      "pan-40": { status: "Available", quantity: 10, price: 155, lastUpdated: "30 mins ago" },
      "augmentin-625": { status: "Available", quantity: 8, price: 215, lastUpdated: "25 mins ago" },
      "allegra-120": { status: "Available", quantity: 12, price: 200, lastUpdated: "40 mins ago" },
      "combiflam": { status: "Available", quantity: 40, price: 42, lastUpdated: "30 mins ago" }
    }
  }
];

export const mockNotifications = [
  {
    id: "notif-1",
    title: "Stock Alert: Azithral 500",
    message: "Apollo Pharmacy 24x7 received 35 fresh units.",
    time: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    title: "Price Drop on Pain Relief",
    message: "MedPlus Superstore has discounted Dolo 650 to ₹33.",
    time: "1 hour ago",
    read: false
  },
  {
    id: "notif-3",
    title: "Reservation Reminder",
    message: "Reservations are held for 24 hours at neighborhood stores.",
    time: "Yesterday",
    read: true
  }
];
