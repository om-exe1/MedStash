import random
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import Reservation, PharmacyStock
from ..schemas import ReservationSchema, ReservationCreate, ReservationStatusUpdate

router = APIRouter(prefix="/api/reservations", tags=["Reservations"])

@router.get("", response_model=List[ReservationSchema])
def get_reservations(
    pharmacy_id: Optional[str] = Query(None, alias="pharmacyId"),
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Reservation)
    if pharmacy_id:
        query = query.filter(Reservation.pharmacy_id == pharmacy_id)
    if status:
        query = query.filter(Reservation.status == status)

    reservations = query.order_by(Reservation.created_at.desc()).all()
    return [
        ReservationSchema(
            id=r.id,
            code=r.code,
            medicineId=r.medicine_id,
            medicineName=r.medicine_name,
            medicineStrength=r.medicine_strength or "",
            pharmacyId=r.pharmacy_id,
            pharmacyName=r.pharmacy_name,
            pharmacyAddress=r.pharmacy_address or "",
            pharmacyPhone=r.pharmacy_phone or "",
            unitPrice=r.unit_price,
            quantity=r.quantity,
            totalPrice=r.total_price,
            createdAt=r.created_at,
            pickupDeadline=r.pickup_deadline,
            patientName=r.patient_name,
            patientPhone=r.patient_phone or "",
            timeSlot=r.time_slot,
            status=r.status
        )
        for r in reservations
    ]

@router.get("/verify/{code}", response_model=ReservationSchema)
def verify_reservation_code(code: str, db: Session = Depends(get_db)):
    clean_code = code.strip().upper()
    res = db.query(Reservation).filter(
        or_(
            Reservation.code.ilike(f"%{clean_code}%"),
            Reservation.id.ilike(f"%{clean_code}%")
        )
    ).first()
    if not res:
        raise HTTPException(status_code=404, detail=f"No reservation found matching code '{code}'")

    return ReservationSchema(
        id=res.id,
        code=res.code,
        medicineId=res.medicine_id,
        medicineName=res.medicine_name,
        medicineStrength=res.medicine_strength or "",
        pharmacyId=res.pharmacy_id,
        pharmacyName=res.pharmacy_name,
        pharmacyAddress=res.pharmacy_address or "",
        pharmacyPhone=res.pharmacy_phone or "",
        unitPrice=res.unit_price,
        quantity=res.quantity,
        totalPrice=res.total_price,
        createdAt=res.created_at,
        pickupDeadline=res.pickup_deadline,
        patientName=res.patient_name,
        patientPhone=res.patient_phone or "",
        timeSlot=res.time_slot,
        status=res.status
    )

@router.post("", response_model=ReservationSchema)
def create_reservation(data: ReservationCreate, db: Session = Depends(get_db)):
    # Generate unique ID and 4-digit code
    code_digits = random.randint(1000, 9999)
    reservation_code = f"RES-{code_digits}"
    reservation_id = f"res-{datetime.utcnow().timestamp():.0f}-{code_digits}"

    now = datetime.now()
    created_at_str = now.strftime("%b %d, %Y, %I:%M %p")
    deadline = now + timedelta(hours=24)
    deadline_str = deadline.strftime("%b %d, %I:%M %p")

    reservation = Reservation(
        id=reservation_id,
        code=reservation_code,
        medicine_id=data.medicineId,
        medicine_name=data.medicineName,
        medicine_strength=data.medicineStrength or "",
        pharmacy_id=data.pharmacyId,
        pharmacy_name=data.pharmacyName,
        pharmacy_address=data.pharmacyAddress or "",
        pharmacy_phone=data.pharmacyPhone or "",
        unit_price=data.unitPrice,
        quantity=data.quantity,
        total_price=data.totalPrice,
        created_at=created_at_str,
        pickup_deadline=deadline_str,
        patient_name=data.patientName,
        patient_phone=data.patientPhone or "",
        time_slot=data.timeSlot,
        status="Confirmed"
    )
    db.add(reservation)

    # Decrement stock if available
    stock = db.query(PharmacyStock).filter(
        PharmacyStock.pharmacy_id == data.pharmacyId,
        PharmacyStock.medicine_id == data.medicineId
    ).first()
    if stock and stock.quantity >= data.quantity:
        stock.quantity -= data.quantity
        if stock.quantity == 0:
            stock.status = "Out of stock"
        elif stock.quantity < 5:
            stock.status = "Low stock"
        stock.last_updated = "Just now"

    db.commit()
    db.refresh(reservation)

    return ReservationSchema(
        id=reservation.id,
        code=reservation.code,
        medicineId=reservation.medicine_id,
        medicineName=reservation.medicine_name,
        medicineStrength=reservation.medicine_strength or "",
        pharmacyId=reservation.pharmacy_id,
        pharmacyName=reservation.pharmacy_name,
        pharmacyAddress=reservation.pharmacy_address or "",
        pharmacyPhone=reservation.pharmacy_phone or "",
        unitPrice=reservation.unit_price,
        quantity=reservation.quantity,
        totalPrice=reservation.total_price,
        createdAt=reservation.created_at,
        pickupDeadline=reservation.pickup_deadline,
        patientName=reservation.patient_name,
        patientPhone=reservation.patient_phone or "",
        timeSlot=reservation.time_slot,
        status=reservation.status
    )

@router.patch("/{reservation_id}/status", response_model=ReservationSchema)
def update_reservation_status(
    reservation_id: str,
    status_update: ReservationStatusUpdate,
    db: Session = Depends(get_db)
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")

    old_status = res.status
    new_status = status_update.status
    res.status = new_status

    # If status changes to Cancelled, return stock back
    if old_status != "Cancelled" and new_status == "Cancelled":
        stock = db.query(PharmacyStock).filter(
            PharmacyStock.pharmacy_id == res.pharmacy_id,
            PharmacyStock.medicine_id == res.medicine_id
        ).first()
        if stock:
            stock.quantity += res.quantity
            if stock.quantity >= 5:
                stock.status = "Available"
            elif stock.quantity > 0:
                stock.status = "Low stock"
            stock.last_updated = "Just now"

    db.commit()
    db.refresh(res)

    return ReservationSchema(
        id=res.id,
        code=res.code,
        medicineId=res.medicine_id,
        medicineName=res.medicine_name,
        medicineStrength=res.medicine_strength or "",
        pharmacyId=res.pharmacy_id,
        pharmacyName=res.pharmacy_name,
        pharmacyAddress=res.pharmacy_address or "",
        pharmacyPhone=res.pharmacy_phone or "",
        unitPrice=res.unit_price,
        quantity=res.quantity,
        totalPrice=res.total_price,
        createdAt=res.created_at,
        pickupDeadline=res.pickup_deadline,
        patientName=res.patient_name,
        patientPhone=res.patient_phone or "",
        timeSlot=res.time_slot,
        status=res.status
    )


@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: str, db: Session = Depends(get_db)):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if res.status != "Cancelled":
        stock = db.query(PharmacyStock).filter(
            PharmacyStock.pharmacy_id == res.pharmacy_id,
            PharmacyStock.medicine_id == res.medicine_id
        ).first()
        if stock:
            stock.quantity += res.quantity
            if stock.quantity >= 5:
                stock.status = "Available"
            elif stock.quantity > 0:
                stock.status = "Low stock"
            stock.last_updated = "Just now"
    db.delete(res)
    db.commit()
    return {"message": f"Reservation {reservation_id} deleted"}
