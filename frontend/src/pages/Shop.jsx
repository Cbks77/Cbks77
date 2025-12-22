import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { ProductSkeleton, LazyImage } from '../components/LoadingComponents';
import MediaGallery from '../components/MediaGallery';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const Shop = ({ onAddToCart }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const sizes = product.sizes || ['One Size'];
    const selectedSize = selectedSizes[product.id] || sizes[0];
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
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
            Official CBKS77 merchandise. Rep the brand, stay unbothered.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton loaders
            [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            products.map((product) => {
              const sizes = product.sizes || ['One Size'];
              const currentSize = selectedSizes[product.id] || sizes[0];
              
              // Prepare gallery items from product.images
              const galleryItems = (product.images || []).map(url => ({ url, type: 'image' }));
              
              return (
                <div
                  key={product.id}
                  className="group bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-red-500 transition-all"
                >
                  {/* Product Image Gallery */}
                  <MediaGallery 
                    items={galleryItems}
                    primaryImage={product.image}
                  />

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
                        value={currentSize}
                        onValueChange={(value) => handleSizeChange(product.id, value)}
                      >
                        <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                          {sizes.map((size) => (
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
                        £{(product.price || 0).toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.inStock === false}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-none disabled:bg-zinc-700 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No products available yet.</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-16 bg-zinc-950 border border-zinc-800 p-8 text-center">
          <h3 className="text-white font-bold text-2xl mb-4">Free Shipping on Orders Over £100</h3>
          <p className="text-gray-400">
            All orders ship within 3-5 business days. Questions? Contact us at hello@cbks77.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shop;
