import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

const MediaGallery = ({ items = [], primaryImage = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  // Combine primary image with gallery items
  const allItems = primaryImage 
    ? [{ url: primaryImage, type: 'image' }, ...items]
    : items;

  if (allItems.length === 0) {
    return (
      <div className="aspect-square bg-zinc-900 flex items-center justify-center">
        <span className="text-gray-500">No media</span>
      </div>
    );
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allItems.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === allItems.length - 1 ? 0 : prev + 1));
  };

  const openModal = (item) => {
    setModalItem(item);
    setShowModal(true);
  };

  const currentItem = allItems[currentIndex];

  return (
    <>
      <div className="relative aspect-square overflow-hidden bg-zinc-900 group">
        {/* Main Display */}
        {currentItem.type === 'video' ? (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => openModal(currentItem)}
          >
            <video 
              src={currentItem.url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-16 h-16 text-white" fill="white" />
            </div>
          </div>
        ) : (
          <img
            src={currentItem.url}
            alt={`Gallery item ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openModal(currentItem)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
            }}
          />
        )}

        {/* Navigation Arrows - Only show if more than 1 item */}
        {allItems.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {allItems.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allItems.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-red-500 w-4' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {allItems.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {allItems.length}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showModal && modalItem && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white hover:text-red-500 z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {modalItem.type === 'video' ? (
              <video
                src={modalItem.url}
                controls
                autoPlay
                className="w-full h-full max-h-[90vh] object-contain"
              />
            ) : (
              <img
                src={modalItem.url}
                alt="Full size"
                className="w-full h-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
