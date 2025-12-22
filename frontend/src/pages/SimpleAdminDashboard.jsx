import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Image as ImageIcon, LogOut, Plus, Edit, Trash2, RefreshCw, AlertCircle, FileText, Settings } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../hooks/use-toast';

const SimpleAdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  // Fetch data from API on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, portfolioData, pagesData] = await Promise.all([
        api.getProducts(),
        api.getPortfolio(),
        api.getPages()
      ]);
      
      setProducts(productsData || []);
      setPortfolio(portfolioData || []);
      setPages(pagesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load data from server",
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
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setDeleting(productId);
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({ title: "Product Deleted", description: "Product has been removed successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;
    
    setDeleting(itemId);
    try {
      await api.deletePortfolioItem(itemId);
      setPortfolio(portfolio.filter(p => p.id !== itemId));
      toast({ title: "Portfolio Deleted", description: "Portfolio item has been removed successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete portfolio item", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    
    setDeleting(pageId);
    try {
      await api.deletePage(pageId);
      setPages(pages.filter(p => p.id !== pageId));
      toast({ title: "Page Deleted", description: "Page has been removed successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete page", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">{error}</p>
          <button onClick={fetchData} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon, count: portfolio.length },
    { id: 'pages', label: 'Pages', icon: FileText, count: pages.length },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-white mb-1">
                CBKS<span className="text-red-500">77</span>
              </h1>
              <p className="text-gray-400">Admin Dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchData}
                className="px-3 py-2 border border-zinc-700 text-white hover:bg-zinc-900 rounded"
                title="Refresh Data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <Link to="/">
                <button className="px-4 py-2 border border-zinc-700 text-white hover:bg-zinc-900 rounded font-semibold">
                  View Site
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded font-semibold flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-semibold">Products</h3>
              <Package className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-4xl font-black text-white">{products.length}</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-semibold">Portfolio</h3>
              <ImageIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-4xl font-black text-white">{portfolio.length}</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-semibold">Custom Pages</h3>
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-4xl font-black text-white">{pages.length}</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm font-semibold">Status</h3>
              <div className="h-5 w-5 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-black text-green-500">ACTIVE</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
              <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h2 className="text-white text-2xl font-bold">Products</h2>
                <p className="text-gray-400">Manage your merchandise • Supports up to 7 images per product</p>
              </div>
              <Link to="/admin/products/new">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Product
                </button>
              </Link>
            </div>
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-gray-400">No products yet. Add your first product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-red-500 transition-all">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded border border-zinc-700" onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }} />
                        <div>
                          <h3 className="text-white font-bold text-lg">{product.name}</h3>
                          <p className="text-red-500 font-bold">£{(product.price || 0).toFixed(2)}</p>
                          <p className="text-gray-500 text-sm">
                            {(product.images?.length || 0) + 1} images • {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <button className="border border-zinc-700 text-white hover:bg-zinc-800 px-4 py-2 rounded font-semibold flex items-center">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </button>
                        </Link>
                        <button onClick={() => handleDeleteProduct(product.id)} disabled={deleting === product.id} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded font-semibold flex items-center disabled:opacity-50">
                          <Trash2 className="h-4 w-4 mr-1" /> {deleting === product.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h2 className="text-white text-2xl font-bold">Portfolio</h2>
                <p className="text-gray-400">Manage your animation works • Supports up to 7 media items</p>
              </div>
              <Link to="/admin/portfolio/new">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Work
                </button>
              </Link>
            </div>
            <div className="p-6">
              {portfolio.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-gray-400">No portfolio items yet. Add your first work!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-red-500 transition-all">
                      <div className="flex items-center space-x-4">
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded border border-zinc-700" onError={(e) => { e.target.src = 'https://via.placeholder.com/64'; }} />
                        <div>
                          <h3 className="text-white font-bold text-lg">{item.title}</h3>
                          <p className="text-gray-400">{item.category} • {item.type}</p>
                          <p className="text-gray-500 text-sm">{(item.media?.length || 0) + 1} media items</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/admin/portfolio/edit/${item.id}`}>
                          <button className="border border-zinc-700 text-white hover:bg-zinc-800 px-4 py-2 rounded font-semibold flex items-center">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </button>
                        </Link>
                        <button onClick={() => handleDeletePortfolio(item.id)} disabled={deleting === item.id} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded font-semibold flex items-center disabled:opacity-50">
                          <Trash2 className="h-4 w-4 mr-1" /> {deleting === item.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h2 className="text-white text-2xl font-bold">Custom Pages</h2>
                <p className="text-gray-400">Build custom pages with text, images, videos and more</p>
              </div>
              <Link to="/admin/pages/new">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Page
                </button>
              </Link>
            </div>
            <div className="p-6">
              {pages.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-gray-400">No custom pages yet. Create your first page!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-red-500 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{page.title}</h3>
                          <p className="text-gray-400">/page/{page.slug}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${page.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-gray-400'}`}>
                              {page.isPublished ? 'Published' : 'Draft'}
                            </span>
                            {page.showInNav && (
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">In Nav</span>
                            )}
                            <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-gray-400">
                              {page.blocks?.length || 0} blocks
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {page.isPublished && (
                          <Link to={`/page/${page.slug}`} target="_blank">
                            <button className="border border-zinc-700 text-white hover:bg-zinc-800 px-4 py-2 rounded font-semibold">
                              View
                            </button>
                          </Link>
                        )}
                        <Link to={`/admin/pages/edit/${page.id}`}>
                          <button className="border border-zinc-700 text-white hover:bg-zinc-800 px-4 py-2 rounded font-semibold flex items-center">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </button>
                        </Link>
                        <button onClick={() => handleDeletePage(page.id)} disabled={deleting === page.id} className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded font-semibold flex items-center disabled:opacity-50">
                          <Trash2 className="h-4 w-4 mr-1" /> {deleting === page.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Guide */}
        <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white text-xl font-bold mb-4">Quick Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-400">
            <div>
              <h4 className="text-white font-semibold mb-2">📸 Adding Images</h4>
              <p className="text-sm">Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Imgur.com</a> → Copy image address → Paste URL</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">🎬 Adding Videos</h4>
              <p className="text-sm">Use direct video URLs ending in .mp4, .webm, or .mov</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">📄 Custom Pages</h4>
              <p className="text-sm">Create pages with hero sections, text, images, galleries & more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
