from sqlalchemy.orm import Session
from .models import Medicine, Pharmacy, PharmacyStock, User, Notification, Reservation
from .database import SessionLocal, engine, Base

INITIAL_MEDICINES = [
    {
        "id": "dolo-650",
        "name": "Dolo 650",
        "generic": "Paracetamol",
        "form": "Tablet",
        "strength": "650 mg",
        "category": "Pain relief",
        "prescription_required": False,
        "base_price": 35.0,
        "description": "Antipyretic and analgesic medication used widely for fast relief from high fever, body ache, headache, and mild to moderate pain.",
        "uses": ["Fever reduction", "Headache & migraine relief", "Muscle & joint aches", "Post-vaccination body pain"],
        "dosage": "Take 1 tablet every 6 to 8 hours with water as needed. Do not exceed 4 tablets in 24 hours without medical consultation.",
        "side_effects": ["Mild nausea (rare)", "Stomach discomfort if taken on empty stomach"],
        "storage": "Store below 25°C in a dry place away from direct sunlight.",
        "popular": True,
    },
    {
        "id": "azithral-500",
        "name": "Azithral 500",
        "generic": "Azithromycin",
        "form": "Tablet",
        "strength": "500 mg",
        "category": "Antibiotic",
        "prescription_required": True,
        "base_price": 118.0,
        "description": "Broad-spectrum macrolide antibiotic used to treat bacterial infections of the respiratory tract, sinuses, throat, lungs, and skin.",
        "uses": ["Chest & throat infections", "Tonsillitis & Sinusitis", "Bronchitis", "Skin bacterial infections"],
        "dosage": "Usually taken once daily, 1 hour before food or 2 hours after food, for 3 to 5 consecutive days as prescribed by a physician.",
        "side_effects": ["Mild diarrhea", "Nausea or abdominal cramps", "Temporary dizziness"],
        "storage": "Store in original strip in a cool, moisture-free location.",
        "popular": True,
    },
    {
        "id": "cetirizine-10",
        "name": "Cetirizine 10",
        "generic": "Cetirizine Hydrochloride",
        "form": "Tablet",
        "strength": "10 mg",
        "category": "Allergy",
        "prescription_required": False,
        "base_price": 22.0,
        "description": "Second-generation antihistamine that relieves allergy symptoms like runny nose, sneezing, itchy eyes, hives, and seasonal hay fever.",
        "uses": ["Allergic rhinitis (hay fever)", "Itchy watery eyes & sneezing", "Urticaria & skin hives", "Dust and pollen allergies"],
        "dosage": "Take 1 tablet once daily in the evening or night with or without food.",
        "side_effects": ["Mild drowsiness", "Dry mouth", "Fatigue"],
        "storage": "Store at room temperature between 15°C and 30°C.",
        "popular": True,
    },
    {
        "id": "volini-gel",
        "name": "Volini Pain Relief Gel",
        "generic": "Diclofenac Diethylamine, Methyl Salicylate & Menthol",
        "form": "Gel",
        "strength": "30 g",
        "category": "Pain relief",
        "prescription_required": False,
        "base_price": 145.0,
        "description": "Fast-absorbing topical pain relief gel with micro-particles that penetrate deep to soothe backache, neck pain, joint stiffness, and sprains.",
        "uses": ["Sprains and muscle strains", "Lower back pain & stiff neck", "Arthritic joint pain", "Sports injury soreness"],
        "dosage": "Apply 3 to 4 times daily gently onto the affected area. Do not massage vigorously. Wash hands after application.",
        "side_effects": ["Mild skin redness or tingling sensation at application site"],
        "storage": "Keep tube tightly closed. Protect from freezing and direct heat.",
        "popular": True,
    },
    {
        "id": "pan-40",
        "name": "Pan 40",
        "generic": "Pantoprazole Gastro-resistant",
        "form": "Tablet",
        "strength": "40 mg",
        "category": "Digestive",
        "prescription_required": True,
        "base_price": 155.0,
        "description": "Proton pump inhibitor (PPI) that reduces stomach acid production, treating acid reflux, GERD, gastritis, and peptic ulcers.",
        "uses": ["Acid reflux & heartburn", "Gastric and duodenal ulcers", "Erosive esophagitis", "NSAID-induced stomach protection"],
        "dosage": "Take 1 tablet in the morning 30 minutes before breakfast with a full glass of water. Swallow whole without crushing.",
        "side_effects": ["Headache", "Mild flatulence or stomach ache", "Dry throat"],
        "storage": "Store in moisture-proof pack below 25°C.",
        "popular": False,
    },
    {
        "id": "augmentin-625",
        "name": "Augmentin 625 Duo",
        "generic": "Amoxicillin and Potassium Clavulanate",
        "form": "Tablet",
        "strength": "625 mg",
        "category": "Antibiotic",
        "prescription_required": True,
        "base_price": 210.0,
        "description": "Potent penicillin-class antibiotic combined with clavulanate to overcome bacterial resistance, treating ear, dental, respiratory, and urinary tract infections.",
        "uses": ["Dental abscesses", "Severe bronchitis & pneumonia", "Ear and sinus infections", "Urinary tract infections (UTI)"],
        "dosage": "Take 1 tablet twice daily at the start of a meal to minimize gastrointestinal discomfort. Complete the full course.",
        "side_effects": ["Mild diarrhea", "Nausea", "Mild skin rash"],
        "storage": "Keep in a cool dry place away from moisture. Desiccant pouch must stay in container.",
        "popular": False,
    },
    {
        "id": "allegra-120",
        "name": "Allegra 120",
        "generic": "Fexofenadine Hydrochloride",
        "form": "Tablet",
        "strength": "120 mg",
        "category": "Allergy",
        "prescription_required": False,
        "base_price": 198.0,
        "description": "Non-sedating antihistamine that provides 24-hour relief from seasonal allergies, allergic skin itching, and rhinitis without causing sleepiness.",
        "uses": ["Seasonal hay fever", "Allergic skin wheals", "Sneezing & watery nose", "Allergy flare-ups during work/study"],
        "dosage": "Take 1 tablet once daily with water. Avoid taking with fruit juices (like apple or orange) as they reduce absorption.",
        "side_effects": ["Mild headache", "Dizziness (infrequent)"],
        "storage": "Store between 20°C and 25°C.",
        "popular": True,
    },
    {
        "id": "combiflam",
        "name": "Combiflam",
        "generic": "Ibuprofen & Paracetamol",
        "form": "Tablet",
        "strength": "400 mg / 325 mg",
        "category": "Cold & flu",
        "prescription_required": False,
        "base_price": 42.0,
        "description": "Dual-action pain and fever remedy combining an anti-inflammatory (ibuprofen) with an analgesic (paracetamol) for acute pain episodes.",
        "uses": ["Toothache & dental discomfort", "Fever with severe body chills", "Post-surgical pain", "Period cramps & severe headaches"],
        "dosage": "Take 1 tablet after meals with milk or water. Do not take on an empty stomach. Max 3 tablets a day.",
        "side_effects": ["Mild heartburn", "Stomach upset"],
        "storage": "Protect from light and moisture.",
        "popular": True,
    },
]

INITIAL_PHARMACIES = [
    {
        "id": "xyz-pharmacy",
        "name": "XYZ Neighborhood Pharmacy",
        "address": "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
        "area": "Indiranagar",
        "distance": 0.8,
        "distance_text": "0.8 km away",
        "rating": 4.8,
        "reviews_count": 312,
        "verified": True,
        "open_status": "Open until 11:00 PM",
        "phone": "+91 98450 12384",
        "coord_x": 54.0,
        "coord_y": 38.0,
        "inventory": {
            "dolo-650": {"status": "Available", "quantity": 45, "price": 34.0, "last_updated": "5 mins ago"},
            "azithral-500": {"status": "Available", "quantity": 18, "price": 115.0, "last_updated": "12 mins ago"},
            "cetirizine-10": {"status": "Available", "quantity": 60, "price": 20.0, "last_updated": "8 mins ago"},
            "volini-gel": {"status": "Low stock", "quantity": 3, "price": 140.0, "last_updated": "20 mins ago"},
            "pan-40": {"status": "Available", "quantity": 24, "price": 150.0, "last_updated": "15 mins ago"},
            "augmentin-625": {"status": "Available", "quantity": 12, "price": 205.0, "last_updated": "10 mins ago"},
            "allegra-120": {"status": "Available", "quantity": 30, "price": 192.0, "last_updated": "18 mins ago"},
            "combiflam": {"status": "Available", "quantity": 50, "price": 40.0, "last_updated": "5 mins ago"}
        }
    },
    {
        "id": "apollo-pharmacy",
        "name": "Apollo Pharmacy 24x7",
        "address": "Plot 88, 100 Feet Road, HAL 2nd Stage",
        "area": "100 Feet Road",
        "distance": 1.2,
        "distance_text": "1.2 km away",
        "rating": 4.7,
        "reviews_count": 840,
        "verified": True,
        "open_status": "Open 24 Hours",
        "phone": "+91 80 2520 4400",
        "coord_x": 32.0,
        "coord_y": 52.0,
        "inventory": {
            "dolo-650": {"status": "Available", "quantity": 120, "price": 35.0, "last_updated": "2 mins ago"},
            "azithral-500": {"status": "Available", "quantity": 35, "price": 118.0, "last_updated": "15 mins ago"},
            "cetirizine-10": {"status": "Available", "quantity": 90, "price": 22.0, "last_updated": "4 mins ago"},
            "volini-gel": {"status": "Available", "quantity": 28, "price": 145.0, "last_updated": "6 mins ago"},
            "pan-40": {"status": "Available", "quantity": 40, "price": 155.0, "last_updated": "3 mins ago"},
            "augmentin-625": {"status": "Available", "quantity": 25, "price": 210.0, "last_updated": "5 mins ago"},
            "allegra-120": {"status": "Available", "quantity": 45, "price": 198.0, "last_updated": "10 mins ago"},
            "combiflam": {"status": "Available", "quantity": 110, "price": 42.0, "last_updated": "2 mins ago"}
        }
    },
    {
        "id": "wellness-forever",
        "name": "Wellness Forever Chemist",
        "address": "Ground Floor, Metro Pillar 42, CMH Road",
        "area": "CMH Road",
        "distance": 1.5,
        "distance_text": "1.5 km away",
        "rating": 4.6,
        "reviews_count": 420,
        "verified": True,
        "open_status": "Open 24 Hours",
        "phone": "+91 80 4112 8990",
        "coord_x": 74.0,
        "coord_y": 64.0,
        "inventory": {
            "dolo-650": {"status": "Available", "quantity": 80, "price": 35.0, "last_updated": "7 mins ago"},
            "azithral-500": {"status": "Low stock", "quantity": 4, "price": 116.0, "last_updated": "18 mins ago"},
            "cetirizine-10": {"status": "Available", "quantity": 45, "price": 21.0, "last_updated": "12 mins ago"},
            "volini-gel": {"status": "Available", "quantity": 14, "price": 142.0, "last_updated": "9 mins ago"},
            "pan-40": {"status": "Low stock", "quantity": 2, "price": 152.0, "last_updated": "25 mins ago"},
            "augmentin-625": {"status": "Low stock", "quantity": 3, "price": 208.0, "last_updated": "14 mins ago"},
            "allegra-120": {"status": "Available", "quantity": 22, "price": 195.0, "last_updated": "16 mins ago"},
            "combiflam": {"status": "Available", "quantity": 65, "price": 41.0, "last_updated": "8 mins ago"}
        }
    },
    {
        "id": "medplus-chemist",
        "name": "MedPlus Superstore",
        "address": "24, Double Road, Defence Colony",
        "area": "Defence Colony",
        "distance": 2.1,
        "distance_text": "2.1 km away",
        "rating": 4.5,
        "reviews_count": 195,
        "verified": True,
        "open_status": "Open until 10:00 PM",
        "phone": "+91 80 2341 5566",
        "coord_x": 42.0,
        "coord_y": 78.0,
        "inventory": {
            "dolo-650": {"status": "Available", "quantity": 60, "price": 33.0, "last_updated": "14 mins ago"},
            "azithral-500": {"status": "Available", "quantity": 15, "price": 114.0, "last_updated": "30 mins ago"},
            "cetirizine-10": {"status": "Available", "quantity": 50, "price": 19.0, "last_updated": "20 mins ago"},
            "volini-gel": {"status": "Available", "quantity": 18, "price": 138.0, "last_updated": "15 mins ago"},
            "pan-40": {"status": "Available", "quantity": 20, "price": 148.0, "last_updated": "10 mins ago"},
            "augmentin-625": {"status": "Out of stock", "quantity": 0, "price": 204.0, "last_updated": "1 hour ago"},
            "allegra-120": {"status": "Available", "quantity": 19, "price": 190.0, "last_updated": "40 mins ago"},
            "combiflam": {"status": "Available", "quantity": 70, "price": 39.0, "last_updated": "12 mins ago"}
        }
    },
    {
        "id": "lifecare-meds",
        "name": "LifeCare Pharma & Surgicals",
        "address": "Shop 12, Krishna Temple Road, Domlur",
        "area": "Domlur",
        "distance": 2.8,
        "distance_text": "2.8 km away",
        "rating": 4.4,
        "reviews_count": 88,
        "verified": False,
        "open_status": "Open until 10:00 PM",
        "phone": "+91 98860 77123",
        "coord_x": 82.0,
        "coord_y": 32.0,
        "inventory": {
            "dolo-650": {"status": "Available", "quantity": 30, "price": 36.0, "last_updated": "45 mins ago"},
            "azithral-500": {"status": "Low stock", "quantity": 2, "price": 120.0, "last_updated": "50 mins ago"},
            "cetirizine-10": {"status": "Available", "quantity": 25, "price": 22.0, "last_updated": "35 mins ago"},
            "volini-gel": {"status": "Out of stock", "quantity": 0, "price": 145.0, "last_updated": "2 hours ago"},
            "pan-40": {"status": "Available", "quantity": 10, "price": 155.0, "last_updated": "30 mins ago"},
            "augmentin-625": {"status": "Available", "quantity": 8, "price": 215.0, "last_updated": "25 mins ago"},
            "allegra-120": {"status": "Available", "quantity": 12, "price": 200.0, "last_updated": "40 mins ago"},
            "combiflam": {"status": "Available", "quantity": 40, "price": 42.0, "last_updated": "30 mins ago"}
        }
    }
]

INITIAL_NOTIFICATIONS = [
    {
        "id": "notif-1",
        "title": "Stock Alert: Azithral 500",
        "message": "Apollo Pharmacy 24x7 received 35 fresh units.",
        "time": "10 mins ago",
        "read": False
    },
    {
        "id": "notif-2",
        "title": "Price Drop on Pain Relief",
        "message": "MedPlus Superstore has discounted Dolo 650 to ₹33.",
        "time": "1 hour ago",
        "read": False
    },
    {
        "id": "notif-3",
        "title": "Reservation Reminder",
        "message": "Reservations are held for 24 hours at neighborhood stores.",
        "time": "Yesterday",
        "read": True
    }
]

INITIAL_USERS = [
    {
        "id": "user-patient-1",
        "role": "patient",
        "name": "Sarah Connor",
        "email": "sarah.connor@example.com",
    },
    {
        "id": "user-owner-1",
        "role": "pharmacy_owner",
        "name": "Rajesh Kumar",
        "email": "rajesh@xyzpharmacy.com",
        "pharmacy_id": "xyz-pharmacy",
        "pharmacy_name": "XYZ Neighborhood Pharmacy"
    }
]


INITIAL_RESERVATIONS = [
    {
        "id": "res-seed-1",
        "code": "RX-19782",
        "medicine_id": "azithral-500",
        "medicine_name": "Azithral 500",
        "medicine_strength": "500 mg",
        "pharmacy_id": "xyz-pharmacy",
        "pharmacy_name": "XYZ Neighborhood Pharmacy",
        "pharmacy_address": "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
        "pharmacy_phone": "+91 98450 12384",
        "unit_price": 115.0,
        "quantity": 2,
        "total_price": 230.0,
        "created_at": "Today at 10:15 AM",
        "pickup_deadline": "Held for 24 hours (Today before 8:00 PM)",
        "patient_name": "Om",
        "patient_phone": "+91 98765 43210",
        "time_slot": "Today before 8:00 PM",
        "status": "Ready for pickup",
    },
    {
        "id": "res-seed-2",
        "code": "RX-84920",
        "medicine_id": "dolo-650",
        "medicine_name": "Dolo 650",
        "medicine_strength": "650 mg",
        "pharmacy_id": "xyz-pharmacy",
        "pharmacy_name": "XYZ Neighborhood Pharmacy",
        "pharmacy_address": "Shop 4, Sunrise Heights, 12th Main, Indiranagar",
        "pharmacy_phone": "+91 98450 12384",
        "unit_price": 34.0,
        "quantity": 1,
        "total_price": 34.0,
        "created_at": "Yesterday at 6:40 PM",
        "pickup_deadline": "Held for 24 hours",
        "patient_name": "Pooja Sharma",
        "patient_phone": "+91 98234 56789",
        "time_slot": "Today morning",
        "status": "Ready for pickup",
    },
]


def seed_database(db: Session):
    # Check if already seeded
    if db.query(Medicine).first():
        # Check if reservations table is empty and needs initial seeds
        if not db.query(Reservation).first():
            for r_data in INITIAL_RESERVATIONS:
                db.add(Reservation(**r_data))
            db.commit()
        return

    # Seed medicines
    for med_data in INITIAL_MEDICINES:
        med = Medicine(**med_data)
        db.add(med)
    db.commit()

    # Seed pharmacies and stock
    for p_data in INITIAL_PHARMACIES:
        inventory = p_data.pop("inventory")
        pharmacy = Pharmacy(**p_data)
        db.add(pharmacy)
        db.commit()

        for med_id, stock_data in inventory.items():
            stock = PharmacyStock(
                pharmacy_id=pharmacy.id,
                medicine_id=med_id,
                status=stock_data["status"],
                quantity=stock_data["quantity"],
                price=stock_data["price"],
                last_updated=stock_data.get("last_updated", "Just now")
            )
            db.add(stock)
        db.commit()

    # Seed notifications
    for n_data in INITIAL_NOTIFICATIONS:
        notif = Notification(**n_data)
        db.add(notif)

    # Seed users
    for u_data in INITIAL_USERS:
        user = User(**u_data)
        db.add(user)

    db.commit()
    print("Database successfully seeded with MedStash demo records!")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
