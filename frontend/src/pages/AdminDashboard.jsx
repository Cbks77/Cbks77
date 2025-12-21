import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Package, Image, MessageSquare, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading dashboard data...');
      
      // Try to load products
      try {
        const productsData = await api.getProducts();
        console.log('Products loaded:', productsData);
        setProducts(productsData || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      }
      
      // Try to load portfolio
      try {
        const portfolioData = await api.getPortfolio();
        console.log('Portfolio loaded:', portfolioData);
        setPortfolio(portfolioData || []);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
        setPortfolio([]);
      }
      
      // Try to load contacts
      try {
        const contactsData = await api.getContacts();
        console.log('Contacts loaded:', contactsData);
        setContacts(contactsData || []);
      } catch (err) {
        console.error('Failed to load contacts:', err);
        setContacts([]);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load some data. You can still add new items.');
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-white text-2xl mb-4">Loading dashboard...</div>
        <div className="text-gray-400">Please wait</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-white mb-1">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Products</h3>
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">{products.length}</div>
            <p className="text-sm text-gray-400">Total products in shop</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Portfolio Items</h3>
              <Image className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">{portfolio.length}</div>
            <p className="text-sm text-gray-400">Animation works</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Messages</h3>
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">{contacts.length}</div>
            <p className="text-sm text-gray-400">Contact submissions</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg mb-12">
          <div className="p-8 border-b border-zinc-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-white text-3xl font-bold mb-2">Products</h2>
                <p className="text-gray-400">Manage your shop products</p>
              </div>
              <Link to="/admin/products/new">
                <Button className="bg-red-500 hover:bg-red-600 text-white font-bold h-12 px-6">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-8">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">No Products Yet</h3>
                <p className="text-gray-400 mb-6">Start by adding your first product</p>
                <Link to="/admin/products/new">
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center space-x-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                      />
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-gray-400 text-base">£{product.price.toFixed(2)}</p>
                        <p className="text-gray-500 text-sm mt-1">{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 h-10 px-4">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-10 px-4"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg">
          <div className="p-8 border-b border-zinc-800">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-white text-3xl font-bold mb-2">Portfolio</h2>
                <p className="text-gray-400">Manage your animation works</p>
              </div>
              <Link to="/admin/portfolio/new">
                <Button className="bg-red-500 hover:bg-red-600 text-white font-bold h-12 px-6">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Work
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-base">{item.category} • {item.type}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Link to={`/admin/portfolio/edit/${item.id}`}>
                      <Button size="sm" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 h-10 px-4">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-10 px-4"
                      onClick={() => deletePortfolioItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;