import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Image as ImageIcon, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { products as mockProducts, portfolioItems as mockPortfolio } from '../mock';

const SimpleAdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [products] = useState(mockProducts);
  const [portfolio] = useState(mockPortfolio);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    onLogout(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-black text-white mb-2">
                CBKS<span className="text-red-500">77</span>
              </h1>
              <p className="text-gray-400 text-lg">Admin Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <button className="px-6 py-3 border-2 border-zinc-700 text-white hover:bg-zinc-900 rounded font-semibold">
                  View Site
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded font-semibold flex items-center"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">Products</h3>
              <Package className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-5xl font-black text-white mb-2">{products.length}</div>
            <p className="text-gray-400 text-lg">Shop items</p>
          </div>

          <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">Portfolio</h3>
              <ImageIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-5xl font-black text-white mb-2">{portfolio.length}</div>
            <p className="text-gray-400 text-lg">Animation works</p>
          </div>

          <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">Status</h3>
              <div className="h-8 w-8 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-3xl font-black text-green-500 mb-2">ACTIVE</div>
            <p className="text-gray-400 text-lg">Site is live</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl mb-16 overflow-hidden">
          <div className="p-8 border-b-2 border-zinc-800 bg-zinc-900">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-white text-4xl font-black mb-2">Products</h2>
                <p className="text-gray-400 text-lg">Manage your merchandise</p>
              </div>
              <Link to="/admin/products/new">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-lg text-lg flex items-center">
                  <Plus className="mr-2 h-6 w-6" />
                  Add Product
                </button>
              </Link>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-8 bg-zinc-900 border-2 border-zinc-800 rounded-xl hover:border-red-500 transition-all"
                >
                  <div className="flex items-center space-x-8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-zinc-700"
                    />
                    <div>
                      <h3 className="text-white font-bold text-2xl mb-2">{product.name}</h3>
                      <p className="text-red-500 text-xl font-bold">£{product.price.toFixed(2)}</p>
                      <p className="text-gray-400 text-base mt-2">{product.inStock ? '✓ In Stock' : '✗ Out of Stock'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <button className="border-2 border-zinc-700 text-white hover:bg-zinc-800 px-6 py-3 rounded-lg font-bold flex items-center">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit
                      </button>
                    </Link>
                    <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-lg font-bold flex items-center">
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-8 border-b-2 border-zinc-800 bg-zinc-900">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-white text-4xl font-black mb-2">Portfolio</h2>
                <p className="text-gray-400 text-lg">Manage your animation works</p>
              </div>
              <Link to="/admin/portfolio/new">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-lg text-lg flex items-center">
                  <Plus className="mr-2 h-6 w-6" />
                  Add Work
                </button>
              </Link>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-8 bg-zinc-900 border-2 border-zinc-800 rounded-xl hover:border-red-500 transition-all"
                >
                  <div className="flex items-center space-x-8">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-zinc-700"
                    />
                    <div>
                      <h3 className="text-white font-bold text-2xl mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-lg">{item.category} • {item.type}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Link to={`/admin/portfolio/edit/${item.id}`}>
                      <button className="border-2 border-zinc-700 text-white hover:bg-zinc-800 px-6 py-3 rounded-lg font-bold flex items-center">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit
                      </button>
                    </Link>
                    <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-lg font-bold flex items-center">
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="mt-16 bg-zinc-950 border-2 border-zinc-800 rounded-xl p-8">
          <h3 className="text-white text-2xl font-bold mb-4">How to Upload Content</h3>
          <div className="space-y-4 text-gray-400 text-lg">
            <p><strong className="text-white">For Images:</strong> Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Imgur.com</a> → Copy image address → Paste in admin form</p>
            <p><strong className="text-white">For Videos:</strong> Use your existing video URLs or upload to file host → Paste URL in admin form</p>
            <p><strong className="text-white">Password:</strong> cbks77admin2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;