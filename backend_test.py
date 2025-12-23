#!/usr/bin/env python3
"""
Backend API Testing for CBKS77 Website
Tests the new Dynamic Sitemap endpoint and other backend functionality
"""

import requests
import json
import xml.etree.ElementTree as ET
from urllib.parse import urljoin
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get the backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://merch-gallery-1.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

def test_dynamic_sitemap():
    """Test the new dynamic sitemap endpoint"""
    print("\n=== Testing Dynamic Sitemap Endpoint ===")
    
    try:
        # Test sitemap endpoint
        sitemap_url = f"{API_BASE}/sitemap.xml"
        print(f"Testing: {sitemap_url}")
        
        response = requests.get(sitemap_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
        
        # Verify content type
        content_type = response.headers.get('content-type', '')
        print(f"Content-Type: {content_type}")
        
        if 'xml' not in content_type.lower():
            print(f"❌ WARNING: Expected XML content type, got {content_type}")
        
        # Parse XML to verify it's valid
        try:
            root = ET.fromstring(response.text)
            print(f"✅ Valid XML structure")
            
            # Check XML namespace
            if root.tag != '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset':
                print(f"❌ WARNING: Unexpected root tag: {root.tag}")
            
            # Count URLs and categorize them
            urls = root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url')
            print(f"Total URLs found: {len(urls)}")
            
            static_pages = []
            product_pages = []
            portfolio_pages = []
            custom_pages = []
            
            for url in urls:
                loc = url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text
                
                if loc.endswith('/'):
                    static_pages.append(loc)
                elif '/shop/' in loc:
                    product_pages.append(loc)
                elif '/portfolio/' in loc:
                    portfolio_pages.append(loc)
                elif '/page/' in loc:
                    custom_pages.append(loc)
                else:
                    static_pages.append(loc)
            
            print(f"Static pages: {len(static_pages)}")
            print(f"Product pages: {len(product_pages)}")
            print(f"Portfolio pages: {len(portfolio_pages)}")
            print(f"Custom pages: {len(custom_pages)}")
            
            # Verify expected counts
            expected_products = 7
            expected_portfolio = 6
            
            if len(product_pages) == expected_products:
                print(f"✅ Product count correct: {len(product_pages)}")
            else:
                print(f"❌ Product count mismatch: expected {expected_products}, got {len(product_pages)}")
            
            if len(portfolio_pages) == expected_portfolio:
                print(f"✅ Portfolio count correct: {len(portfolio_pages)}")
            else:
                print(f"❌ Portfolio count mismatch: expected {expected_portfolio}, got {len(portfolio_pages)}")
            
            # Verify required static pages
            required_static = [
                f"https://cbks77.com/",
                f"https://cbks77.com/shop",
                f"https://cbks77.com/portfolio", 
                f"https://cbks77.com/contact"
            ]
            
            missing_static = []
            for required in required_static:
                if not any(required in page for page in static_pages):
                    missing_static.append(required)
            
            if not missing_static:
                print(f"✅ All required static pages present")
            else:
                print(f"❌ Missing static pages: {missing_static}")
            
            # Show sample URLs
            print("\nSample URLs from sitemap:")
            for i, url in enumerate(urls[:5]):
                loc = url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text
                priority = url.find('{http://www.sitemaps.org/schemas/sitemap/0.9}priority')
                priority_val = priority.text if priority is not None else "N/A"
                print(f"  {i+1}. {loc} (priority: {priority_val})")
            
            return True
            
        except ET.ParseError as e:
            print(f"❌ FAILED: Invalid XML - {e}")
            print(f"Response content: {response.text[:500]}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ FAILED: Request error - {e}")
        return False
    except Exception as e:
        print(f"❌ FAILED: Unexpected error - {e}")
        return False

def test_products_api():
    """Test products API to verify data for sitemap"""
    print("\n=== Testing Products API (for sitemap verification) ===")
    
    try:
        products_url = f"{API_BASE}/products"
        print(f"Testing: {products_url}")
        
        response = requests.get(products_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        products = response.json()
        print(f"Products found: {len(products)}")
        
        if len(products) == 7:
            print(f"✅ Expected product count (7) matches")
        else:
            print(f"❌ Product count mismatch: expected 7, got {len(products)}")
        
        # Show sample products
        if products:
            print("Sample products:")
            for i, product in enumerate(products[:3]):
                print(f"  {i+1}. {product.get('name', 'N/A')} (ID: {product.get('id', 'N/A')})")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False

def test_portfolio_api():
    """Test portfolio API to verify data for sitemap"""
    print("\n=== Testing Portfolio API (for sitemap verification) ===")
    
    try:
        portfolio_url = f"{API_BASE}/portfolio"
        print(f"Testing: {portfolio_url}")
        
        response = requests.get(portfolio_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        portfolio = response.json()
        print(f"Portfolio items found: {len(portfolio)}")
        
        if len(portfolio) == 6:
            print(f"✅ Expected portfolio count (6) matches")
        else:
            print(f"❌ Portfolio count mismatch: expected 6, got {len(portfolio)}")
        
        # Show sample portfolio items
        if portfolio:
            print("Sample portfolio items:")
            for i, item in enumerate(portfolio[:3]):
                print(f"  {i+1}. {item.get('title', 'N/A')} (ID: {item.get('id', 'N/A')})")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False

def test_custom_pages_api():
    """Test custom pages API to verify published pages for sitemap"""
    print("\n=== Testing Custom Pages API (for sitemap verification) ===")
    
    try:
        pages_url = f"{API_BASE}/pages/published"
        print(f"Testing: {pages_url}")
        
        response = requests.get(pages_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            return False
        
        pages = response.json()
        print(f"Published pages found: {len(pages)}")
        
        # Show published pages
        if pages:
            print("Published custom pages:")
            for i, page in enumerate(pages):
                print(f"  {i+1}. {page.get('title', 'N/A')} (slug: {page.get('slug', 'N/A')})")
        else:
            print("No published custom pages found")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting CBKS77 Backend API Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    
    results = []
    
    # Test supporting APIs first
    results.append(("Products API", test_products_api()))
    results.append(("Portfolio API", test_portfolio_api()))
    results.append(("Custom Pages API", test_custom_pages_api()))
    
    # Test main feature - Dynamic Sitemap
    results.append(("Dynamic Sitemap", test_dynamic_sitemap()))
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All backend tests passed!")
        return True
    else:
        print("⚠️  Some backend tests failed!")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)