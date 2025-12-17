"""
Seed script to populate MongoDB with initial data for CBKS77 site
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from models import Product, PortfolioItem
from seed_data import products, portfolio_items

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    """Seed the database with initial products and portfolio items"""
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    print("Clearing existing data...")
    await db.products.delete_many({})
    await db.portfolio.delete_many({})
    
    # Seed products
    print(f"Seeding {len(products)} products...")
    product_objects = [Product(**product) for product in products]
    await db.products.insert_many([p.model_dump() for p in product_objects])
    print(f"✅ Seeded {len(products)} products")
    
    # Seed portfolio items
    print(f"Seeding {len(portfolio_items)} portfolio items...")
    portfolio_objects = [PortfolioItem(**item) for item in portfolio_items]
    await db.portfolio.insert_many([p.model_dump() for p in portfolio_objects])
    print(f"✅ Seeded {len(portfolio_items)} portfolio items")
    
    print("✨ Database seeding complete!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
