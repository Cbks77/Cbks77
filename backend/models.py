from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    image: str
    description: str
    sizes: List[str]
    inStock: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    price: float
    image: str
    description: str
    sizes: List[str]
    inStock: bool = True

# Portfolio Models
class PortfolioItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: str  # 'video' or 'image'
    thumbnail: str
    videoUrl: Optional[str] = None
    category: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class PortfolioItemCreate(BaseModel):
    title: str
    description: str
    type: str
    thumbnail: str
    videoUrl: Optional[str] = None
    category: str

# Contact Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    status: str = "new"  # new, read, replied
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# Order Models
class OrderItem(BaseModel):
    productId: str
    productName: str
    size: str
    quantity: int
    price: float

class ShippingAddress(BaseModel):
    fullName: str
    addressLine1: str
    addressLine2: Optional[str] = None
    city: str
    state: str
    zipCode: str
    country: str

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    orderNumber: str = Field(default_factory=lambda: f"ORD-{uuid.uuid4().hex[:8].upper()}")
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    customerEmail: str
    customerName: str
    shippingAddress: Optional[ShippingAddress] = None
    paymentStatus: str = "pending"  # pending, completed, failed
    paypalOrderId: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    customerEmail: str
    customerName: str
    shippingAddress: Optional[ShippingAddress] = None