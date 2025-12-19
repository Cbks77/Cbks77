import os
import requests
import base64
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class PayPalService:
    def __init__(self):
        self.client_id = os.environ.get('PAYPAL_CLIENT_ID')
        self.client_secret = os.environ.get('PAYPAL_CLIENT_SECRET')
        self.mode = os.environ.get('PAYPAL_MODE', 'sandbox')
        
        # Set API base URL based on mode
        if self.mode == 'live':
            self.base_url = 'https://api.paypal.com'
        else:
            self.base_url = 'https://api.sandbox.paypal.com'
        
        logger.info(f"PayPal Service initialized in {self.mode} mode")
    
    def get_access_token(self) -> str:
        """Get PayPal OAuth access token"""
        try:
            url = f"{self.base_url}/v1/oauth2/token"
            
            # Create basic auth header
            credentials = f"{self.client_id}:{self.client_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            
            data = {"grant_type": "client_credentials"}
            
            response = requests.post(url, headers=headers, data=data)
            response.raise_for_status()
            
            return response.json()['access_token']
        except Exception as e:
            logger.error(f"Error getting access token: {str(e)}")
            raise
    
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a PayPal order (v2 API)
        
        Args:
            order_data: Order information including items, total, etc.
            
        Returns:
            Dictionary with order_id
        """
        try:
            access_token = self.get_access_token()
            url = f"{self.base_url}/v2/checkout/orders"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
            
            # Prepare purchase units
            items = []
            for item in order_data.get('items', []):
                items.append({
                    "name": item.get('name', 'Product'),
                    "quantity": str(item.get('quantity', 1)),
                    "unit_amount": {
                        "currency_code": "USD",
                        "value": f"{float(item.get('price', 0)):.2f}"
                    }
                })
            
            payload = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "reference_id": order_data.get('orderNumber', 'ORDER'),
                    "description": f"CBKS77 Order {order_data.get('orderNumber', '')}",
                    "amount": {
                        "currency_code": "USD",
                        "value": f"{float(order_data.get('total', 0)):.2f}",
                        "breakdown": {
                            "item_total": {
                                "currency_code": "USD",
                                "value": f"{float(order_data.get('total', 0)):.2f}"
                            }
                        }
                    },
                    "items": items
                }]
            }
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"PayPal order created: {result['id']}")
            
            return {
                "success": True,
                "order_id": result['id']
            }
                
        except Exception as e:
            logger.error(f"Error creating PayPal order: {str(e)}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Response: {e.response.text}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def capture_order(self, order_id: str) -> Dict[str, Any]:
        """
        Capture/complete a PayPal order
        
        Args:
            order_id: PayPal order ID
            
        Returns:
            Dictionary with success status and transaction details
        """
        try:
            access_token = self.get_access_token()
            url = f"{self.base_url}/v2/checkout/orders/{order_id}/capture"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
            
            response = requests.post(url, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"PayPal order captured: {order_id}")
            
            return {
                "success": True,
                "order_id": order_id,
                "status": result.get('status'),
                "payer_email": result.get('payer', {}).get('email_address')
            }
                
        except Exception as e:
            logger.error(f"Error capturing PayPal order: {str(e)}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Response: {e.response.text}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_order_details(self, order_id: str) -> Dict[str, Any]:
        """
        Get PayPal order details
        
        Args:
            order_id: PayPal order ID
            
        Returns:
            Order details dictionary
        """
        try:
            access_token = self.get_access_token()
            url = f"{self.base_url}/v2/checkout/orders/{order_id}"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            return {
                "success": True,
                "order_id": order_id,
                "status": result.get('status'),
                "create_time": result.get('create_time'),
                "update_time": result.get('update_time')
            }
        except Exception as e:
            logger.error(f"Error getting PayPal order details: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

# Initialize PayPal service
paypal_service = PayPalService()