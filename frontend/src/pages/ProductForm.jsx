import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Plus, X, GripVertical } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../hooks/use-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    images: [],
    description: '',
    sizes: 'S, M, L, XL, 2XL',
    inStock: true
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await api.getProduct(id);
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        images: product.images || [],
        description: product.description,
        sizes: product.sizes.join(', '),
        inStock: product.inStock
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (formData.images.length >= 6) {
      toast({
        title: "Limit Reached",
        description: "Maximum 6 additional images allowed (7 total including primary)",
        variant: "destructive"
      });
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        sizes: formData.sizes.split(',').map(s => s.trim())
      };

      if (isEdit) {
        await api.updateProduct(id, productData);
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully",
        });
      } else {
        await api.createProduct(productData);
        toast({
          title: "Product Created",
          description: "New product has been added successfully",
        });
      }
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} product`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/admin/dashboard">
          <Button variant="outline" className="mb-6 border-zinc-700 text-white hover:bg-zinc-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., UNBOTHERED Hoodie"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Price (£) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="65.00"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>

              {/* Primary Image */}
              <div>
                <label className="block text-white font-semibold mb-2">Primary Image URL *</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is the main image displayed for the product
                </p>
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Primary Preview"
                      className="w-32 h-32 object-cover rounded border-2 border-red-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-xs text-red-500 mt-1 block">Primary</span>
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div className="border-t border-zinc-800 pt-6">
                <label className="block text-white font-semibold mb-2">
                  Gallery Images ({formData.images.length}/6)
                </label>
                <p className="text-xs text-gray-500 mb-4">
                  Add up to 6 additional images that customers can swipe through
                </p>
                
                {/* Add new image input */}
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL here..."
                    className="bg-zinc-900 border-zinc-700 text-white flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    disabled={formData.images.length >= 6}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {/* Gallery preview grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-zinc-700"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Error'; }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                          {index + 2}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  className="bg-zinc-900 border-zinc-700 text-white"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Sizes (comma-separated) *</label>
                <Input
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL, 2XL"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="inStock" className="text-white">In Stock</label>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </Button>
                <Link to="/admin/dashboard" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-zinc-700 text-white hover:bg-zinc-900"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Upload Guide */}
        <Card className="bg-zinc-950 border-zinc-800 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Image Upload Guide</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 text-sm space-y-2">
            <p><strong className="text-white">For Images:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Imgur.com</a></li>
              <li>Right-click image → "Copy image address"</li>
              <li>Paste URL in the fields above</li>
            </ol>
            <p className="mt-4 text-yellow-500">
              <strong>Tip:</strong> Use high-quality square images for best results
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;
