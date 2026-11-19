from typing import List, Optional, Dict
from pydantic import BaseModel, Field, ConfigDict

# Helper base schema for camelCase serialization
class CamelModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class Coordinates(BaseModel):
    x: float
    y: float


class PharmacyStockSchema(CamelModel):
    status: str
    quantity: int
    price: float
    lastUpdated: str = Field(alias="lastUpdated", default="Just now")


class StockUpdateSchema(BaseModel):
    status: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    lastUpdated: Optional[str] = None


class MedicineSchema(CamelModel):
    id: str
    name: str
    generic: str
    form: str
    strength: str
    category: str
    prescriptionRequired: bool = Field(alias="prescriptionRequired")
    basePrice: float = Field(alias="basePrice")
    description: str
    uses: List[str] = []
    dosage: str
    sideEffects: List[str] = Field(alias="sideEffects", default=[])
    storage: str
    popular: Optional[bool] = False


class MedicineCreate(CamelModel):
    name: str
    generic: str
    form: str = "Tablet"
    strength: str = "500 mg"
    category: str = "Pain relief"
    prescriptionRequired: bool = Field(alias="prescriptionRequired", default=False)
    basePrice: float = Field(alias="basePrice", default=30.0)
    description: Optional[str] = ""
    uses: List[str] = []
    dosage: Optional[str] = ""
    sideEffects: List[str] = Field(alias="sideEffects", default=[])
    storage: Optional[str] = "Store below 25°C in a dry place."
    popular: Optional[bool] = False


class PharmacySchema(CamelModel):
    id: str
    name: str
    address: str
    area: str
    distance: float
    distanceText: str = Field(alias="distanceText")
    rating: float
    reviewsCount: int = Field(alias="reviewsCount")
    verified: bool
    openStatus: str = Field(alias="openStatus")
    phone: str
    coordinates: Coordinates
    lat: Optional[float] = None
    lng: Optional[float] = None
    inventory: Dict[str, PharmacyStockSchema] = {}


class ReservationCreate(CamelModel):
    medicineId: str
    medicineName: str
    medicineStrength: Optional[str] = ""
    pharmacyId: str
    pharmacyName: str
    pharmacyAddress: Optional[str] = ""
    pharmacyPhone: Optional[str] = ""
    unitPrice: float
    quantity: int
    totalPrice: float
    patientName: str
    patientPhone: Optional[str] = ""
    timeSlot: str = "Today afternoon"


class ReservationStatusUpdate(BaseModel):
    status: str


class ReservationSchema(CamelModel):
    id: str
    code: str
    medicineId: str
    medicineName: str
    medicineStrength: Optional[str] = ""
    pharmacyId: str
    pharmacyName: str
    pharmacyAddress: Optional[str] = ""
    pharmacyPhone: Optional[str] = ""
    unitPrice: float
    quantity: int
    totalPrice: float
    createdAt: str
    pickupDeadline: str
    patientName: str
    patientPhone: Optional[str] = ""
    timeSlot: str
    status: str


class UserLoginRequest(BaseModel):
    role: str
    email: Optional[str] = None
    password: Optional[str] = None


class UserProfileSchema(CamelModel):
    id: str
    role: str
    name: str
    email: str
    pharmacyId: Optional[str] = None
    pharmacyName: Optional[str] = None


class NotificationSchema(CamelModel):
    id: str
    title: str
    message: str
    time: str
    read: bool
