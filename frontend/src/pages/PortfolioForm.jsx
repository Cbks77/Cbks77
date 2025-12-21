import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
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
    category: 'Animation'
  });
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
      <div className="max-w-3xl mx-auto px-4">
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

              <div>
                <label className="block text-white font-semibold mb-2">Type *</label>
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

              <div>
                <label className="block text-white font-semibold mb-2">Thumbnail Image URL *</label>
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload thumbnail to Imgur/Cloudinary and paste URL
                </p>
                {formData.thumbnail && (
                  <div className="mt-4">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-48 h-48 object-cover rounded border border-zinc-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-white font-semibold mb-2">Video URL *</label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required={formData.type === 'video'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload video to a hosting service and paste the direct video URL (must end in .mp4, .mov, etc.)
                  </p>
                  {formData.videoUrl && (
                    <div className="mt-4">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full max-w-md rounded border border-zinc-700"
                      />
                    </div>
                  )}
                </div>
              )}

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

        {/* Quick Upload Guide */}
        <Card className="bg-zinc-950 border-zinc-800 mt-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Upload Guide</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400 text-sm space-y-2">
            <p><strong className="text-white">For Images/Thumbnails:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Imgur.com</a></li>
              <li>Right-click image → "Copy image address"</li>
              <li>Paste URL in the field above</li>
            </ol>
            <p className="mt-4"><strong className="text-white">For Videos:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Upload to your Emergent assets or external hosting</li>
              <li>Copy the direct video URL (must end in .mp4, .mov, etc.)</li>
              <li>Paste URL in the video field</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioForm;