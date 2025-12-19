import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { api } from '../api/client';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (index, change) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += change;
    
    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  // Functions removed - now handled directly in PayPal button callbacks

  if (cartItems.length === 0) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Your Cart
          </h1>
          <p className="text-xl text-gray-400 mb-12">Your cart is empty.</p>
          <Link to="/shop">
            <Button className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-6 rounded-none">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tight">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.size}-${index}`}
                className="bg-zinc-950 border border-zinc-800 p-6 flex gap-6"
              >
                {/* Product Image */}
                <div className="w-32 h-32 flex-shrink-0 bg-zinc-900 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">Size: {item.size}</p>
                  <p className="text-white font-bold text-xl">£{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-none">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="p-2 hover:bg-zinc-800 transition-colors"
                    >
                      <Minus className="h-4 w-4 text-white" />
                    </button>
                    <span className="text-white font-bold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="p-2 hover:bg-zinc-800 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-950 border border-zinc-800 p-6 sticky top-32">
              <h2 className="text-white font-bold text-2xl mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-zinc-800">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-green-500 text-sm font-semibold">Free shipping applied!</p>
                )}
              </div>

              <div className="flex justify-between text-white font-bold text-2xl mb-6">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>

              <PayPalScriptProvider 
                options={{ 
                  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                  currency: "GBP"
                }}
              >
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "GBP",
                            value: total.toFixed(2),
                            breakdown: {
                              item_total: {
                                currency_code: "GBP",
                                value: subtotal.toFixed(2)
                              },
                              shipping: {
                                currency_code: "GBP",
                                value: shipping.toFixed(2)
                              }
                            }
                          },
                          items: cartItems.map(item => ({
                            name: item.name,
                            unit_amount: {
                              currency_code: "GBP",
                              value: item.price.toFixed(2)
                            },
                            quantity: item.quantity.toString()
                          }))
                        }
                      ]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();
                      
                      // Create order in backend after successful payment
                      const orderData = {
                        items: cartItems.map(item => ({
                          productId: item.id,
                          productName: item.name,
                          size: item.size,
                          quantity: item.quantity,
                          price: item.price
                        })),
                        subtotal: subtotal,
                        shipping: shipping,
                        total: total,
                        customerEmail: details.payer.email_address || "customer@example.com",
                        customerName: details.payer.name?.given_name + " " + details.payer.name?.surname || "Customer"
                      };

                      const order = await api.createOrder(orderData);
                      
                      // Update order with PayPal transaction ID
                      await api.capturePayment(order.id, data.orderID);
                      
                      // Clear cart
                      localStorage.removeItem('cart');
                      setCartItems([]);
                      
                      toast({
                        title: "Payment Successful!",
                        description: `Your order #${order.orderNumber} has been placed successfully.`,
                      });
                      
                      // Redirect to home
                      navigate('/');
                    } catch (error) {
                      console.error('Order creation error:', error);
                      toast({
                        title: "Order Error",
                        description: "Payment successful but order creation failed. Please contact support.",
                        variant: "destructive"
                      });
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal Error:', err);
                    toast({
                      title: "Payment Error",
                      description: "There was an error with PayPal. Please try again.",
                      variant: "destructive"
                    });
                  }}
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                  }}
                />
              </PayPalScriptProvider>

              <Link to="/shop">
                <Button
                  variant="outline"
                  className="w-full mt-4 border-2 border-zinc-700 text-white hover:bg-zinc-900 font-bold rounded-none"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;