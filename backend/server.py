from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from pydantic import BaseModel
from models import (
    Product, ProductCreate,
    PortfolioItem, PortfolioItemCreate,
    ContactSubmission, ContactSubmissionCreate,
    Order, OrderCreate,
    CustomPage, CustomPageCreate, CustomPageUpdate,
    SiteSettings
)
from paypal_service import paypal_service
from fastapi.responses import Response
from datetime import datetime, timezone

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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


# Health check endpoint for Kubernetes (must be at root level, not under /api)
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes deployment"""
    try:
        # Test MongoDB connection
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "healthy", "database": "disconnected"}


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


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate):
    """Update a product"""
    try:
        existing = await db.products.find_one({"id": product_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        updated_product = Product(id=product_id, **product.model_dump())
        await db.products.replace_one({"id": product_id}, updated_product.model_dump())
        return updated_product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to update product")


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    try:
        result = await db.products.delete_one({"id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete product")


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


@api_router.put("/portfolio/{item_id}", response_model=PortfolioItem)
async def update_portfolio_item(item_id: str, item: PortfolioItemCreate):
    """Update a portfolio item"""
    try:
        existing = await db.portfolio.find_one({"id": item_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        updated_item = PortfolioItem(id=item_id, **item.model_dump())
        await db.portfolio.replace_one({"id": item_id}, updated_item.model_dump())
        return updated_item
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to update portfolio item")


@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str):
    """Delete a portfolio item"""
    try:
        result = await db.portfolio.delete_one({"id": item_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        return {"message": "Portfolio item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete portfolio item")


# Custom Pages Endpoints
@api_router.get("/pages", response_model=List[CustomPage])
async def get_pages():
    """Get all custom pages"""
    try:
        pages = await db.pages.find().to_list(1000)
        return [CustomPage(**page) for page in pages]
    except Exception as e:
        logger.error(f"Error fetching pages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch pages")


@api_router.get("/pages/published")
async def get_published_pages():
    """Get all published pages for navigation"""
    try:
        pages = await db.pages.find({"isPublished": True}).to_list(1000)
        return [{"id": p["id"], "title": p["title"], "slug": p["slug"], "showInNav": p.get("showInNav", False)} for p in pages]
    except Exception as e:
        logger.error(f"Error fetching published pages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch pages")


@api_router.get("/pages/slug/{slug}", response_model=CustomPage)
async def get_page_by_slug(slug: str):
    """Get a page by its slug"""
    try:
        page = await db.pages.find_one({"slug": slug})
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return CustomPage(**page)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching page: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page")


@api_router.get("/pages/{page_id}", response_model=CustomPage)
async def get_page(page_id: str):
    """Get a single page by ID"""
    try:
        page = await db.pages.find_one({"id": page_id})
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")
        return CustomPage(**page)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching page: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch page")


@api_router.post("/pages", response_model=CustomPage)
async def create_page(page: CustomPageCreate):
    """Create a new custom page"""
    try:
        existing = await db.pages.find_one({"slug": page.slug})
        if existing:
            raise HTTPException(status_code=400, detail="A page with this slug already exists")
        
        new_page = CustomPage(**page.model_dump())
        await db.pages.insert_one(new_page.model_dump())
        logger.info(f"Custom page created: {new_page.title}")
        return new_page
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating page: {e}")
        raise HTTPException(status_code=500, detail="Failed to create page")


@api_router.put("/pages/{page_id}", response_model=CustomPage)
async def update_page(page_id: str, page_update: CustomPageUpdate):
    """Update a custom page"""
    try:
        existing = await db.pages.find_one({"id": page_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Page not found")
        
        update_data = {k: v for k, v in page_update.model_dump().items() if v is not None}
        
        if "slug" in update_data:
            slug_exists = await db.pages.find_one({"slug": update_data["slug"], "id": {"$ne": page_id}})
            if slug_exists:
                raise HTTPException(status_code=400, detail="A page with this slug already exists")
        
        await db.pages.update_one({"id": page_id}, {"$set": update_data})
        updated = await db.pages.find_one({"id": page_id})
        return CustomPage(**updated)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating page: {e}")
        raise HTTPException(status_code=500, detail="Failed to update page")


@api_router.delete("/pages/{page_id}")
async def delete_page(page_id: str):
    """Delete a custom page"""
    try:
        result = await db.pages.delete_one({"id": page_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Page not found")
        return {"message": "Page deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting page: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete page")


# Site Settings Endpoints
@api_router.get("/settings", response_model=SiteSettings)
async def get_site_settings():
    """Get site settings"""
    try:
        settings = await db.settings.find_one({"id": "site_settings"})
        if not settings:
            return SiteSettings()
        return SiteSettings(**settings)
    except Exception as e:
        logger.error(f"Error fetching settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")


@api_router.put("/settings", response_model=SiteSettings)
async def update_site_settings(settings: SiteSettings):
    """Update site settings"""
    try:
        settings_dict = settings.model_dump()
        settings_dict["id"] = "site_settings"
        await db.settings.replace_one(
            {"id": "site_settings"},
            settings_dict,
            upsert=True
        )
        return settings
    except Exception as e:
        logger.error(f"Error updating settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to update settings")


# Contact Endpoints
@api_router.post("/contact", response_model=ContactSubmission)
async def submit_contact_form(submission: ContactSubmissionCreate):
    """Submit a contact form"""
    try:
        new_submission = ContactSubmission(**submission.model_dump())
        await db.contact_submissions.insert_one(new_submission.model_dump())
        logger.info(f"Contact form submitted by {submission.email}")
        return new_submission
    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")


@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    """Get all contact submissions"""
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
        new_order = Order(**order.model_dump())
        await db.orders.insert_one(new_order.model_dump())
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


# PayPal Payment Endpoints
class PayPalCaptureRequest(BaseModel):
    paypalOrderId: str


@api_router.post("/orders/{order_id}/create-payment")
async def create_paypal_payment(order_id: str):
    """Create PayPal order for payment"""
    try:
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        items = []
        for item in order['items']:
            items.append({
                "name": item['productName'],
                "price": item['price'],
                "quantity": item['quantity']
            })
        
        payment_data = {
            "items": items,
            "total": order['total'],
            "orderNumber": order['orderNumber']
        }
        
        result = paypal_service.create_order(payment_data)
        
        if result['success']:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"paypalOrderId": result['order_id']}}
            )
            return {
                "success": True,
                "payment_id": result['order_id']
            }
        else:
            raise HTTPException(status_code=400, detail=result.get('error', 'Payment creation failed'))
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating PayPal order: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment")


@api_router.post("/orders/{order_id}/capture")
async def capture_paypal_payment(order_id: str, capture_req: PayPalCaptureRequest):
    """Capture/execute PayPal order"""
    try:
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        result = paypal_service.capture_order(capture_req.paypalOrderId)
        
        if result['success']:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {
                    "paymentStatus": "completed",
                    "paypalOrderId": capture_req.paypalOrderId
                }}
            )
            logger.info(f"Payment captured for order {order_id}")
            return {"success": True, "message": "Payment captured successfully"}
        else:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {"paymentStatus": "failed"}}
            )
            raise HTTPException(status_code=400, detail=result.get('error', 'Payment capture failed'))
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error capturing payment: {e}")
        raise HTTPException(status_code=500, detail="Failed to capture payment")


# Dynamic Sitemap Generation - must be defined BEFORE include_router
@api_router.get("/sitemap.xml", response_class=Response)
async def generate_sitemap():
    """Generate dynamic sitemap.xml from database content"""
    try:
        base_url = "https://cbks77.com"
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        # Static pages
        urls = [
            {"loc": f"{base_url}/", "priority": "1.0", "changefreq": "weekly"},
            {"loc": f"{base_url}/shop", "priority": "0.9", "changefreq": "daily"},
            {"loc": f"{base_url}/portfolio", "priority": "0.9", "changefreq": "weekly"},
            {"loc": f"{base_url}/contact", "priority": "0.7", "changefreq": "monthly"},
        ]
        
        # Fetch products from database
        products = await db.products.find({}, {"id": 1}).to_list(1000)
        for product in products:
            urls.append({
                "loc": f"{base_url}/shop/{product['id']}",
                "priority": "0.8",
                "changefreq": "weekly"
            })
        
        # Fetch portfolio items from database
        portfolio_items = await db.portfolio.find({}, {"id": 1}).to_list(1000)
        for item in portfolio_items:
            urls.append({
                "loc": f"{base_url}/portfolio/{item['id']}",
                "priority": "0.8",
                "changefreq": "weekly"
            })
        
        # Fetch published custom pages from database
        pages = await db.pages.find({"isPublished": True}, {"slug": 1}).to_list(1000)
        for page in pages:
            urls.append({
                "loc": f"{base_url}/page/{page['slug']}",
                "priority": "0.7",
                "changefreq": "weekly"
            })
        
        # Generate XML
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        for url in urls:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{url["loc"]}</loc>\n'
            xml_content += f'    <lastmod>{today}</lastmod>\n'
            xml_content += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
            xml_content += f'    <priority>{url["priority"]}</priority>\n'
            xml_content += '  </url>\n'
        
        xml_content += '</urlset>'
        
        return Response(content=xml_content, media_type="application/xml")
    except Exception as e:
        logger.error(f"Error generating sitemap: {e}")
        fallback_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cbks77.com/</loc>
    <priority>1.0</priority>
  </url>
</urlset>'''
        return Response(content=fallback_xml, media_type="application/xml")


# Robots.txt endpoint
@api_router.get("/robots.txt", response_class=Response)
async def get_robots():
    """Serve robots.txt"""
    robots_content = """# robots.txt for CBKS77
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://cbks77.com/api/sitemap.xml

# Disallow admin pages from indexing
Disallow: /admin
Disallow: /admin/
"""
    return Response(content=robots_content, media_type="text/plain")


# Include the router in the main app - AFTER all routes are defined
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Dynamic Sitemap Generation - under /api for proper routing
@api_router.get("/sitemap.xml", response_class=Response)
async def generate_sitemap():
    """Generate dynamic sitemap.xml from database content"""
    try:
        base_url = "https://cbks77.com"
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        # Static pages
        urls = [
            {"loc": f"{base_url}/", "priority": "1.0", "changefreq": "weekly"},
            {"loc": f"{base_url}/shop", "priority": "0.9", "changefreq": "daily"},
            {"loc": f"{base_url}/portfolio", "priority": "0.9", "changefreq": "weekly"},
            {"loc": f"{base_url}/contact", "priority": "0.7", "changefreq": "monthly"},
        ]
        
        # Fetch products from database
        products = await db.products.find({}, {"id": 1}).to_list(1000)
        for product in products:
            urls.append({
                "loc": f"{base_url}/shop/{product['id']}",
                "priority": "0.8",
                "changefreq": "weekly"
            })
        
        # Fetch portfolio items from database
        portfolio_items = await db.portfolio.find({}, {"id": 1}).to_list(1000)
        for item in portfolio_items:
            urls.append({
                "loc": f"{base_url}/portfolio/{item['id']}",
                "priority": "0.8",
                "changefreq": "weekly"
            })
        
        # Fetch published custom pages from database
        pages = await db.pages.find({"isPublished": True}, {"slug": 1}).to_list(1000)
        for page in pages:
            urls.append({
                "loc": f"{base_url}/page/{page['slug']}",
                "priority": "0.7",
                "changefreq": "weekly"
            })
        
        # Generate XML
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        for url in urls:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{url["loc"]}</loc>\n'
            xml_content += f'    <lastmod>{today}</lastmod>\n'
            xml_content += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
            xml_content += f'    <priority>{url["priority"]}</priority>\n'
            xml_content += '  </url>\n'
        
        xml_content += '</urlset>'
        
        return Response(content=xml_content, media_type="application/xml")
    except Exception as e:
        logger.error(f"Error generating sitemap: {e}")
        # Return a basic sitemap as fallback
        fallback_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cbks77.com/</loc>
    <priority>1.0</priority>
  </url>
</urlset>'''
        return Response(content=fallback_xml, media_type="application/xml")


# Robots.txt endpoint - under /api for proper routing
@api_router.get("/robots.txt", response_class=Response)
async def get_robots():
    """Serve robots.txt"""
    robots_content = """# robots.txt for CBKS77
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://cbks77.com/api/sitemap.xml

# Disallow admin pages from indexing
Disallow: /admin
Disallow: /admin/
"""
    return Response(content=robots_content, media_type="text/plain")
