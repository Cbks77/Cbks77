import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { portfolioItems, products, aboutText } from '../mock';

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay prevented:', err));
    }
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="text-red-500 font-bold tracking-widest text-sm uppercase px-4 py-2 border border-red-500 rounded-full">
              Animation & Design
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6">
            CDKS<span className="text-red-500">77</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-semibold tracking-wide">
            {aboutText.tagline}
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Graphic Designer & 3D Animator Creating Bold Visual Stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/portfolio">
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-6 rounded-none transform hover:scale-105 transition-all"
              >
                View Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg px-8 py-6 rounded-none transform hover:scale-105 transition-all"
              >
                Shop Merch
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                {aboutText.headline}
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-6">
                {aboutText.description}
              </p>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-none"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500 transform rotate-3 group-hover:rotate-6 transition-transform"></div>
              <img
                src="https://customer-assets.emergentagent.com/job_cdks-merch/artifacts/qu2u3v2q_IMG_2510.JPG"
                alt="CDKS77 Character"
                className="relative z-10 w-full transform -rotate-3 group-hover:rotate-0 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Featured Work
              </h2>
              <p className="text-gray-400 text-lg">Latest animations and designs</p>
            </div>
            <Link to="/portfolio">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-none hidden md:inline-flex"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
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

          <div className="mt-8 text-center md:hidden">
            <Link to="/portfolio">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-none"
              >
                View All Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Preview */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Shop Merch
              </h2>
              <p className="text-gray-400 text-lg">Rep the brand. Stay unbothered.</p>
            </div>
            <Link to="/shop">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-none hidden md:inline-flex"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="group bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-red-500 transition-all transform hover:scale-[1.02]"
              >
                <div className="aspect-square overflow-hidden bg-zinc-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black text-2xl">${product.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-none"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/shop">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-6 rounded-none transform hover:scale-105 transition-all"
              >
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;