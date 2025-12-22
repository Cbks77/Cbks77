import React from 'react';

// Skeleton loader for product cards
export const ProductSkeleton = () => (
  <div className="bg-zinc-950 border border-zinc-800 overflow-hidden animate-pulse">
    <div className="aspect-square bg-zinc-800"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
      <div className="h-4 bg-zinc-800 rounded w-full"></div>
      <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 bg-zinc-800 rounded w-20"></div>
        <div className="h-10 bg-zinc-800 rounded w-28"></div>
      </div>
    </div>
  </div>
);

// Skeleton loader for portfolio cards
export const PortfolioSkeleton = () => (
  <div className="bg-zinc-900 aspect-square animate-pulse">
    <div className="w-full h-full bg-zinc-800"></div>
  </div>
);

// Full page loading screen
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center">
    <div className="text-center">
      {/* Animated Logo */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-black text-white">
          CBKS<span className="text-red-500 animate-pulse">77</span>
        </h1>
      </div>
      
      {/* Loading spinner */}
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
      </div>
      
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  </div>
);

// Image with lazy loading and placeholder
export const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  placeholderColor = "bg-zinc-800",
  onError 
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = (e) => {
    setError(true);
    if (onError) onError(e);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!loaded && !error && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent skeleton-shimmer"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

// Video with lazy loading
export const LazyVideo = ({ 
  src, 
  poster,
  className = "",
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setLoaded(true));
    }
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        preload="metadata"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default { ProductSkeleton, PortfolioSkeleton, PageLoader, LazyImage, LazyVideo };
