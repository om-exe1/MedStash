from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import Medicine
from ..schemas import MedicineSchema, MedicineCreate

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])

@router.get("", response_model=List[MedicineSchema])
def get_medicines(
    q: Optional[str] = Query(None, description="Search term for name or generic"),
    category: Optional[str] = Query(None, description="Filter by category"),
    popular: Optional[bool] = Query(None, description="Filter popular medicines"),
    db: Session = Depends(get_db)
):
    query = db.query(Medicine)
    if q:
        search_pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Medicine.name.ilike(search_pattern),
                Medicine.generic.ilike(search_pattern),
                Medicine.description.ilike(search_pattern)
            )
        )
    if category and category != "All":
        query = query.filter(Medicine.category == category)
    if popular is not None:
        query = query.filter(Medicine.popular == popular)

    medicines = query.all()
    # Map to schema
    return [
        MedicineSchema(
            id=m.id,
            name=m.name,
            generic=m.generic,
            form=m.form,
            strength=m.strength,
            category=m.category,
            prescriptionRequired=m.prescription_required,
            basePrice=m.base_price,
            description=m.description,
            uses=m.uses or [],
            dosage=m.dosage,
            sideEffects=m.side_effects or [],
            storage=m.storage,
            popular=m.popular
        )
        for m in medicines
    ]

@router.post("", response_model=MedicineSchema)
def create_medicine(data: MedicineCreate, db: Session = Depends(get_db)):
    med_slug = data.name.strip().lower().replace(" ", "-").replace("/", "-")
    existing = db.query(Medicine).filter(Medicine.id == med_slug).first()
    if existing:
        med_slug = f"{med_slug}-{int(datetime.utcnow().timestamp())}"

    med = Medicine(
        id=med_slug,
        name=data.name.strip(),
        generic=data.generic.strip(),
        form=data.form,
        strength=data.strength,
        category=data.category,
        prescription_required=data.prescriptionRequired,
        base_price=data.basePrice,
        description=data.description or f"{data.name} is a {data.strength} medication for {data.category.lower()}.",
        uses=data.uses if data.uses else ["General therapeutic treatment"],
        dosage=data.dosage or "Take as directed by a healthcare professional.",
        side_effects=data.sideEffects if data.sideEffects else [],
        storage=data.storage or "Store in a cool, dry place.",
        popular=data.popular or False
    )
    db.add(med)
    db.commit()
    db.refresh(med)

    return MedicineSchema(
        id=med.id,
        name=med.name,
        generic=med.generic,
        form=med.form,
        strength=med.strength,
        category=med.category,
        prescriptionRequired=med.prescription_required,
        basePrice=med.base_price,
        description=med.description,
        uses=med.uses or [],
        dosage=med.dosage,
        sideEffects=med.side_effects or [],
        storage=med.storage,
        popular=med.popular
    )


@router.get("/{medicine_id}", response_model=MedicineSchema)
def get_medicine_by_id(medicine_id: str, db: Session = Depends(get_db)):
    m = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return MedicineSchema(
        id=m.id,
        name=m.name,
        generic=m.generic,
        form=m.form,
        strength=m.strength,
        category=m.category,
        prescriptionRequired=m.prescription_required,
        basePrice=m.base_price,
        description=m.description,
        uses=m.uses or [],
        dosage=m.dosage,
        sideEffects=m.side_effects or [],
        storage=m.storage,
        popular=m.popular
    )
