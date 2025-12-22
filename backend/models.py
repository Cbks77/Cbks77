from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

# Media Item for galleries
class MediaItem(BaseModel):
    url: str
    type: str = "image"  # 'image' or 'video'
    caption: Optional[str] = None

# Product Models - Updated with gallery support
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    image: str  # Primary image (for backwards compatibility)
    images: List[str] = []  # Gallery images (up to 7)
    description: str
    sizes: List[str]
    inStock: bool = True
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    price: float
    image: str
    images: List[str] = []
    description: str
    sizes: List[str]
    inStock: bool = True

# Portfolio Models - Updated with gallery support
class PortfolioItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: str  # 'video' or 'image'
    thumbnail: str
    videoUrl: Optional[str] = None
    media: List[MediaItem] = []  # Gallery of images/videos (up to 7)
    category: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PortfolioItemCreate(BaseModel):
    title: str
    description: str
    type: str
    thumbnail: str
    videoUrl: Optional[str] = None
    media: List[MediaItem] = []
    category: str

# Contact Models
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    status: str = "new"  # new, read, replied
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    customerEmail: str
    customerName: str
    shippingAddress: Optional[ShippingAddress] = None

# Page Builder Models
class PageBlock(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # 'text', 'image', 'video', 'gallery', 'hero', 'grid', 'spacer'
    content: Dict[str, Any] = {}  # Block-specific content
    order: int = 0
    settings: Dict[str, Any] = {}  # Styling settings

class CustomPage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str  # URL-friendly name (e.g., 'about-us')
    blocks: List[PageBlock] = []
    isPublished: bool = False
    showInNav: bool = False  # Show in navigation menu
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomPageCreate(BaseModel):
    title: str
    slug: str
    blocks: List[PageBlock] = []
    isPublished: bool = False
    showInNav: bool = False

class CustomPageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    blocks: Optional[List[PageBlock]] = None
    isPublished: Optional[bool] = None
    showInNav: Optional[bool] = None

# Site Settings Model
class SiteSettings(BaseModel):
    id: str = "site_settings"
    siteName: str = "CBKS77"
    tagline: str = "UNBOTHERED. CREATIVE. BOLD."
    primaryColor: str = "#ef4444"  # red-500
    socialLinks: Dict[str, str] = {}
    footerText: str = ""
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
