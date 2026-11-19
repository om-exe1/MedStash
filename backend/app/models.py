from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    generic = Column(String, nullable=False, index=True)
    form = Column(String, nullable=False)
    strength = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    prescription_required = Column(Boolean, default=False)
    base_price = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    uses = Column(JSON, default=list)
    dosage = Column(Text, nullable=False)
    side_effects = Column(JSON, default=list)
    storage = Column(String, nullable=False)
    popular = Column(Boolean, default=False)

    stock_items = relationship("PharmacyStock", back_populates="medicine", cascade="all, delete-orphan")


class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    address = Column(String, nullable=False)
    area = Column(String, nullable=False, index=True)
    distance = Column(Float, default=0.0)
    distance_text = Column(String, default="")
    rating = Column(Float, default=5.0)
    reviews_count = Column(Integer, default=0)
    verified = Column(Boolean, default=True)
    open_status = Column(String, default="Open 24 Hours")
    phone = Column(String, default="")
    coord_x = Column(Float, default=50.0)
    coord_y = Column(Float, default=50.0)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    stock_items = relationship("PharmacyStock", back_populates="pharmacy", cascade="all, delete-orphan")


class PharmacyStock(Base):
    __tablename__ = "pharmacy_stock"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False, index=True)
    medicine_id = Column(String, ForeignKey("medicines.id"), nullable=False, index=True)
    status = Column(String, default="Available")  # Available, Low stock, Out of stock
    quantity = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    last_updated = Column(String, default="Just now")

    pharmacy = relationship("Pharmacy", back_populates="stock_items")
    medicine = relationship("Medicine", back_populates="stock_items")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(String, primary_key=True, index=True)
    code = Column(String, nullable=False, index=True)
    medicine_id = Column(String, ForeignKey("medicines.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    medicine_strength = Column(String, default="")
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    pharmacy_name = Column(String, nullable=False)
    pharmacy_address = Column(String, default="")
    pharmacy_phone = Column(String, default="")
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    created_at = Column(String, nullable=False)
    pickup_deadline = Column(String, nullable=False)
    patient_name = Column(String, nullable=False)
    patient_phone = Column(String, default="")
    time_slot = Column(String, default="Today afternoon")
    status = Column(String, default="Confirmed")  # Confirmed, Ready for pickup, Picked Up, Cancelled


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    role = Column(String, nullable=False)  # "patient" or "pharmacy_owner"
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    pharmacy_id = Column(String, nullable=True)
    pharmacy_name = Column(String, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    time = Column(String, nullable=False)
    read = Column(Boolean, default=False)
