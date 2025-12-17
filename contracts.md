# CBKS77 Portfolio & Merch Site - Backend Integration Contracts

## Current State (Mock Data)
Frontend is fully functional with mock data stored in `/app/frontend/src/mock.js`:
- Portfolio items (6 items with thumbnails, videos, categories)
- Products (6 items with images, prices, sizes, descriptions)
- Social links
- About text

Shopping cart functionality works with localStorage only (client-side).

## Backend Requirements

### 1. Database Models

#### Product Model
```python
{
    "id": str (UUID),
    "name": str,
    "price": float,
    "image": str (URL),
    "description": str,
    "sizes": list[str],
    "inStock": bool,
    "createdAt": datetime,
    "updatedAt": datetime
}
```

#### Portfolio Item Model
```python
{
    "id": str (UUID),
    "title": str,
    "description": str,
    "type": str (video/image),
    "thumbnail": str (URL),
    "videoUrl": str (URL, optional),
    "category": str,
    "createdAt": datetime,
    "updatedAt": datetime
}
```

#### Contact Submission Model
```python
{
    "id": str (UUID),
    "name": str,
    "email": str,
    "subject": str,
    "message": str,
    "status": str (new/read/replied),
    "createdAt": datetime
}
```

#### Order Model (for PayPal integration)
```python
{
    "id": str (UUID),
    "orderNumber": str,
    "items": list[{
        "productId": str,
        "productName": str,
        "size": str,
        "quantity": int,
        "price": float
    }],
    "subtotal": float,
    "shipping": float,
    "total": float,
    "customerEmail": str,
    "customerName": str,
    "shippingAddress": dict,
    "paymentStatus": str (pending/completed/failed),
    "paypalOrderId": str,
    "createdAt": datetime,
    "updatedAt": datetime
}
```

### 2. API Endpoints to Implement

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (admin only - future)
- `PUT /api/products/{id}` - Update product (admin only - future)
- `DELETE /api/products/{id}` - Delete product (admin only - future)

#### Portfolio
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio/{id}` - Get single portfolio item
- `POST /api/portfolio` - Create portfolio item (admin only - future)
- `PUT /api/portfolio/{id}` - Update portfolio item (admin only - future)
- `DELETE /api/portfolio/{id}` - Delete portfolio item (admin only - future)

#### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin only - future)

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders/{id}/payment` - Process PayPal payment

### 3. Frontend Integration Changes

#### Files to Update:
1. **mock.js** - Keep as fallback, but fetch from API first
2. **Home.jsx** - Fetch portfolio items and products from API
3. **Portfolio.jsx** - Fetch portfolio items from API
4. **Shop.jsx** - Fetch products from API
5. **Contact.jsx** - Submit form to API endpoint
6. **Cart.jsx** - Create order and process payment via API

#### API Client Setup:
Create `/app/frontend/src/api/client.js`:
```javascript
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = {
  // Products
  getProducts: () => axios.get(`${API_URL}/products`),
  getProduct: (id) => axios.get(`${API_URL}/products/${id}`),
  
  // Portfolio
  getPortfolio: () => axios.get(`${API_URL}/portfolio`),
  getPortfolioItem: (id) => axios.get(`${API_URL}/portfolio/${id}`),
  
  // Contact
  submitContact: (data) => axios.post(`${API_URL}/contact`, data),
  
  // Orders
  createOrder: (data) => axios.post(`${API_URL}/orders`, data),
  getOrder: (id) => axios.get(`${API_URL}/orders/${id}`)
};
```

### 4. Data Migration Plan

#### Step 1: Seed Database
Create seed script to populate database with mock data:
- Insert 6 products from mock.js
- Insert 6 portfolio items from mock.js

#### Step 2: Update Frontend
- Add API calls with fallback to mock data if API fails
- Keep localStorage cart functionality, add order creation on checkout

#### Step 3: PayPal Integration (Phase 2)
- Add PayPal SDK to frontend
- Implement PayPal button in Cart.jsx
- Create PayPal order creation and capture endpoints
- Update order status based on payment result

### 5. Environment Variables Needed

Backend (.env):
```
MONGO_URL=<existing>
DB_NAME=<existing>
PAYPAL_CLIENT_ID=<to be provided>
PAYPAL_CLIENT_SECRET=<to be provided>
PAYPAL_MODE=sandbox # or live
```

Frontend (.env):
```
REACT_APP_BACKEND_URL=<existing>
REACT_APP_PAYPAL_CLIENT_ID=<to be provided>
```

### 6. Error Handling

Frontend should:
- Gracefully fallback to mock data if API fails
- Show loading states during API calls
- Display error messages to users via toast notifications
- Retry failed requests with exponential backoff

Backend should:
- Return consistent error format
- Log all errors
- Handle database connection failures
- Validate all input data

### 7. Testing Checklist

Backend:
- [ ] Products endpoints return correct data
- [ ] Portfolio endpoints return correct data
- [ ] Contact form submissions save to database
- [ ] Order creation works correctly
- [ ] PayPal integration works in sandbox mode

Frontend:
- [ ] Products load from API
- [ ] Portfolio items load from API
- [ ] Contact form submits successfully
- [ ] Cart checkout creates order
- [ ] PayPal payment flow works end-to-end
- [ ] Error states display correctly
- [ ] Loading states show appropriately

## Implementation Order

1. ✅ Frontend with mock data (COMPLETE)
2. 🔄 Backend models and basic CRUD endpoints (NEXT)
3. 🔄 Seed database with mock data
4. 🔄 Update frontend to use API endpoints
5. 🔄 Test all integrations
6. ⏳ PayPal integration (requires API keys from user)
7. ⏳ Full end-to-end testing

## Notes

- Mock data will remain in frontend as fallback
- PayPal integration requires user to provide API keys
- Admin features (create/update/delete) are marked for future implementation
- All API calls should be non-blocking with proper error handling
