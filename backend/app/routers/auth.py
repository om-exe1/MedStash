import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserProfileSchema, UserLoginRequest

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login", response_model=UserProfileSchema)
def login(request: UserLoginRequest, db: Session = Depends(get_db)):
    user = None
    if request.email:
        user = db.query(User).filter(User.email == request.email).first()
    if not user:
        user = db.query(User).filter(User.role == request.role).first()

    if not user:
        unique_suffix = int(time.time())
        if request.role == "pharmacy_owner":
            user = User(
                id=f"user-owner-{unique_suffix}",
                role="pharmacy_owner",
                name="Rajesh Kumar",
                email=request.email or f"chemist-{unique_suffix}@xyzpharmacy.com",
                pharmacy_id="xyz-pharmacy",
                pharmacy_name="XYZ Neighborhood Pharmacy"
            )
        else:
            user = User(
                id=f"user-patient-{unique_suffix}",
                role="patient",
                name="Sarah Connor",
                email=request.email or f"patient-{unique_suffix}@example.com",
            )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserProfileSchema(
        id=user.id,
        role=user.role,
        name=user.name,
        email=user.email,
        pharmacyId=user.pharmacy_id,
        pharmacyName=user.pharmacy_name
    )
