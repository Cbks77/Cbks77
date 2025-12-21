import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
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
    description: '',
    sizes: 'S, M, L, XL, 2XL',
    inStock: true
  });
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
      <div className="max-w-3xl mx-auto px-4">
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

              <div>
                <label className="block text-white font-semibold mb-2">Image URL *</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload your image to Imgur, Cloudinary, or any image host and paste the URL here
                </p>
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded border border-zinc-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
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
      </div>
    </div>
  );
};

export default ProductForm;