from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from models import (
    Product, ProductCreate,
    PortfolioItem, PortfolioItemCreate,
    ContactSubmission, ContactSubmissionCreate,
    Order, OrderCreate
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="CBKS77 Portfolio & Merch API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "CBKS77 API - Portfolio & Merch Site", "status": "running"}


# Product Endpoints
@api_router.get("/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    try:
        products = await db.products.find().to_list(1000)
        return [Product(**product) for product in products]
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        product = await db.products.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return Product(**product)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch product")


@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    try:
        new_product = Product(**product.model_dump())
        await db.products.insert_one(new_product.model_dump())
        return new_product
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to create product")


# Portfolio Endpoints
@api_router.get("/portfolio", response_model=List[PortfolioItem])
async def get_portfolio():
    """Get all portfolio items"""
    try:
        items = await db.portfolio.find().to_list(1000)
        return [PortfolioItem(**item) for item in items]
    except Exception as e:
        logger.error(f"Error fetching portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio")


@api_router.get("/portfolio/{item_id}", response_model=PortfolioItem)
async def get_portfolio_item(item_id: str):
    """Get a single portfolio item by ID"""
    try:
        item = await db.portfolio.find_one({"id": item_id})
        if not item:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        return PortfolioItem(**item)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio item")


@api_router.post("/portfolio", response_model=PortfolioItem)
async def create_portfolio_item(item: PortfolioItemCreate):
    """Create a new portfolio item"""
    try:
        new_item = PortfolioItem(**item.model_dump())
        await db.portfolio.insert_one(new_item.model_dump())
        return new_item
    except Exception as e:
        logger.error(f"Error creating portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create portfolio item")


# Contact Endpoints
@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact_form(submission: ContactSubmissionCreate):
    """Submit a contact form"""
    try:
        new_submission = ContactSubmission(**submission.dict())
        await db.contact_submissions.insert_one(new_submission.dict())
        logger.info(f"Contact form submitted by {submission.email}")
        return new_submission
    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")


@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    """Get all contact submissions (admin only in future)"""
    try:
        submissions = await db.contact_submissions.find().sort("createdAt", -1).to_list(1000)
        return [ContactSubmission(**sub) for sub in submissions]
    except Exception as e:
        logger.error(f"Error fetching contact submissions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact submissions")


# Order Endpoints
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    """Create a new order"""
    try:
        new_order = Order(**order.dict())
        await db.orders.insert_one(new_order.dict())
        logger.info(f"Order created: {new_order.orderNumber}")
        return new_order
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Failed to create order")


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get order details"""
    try:
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return Order(**order)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()