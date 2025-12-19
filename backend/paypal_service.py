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
    
    def create_payment(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a PayPal payment
        
        Args:
            order_data: Order information including items, total, etc.
            
        Returns:
            Dictionary with payment_id and approval_url
        """
        try:
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/payment/success",
                    "cancel_url": "http://localhost:3000/payment/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": order_data.get('items', [])
                    },
                    "amount": {
                        "total": str(order_data.get('total', 0)),
                        "currency": "USD"
                    },
                    "description": f"CBKS77 Order {order_data.get('orderNumber', '')}"
                }]
            })
            
            if payment.create():
                logger.info(f"PayPal payment created: {payment.id}")
                
                # Get approval URL
                approval_url = None
                for link in payment.links:
                    if link.rel == "approval_url":
                        approval_url = link.href
                        break
                
                return {
                    "success": True,
                    "payment_id": payment.id,
                    "approval_url": approval_url
                }
            else:
                logger.error(f"PayPal payment creation failed: {payment.error}")
                return {
                    "success": False,
                    "error": payment.error
                }
                
        except Exception as e:
            logger.error(f"Error creating PayPal payment: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def execute_payment(self, payment_id: str, payer_id: str) -> Dict[str, Any]:
        """
        Execute/capture a PayPal payment
        
        Args:
            payment_id: PayPal payment ID
            payer_id: PayPal payer ID
            
        Returns:
            Dictionary with success status and transaction details
        """
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            
            if payment.execute({"payer_id": payer_id}):
                logger.info(f"PayPal payment executed: {payment_id}")
                return {
                    "success": True,
                    "payment_id": payment_id,
                    "state": payment.state,
                    "payer_email": payment.payer.payer_info.email if payment.payer else None
                }
            else:
                logger.error(f"PayPal payment execution failed: {payment.error}")
                return {
                    "success": False,
                    "error": payment.error
                }
                
        except Exception as e:
            logger.error(f"Error executing PayPal payment: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_payment_details(self, payment_id: str) -> Dict[str, Any]:
        """
        Get PayPal payment details
        
        Args:
            payment_id: PayPal payment ID
            
        Returns:
            Payment details dictionary
        """
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            return {
                "success": True,
                "payment_id": payment_id,
                "state": payment.state,
                "create_time": payment.create_time,
                "update_time": payment.update_time
            }
        except Exception as e:
            logger.error(f"Error getting PayPal payment details: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

# Initialize PayPal service
paypal_service = PayPalService()