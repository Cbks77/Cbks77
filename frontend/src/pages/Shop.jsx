import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { products } from '../mock';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const Shop = ({ onAddToCart }) => {
  const { toast } = useToast();
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id] || product.sizes[0];
    
    // Mock cart functionality
    const cartItem = {
      ...product,
      size: selectedSize,
      quantity: 1
    };

    // Store in localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    if (onAddToCart) {
      onAddToCart(cartItem);
    }

    toast({
      title: "Added to Cart!",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Shop
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Official CDKS77 merchandise. Rep the brand, stay unbothered.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-red-500 transition-all"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-zinc-900 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">OUT OF STOCK</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                    Size
                  </label>
                  <Select
                    value={selectedSizes[product.id] || product.sizes[0]}
                    onValueChange={(value) =>
                      setSelectedSizes({ ...selectedSizes, [product.id]: value })
                    }
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      {product.sizes.map((size) => (
                        <SelectItem
                          key={size}
                          value={size}
                          className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <span className="text-white font-black text-2xl">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-none disabled:bg-zinc-700 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-zinc-950 border border-zinc-800 p-8 text-center">
          <h3 className="text-white font-bold text-2xl mb-4">Free Shipping on Orders Over $100</h3>
          <p className="text-gray-400">
            All orders ship within 3-5 business days. Questions? Contact us at hello@cdks77.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shop;