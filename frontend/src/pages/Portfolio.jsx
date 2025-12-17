import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { portfolioItems } from '../mock';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(portfolioItems.map(item => item.category))];
  const filteredItems = filter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Portfolio
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            A collection of animation work, character designs, and visual storytelling projects.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all transform hover:scale-105 ${
                filter === category
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative overflow-hidden bg-zinc-900 aspect-square cursor-pointer transform hover:scale-[1.02] transition-all"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    <div className="bg-red-500 rounded-full p-4">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for viewing work */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.type === 'video' ? (
                <video
                  controls
                  className="w-full rounded-lg"
                  poster={selectedItem.thumbnail}
                >
                  <source src={selectedItem.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />
              )}
              <div>
                <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase mb-3">
                  {selectedItem.category}
                </span>
                <p className="text-gray-400">{selectedItem.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;