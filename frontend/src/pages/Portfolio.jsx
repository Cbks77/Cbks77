import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { api } from '../api/client';
import { PortfolioSkeleton, LazyImage } from '../components/LoadingComponents';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch portfolio from API
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await api.getPortfolio();
        setPortfolioItems(data || []);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const categories = ['All', ...new Set(portfolioItems.map(item => item.category))];
  const filteredItems = filter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Portfolio
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            A collection of animations, character designs, and creative projects that push boundaries and tell stories.
          </p>
        </div>

        {/* Filter Tabs */}
        {!loading && (
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all ${
                  filter === category
                    ? 'bg-red-500 text-white'
                    : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loaders
            [...Array(6)].map((_, i) => <PortfolioSkeleton key={i} />)
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden bg-zinc-900 aspect-square cursor-pointer"
                onClick={() => openModal(item)}
              >
                <LazyImage
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-red-500 rounded-full p-4 animate-pulse">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No portfolio items found.</p>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-red-500 z-50"
          >
            <X className="h-10 w-10" />
          </button>
          <div 
            className="w-full max-w-6xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.type === 'video' && selectedItem.videoUrl ? (
              <video
                controls
                autoPlay
                className="w-full rounded-lg"
                poster={selectedItem.thumbnail}
                preload="auto"
              >
                <source src={selectedItem.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedItem.thumbnail}
                alt={selectedItem.title}
                className="w-full rounded-lg"
                loading="eager"
              />
            )}
            
            {/* Gallery of additional media if available */}
            {selectedItem.media && selectedItem.media.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {selectedItem.media.map((mediaItem, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded">
                    {mediaItem.type === 'video' ? (
                      <video src={mediaItem.url} className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <img 
                        src={mediaItem.url} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase mb-2">
                {selectedItem.category}
              </span>
              <h3 className="text-white text-2xl font-bold">{selectedItem.title}</h3>
              <p className="text-gray-400 mt-2">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
