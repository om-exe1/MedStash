from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Notification
from ..schemas import NotificationSchema

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationSchema])
def get_notifications(db: Session = Depends(get_db)):
    notifs = db.query(Notification).all()
    return [
        NotificationSchema(
            id=n.id,
            title=n.title,
            message=n.message,
            time=n.time,
            read=n.read
        )
        for n in notifs
    ]

@router.patch("/mark-read")
def mark_all_read(db: Session = Depends(get_db)):
    db.query(Notification).update({Notification.read: True})
    db.commit()
    return {"message": "All notifications marked as read"}
