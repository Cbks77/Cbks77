import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Plus, X, Image, Video } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../hooks/use-toast';

const PortfolioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    thumbnail: '',
    videoUrl: '',
    media: [],
    category: 'Animation'
  });
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadPortfolioItem();
    }
  }, [id]);

  const loadPortfolioItem = async () => {
    try {
      const item = await api.getPortfolioItem(id);
      setFormData({
        title: item.title,
        description: item.description,
        type: item.type,
        thumbnail: item.thumbnail,
        videoUrl: item.videoUrl || '',
        media: item.media || [],
        category: item.category
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio item",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    if (formData.media.length >= 6) {
      toast({
        title: "Limit Reached",
        description: "Maximum 6 additional media items allowed (7 total including primary)",
        variant: "destructive"
      });
      return;
    }
    setFormData({
      ...formData,
      media: [...formData.media, { url: newMediaUrl.trim(), type: newMediaType }]
    });
    setNewMediaUrl('');
  };

  const handleRemoveMedia = (index) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const portfolioData = {
        ...formData,
        videoUrl: formData.type === 'video' ? formData.videoUrl : null
      };

      if (isEdit) {
        await api.updatePortfolioItem(id, portfolioData);
        toast({
          title: "Portfolio Updated",
          description: "Portfolio item has been updated successfully",
        });
      } else {
        await api.createPortfolioItem(portfolioData);
        toast({
          title: "Portfolio Created",
          description: "New portfolio item has been added successfully",
        });
      }
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} portfolio item`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/admin/dashboard">
          <Button variant="outline" className="mb-6 border-zinc-700 text-white hover:bg-zinc-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {isEdit ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Hero 77 Character Animation"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your work..."
                  className="bg-zinc-900 border-zinc-700 text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Primary Type *</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="video" className="text-white">Video</SelectItem>
                      <SelectItem value="image" className="text-white">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="Animation" className="text-white">Animation</SelectItem>
                      <SelectItem value="Character Design" className="text-white">Character Design</SelectItem>
                      <SelectItem value="3D Art" className="text-white">3D Art</SelectItem>
                      <SelectItem value="Motion Graphics" className="text-white">Motion Graphics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Thumbnail Image URL *</label>
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
                {formData.thumbnail && (
                  <div className="mt-3">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded border-2 border-red-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-xs text-red-500 mt-1 block">Thumbnail</span>
                  </div>
                )}
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-white font-semibold mb-2">Primary Video URL *</label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required={formData.type === 'video'}
                  />
                  {formData.videoUrl && (
                    <div className="mt-3">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full max-w-md rounded border border-zinc-700"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Gallery Media Section */}
              <div className="border-t border-zinc-800 pt-6">
                <label className="block text-white font-semibold mb-2">
                  Gallery Media ({formData.media.length}/6)
                </label>
                <p className="text-xs text-gray-500 mb-4">
                  Add up to 6 additional images or videos that visitors can swipe through
                </p>
                
                {/* Add new media input */}
                <div className="flex gap-2 mb-4">
                  <Select value={newMediaType} onValueChange={setNewMediaType}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="image" className="text-white">
                        <div className="flex items-center">
                          <Image className="h-4 w-4 mr-1" /> Image
                        </div>
                      </SelectItem>
                      <SelectItem value="video" className="text-white">
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-1" /> Video
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="Paste URL here..."
                    className="bg-zinc-900 border-zinc-700 text-white flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={formData.media.length >= 6}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {/* Gallery preview grid */}
                {formData.media.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.media.map((item, index) => (
                      <div key={index} className="relative group">
                        {item.type === 'video' ? (
                          <div className="w-full h-24 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                            <Video className="h-8 w-8 text-red-500" />
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded border border-zinc-700"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Error'; }}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded flex items-center gap-1">
                          {item.type === 'video' ? <Video className="h-3 w-3" /> : <Image className="h-3 w-3" />}
                          {index + 2}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Portfolio' : 'Create Portfolio'}
                </Button>
                <Link to="/admin/dashboard" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-zinc-700 text-white hover:bg-zinc-900"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Upload Guide */}
        <Card className="bg-zinc-950 border-zinc-800 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Upload Guide</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 text-sm space-y-4">
            <div>
              <p><strong className="text-white">For Images/Thumbnails:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Imgur.com</a></li>
                <li>Right-click image → "Copy image address"</li>
                <li>Paste URL in the field above</li>
              </ol>
            </div>
            <div>
              <p><strong className="text-white">For Videos:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Upload to your Emergent assets or external hosting</li>
                <li>Copy the direct video URL (must end in .mp4, .mov, etc.)</li>
                <li>Paste URL in the video field</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioForm;
