from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Medicine, Pharmacy, PharmacyStock, Reservation

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    total_medicines = db.query(Medicine).count()
    total_pharmacies = db.query(Pharmacy).count()
    active_reservations = db.query(Reservation).filter(Reservation.status.in_(["Confirmed", "Ready for pickup"])).count()
    completed_reservations = db.query(Reservation).filter(Reservation.status == "Picked Up").count()
    low_stock_count = db.query(PharmacyStock).filter(PharmacyStock.status == "Low stock").count()
    out_of_stock_count = db.query(PharmacyStock).filter(PharmacyStock.status == "Out of stock").count()

    return {
        "totalMedicines": total_medicines,
        "totalPharmacies": total_pharmacies,
        "activeReservations": active_reservations,
        "completedReservations": completed_reservations,
        "lowStockCount": low_stock_count,
        "outOfStockCount": out_of_stock_count,
    }
