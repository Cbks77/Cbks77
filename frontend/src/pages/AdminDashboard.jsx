import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Package, Image, MessageSquare, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, portfolioData, contactsData] = await Promise.all([
        api.getProducts(),
        api.getPortfolio(),
        api.getContacts()
      ]);
      setProducts(productsData);
      setPortfolio(portfolioData);
      setContacts(contactsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    onLogout(false);
    navigate('/admin');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        toast({
          title: "Product Deleted",
          description: "Product has been removed successfully",
        });
        loadData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  };

  const deletePortfolioItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await api.deletePortfolioItem(id);
        toast({
          title: "Portfolio Item Deleted",
          description: "Portfolio item has been removed successfully",
        });
        loadData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete portfolio item",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-white">
                CBKS<span className="text-red-500">77</span>
              </h1>
              <p className="text-gray-400 text-sm">Admin Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900">
                  View Site
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{products.length}</div>
              <p className="text-xs text-gray-400 mt-1">Total products in shop</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm font-medium">Portfolio Items</CardTitle>
              <Image className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{portfolio.length}</div>
              <p className="text-xs text-gray-400 mt-1">Animation works</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-white text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{contacts.length}</div>
              <p className="text-xs text-gray-400 mt-1">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="bg-zinc-950 border-zinc-800 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-2xl">Products</CardTitle>
                <CardDescription className="text-gray-400">Manage your shop products</CardDescription>
              </div>
              <Link to="/admin/products/new">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{product.name}</h3>
                      <p className="text-gray-400 text-sm">£{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <Button size="sm" variant="outline" className="border-zinc-700 text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-2xl">Portfolio</CardTitle>
                <CardDescription className="text-gray-400">Manage your animation works</CardDescription>
              </div>
              <Link to="/admin/portfolio/new">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Work
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.category} • {item.type}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/admin/portfolio/edit/${item.id}`}>
                      <Button size="sm" variant="outline" className="border-zinc-700 text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => deletePortfolioItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;