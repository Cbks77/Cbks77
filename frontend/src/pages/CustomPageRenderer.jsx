import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../api/client';
import MediaGallery from '../components/MediaGallery';

const CustomPageRenderer = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pageData = await api.getPageBySlug(slug);
        if (!pageData.isPublished) {
          setError('This page is not published');
        } else {
          setPage(pageData);
        }
      } catch (err) {
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div 
            key={block.id}
            className="relative min-h-[60vh] flex items-center justify-center text-center"
            style={{
              backgroundImage: block.content.backgroundImage ? `url(${block.content.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {block.content.backgroundImage && (
              <div className="absolute inset-0 bg-black/60" />
            )}
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              {block.content.title && (
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                  {block.content.title}
                </h1>
              )}
              {block.content.subtitle && (
                <p className="text-xl md:text-2xl text-gray-300 mb-8">
                  {block.content.subtitle}
                </p>
              )}
              {block.content.buttonText && block.content.buttonLink && (
                <a 
                  href={block.content.buttonLink}
                  className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg"
                >
                  {block.content.buttonText}
                </a>
              )}
            </div>
          </div>
        );

      case 'text':
        const alignClass = {
          left: 'text-left',
          center: 'text-center',
          right: 'text-right'
        }[block.settings.align] || 'text-left';

        return (
          <div key={block.id} className={`max-w-4xl mx-auto px-4 py-12 ${alignClass}`}>
            {block.content.heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {block.content.heading}
              </h2>
            )}
            {block.content.text && (
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {block.content.text}
              </div>
            )}
          </div>
        );

      case 'image':
        const sizeClass = {
          small: 'max-w-md',
          medium: 'max-w-2xl',
          large: 'max-w-4xl',
          full: 'max-w-full'
        }[block.settings.size] || 'max-w-2xl';

        return (
          <div key={block.id} className={`mx-auto px-4 py-8 ${sizeClass}`}>
            <img
              src={block.content.url}
              alt={block.content.caption || 'Image'}
              className="w-full rounded-lg"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; }}
            />
            {block.content.caption && (
              <p className="text-gray-400 text-center mt-4">{block.content.caption}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div key={block.id} className="max-w-4xl mx-auto px-4 py-8">
            <video
              src={block.content.url}
              controls
              className="w-full rounded-lg"
            />
            {block.content.caption && (
              <p className="text-gray-400 text-center mt-4">{block.content.caption}</p>
            )}
          </div>
        );

      case 'gallery':
        const columns = parseInt(block.settings.columns) || 3;
        const images = block.content.images || [];
        
        return (
          <div key={block.id} className="max-w-6xl mx-auto px-4 py-8">
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
              {images.map((url, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'spacer':
        const heightClass = {
          small: 'h-6',
          medium: 'h-12',
          large: 'h-24',
          xlarge: 'h-36'
        }[block.settings.height] || 'h-12';

        return <div key={block.id} className={heightClass} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {page.blocks && page.blocks.map(renderBlock)}
    </div>
  );
};

export default CustomPageRenderer;
