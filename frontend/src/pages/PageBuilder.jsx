import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, Plus, X, GripVertical, Type, Image, Video, 
  LayoutGrid, Minus, Eye, Save, Trash2,
  AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BLOCK_TYPES = [
  { id: 'hero', label: 'Hero Section', icon: LayoutGrid },
  { id: 'text', label: 'Text Block', icon: Type },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'gallery', label: 'Image Gallery', icon: LayoutGrid },
  { id: 'spacer', label: 'Spacer', icon: Minus },
];

const SortableBlockEditor = ({ block, onChange, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const updateContent = (key, value) => {
    onChange({ ...block, content: { ...block.content, [key]: value } });
  };

  const updateSettings = (key, value) => {
    onChange({ ...block, settings: { ...block.settings, [key]: value } });
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-zinc-900 border ${isDragging ? 'border-red-500' : 'border-zinc-700'} rounded-lg p-4 mb-4`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-800 rounded touch-none"
          >
            <GripVertical className="h-5 w-5 text-gray-500" />
          </button>
          <span className="text-white font-semibold capitalize">{block.type} Block</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Block-specific content editors */}
      {block.type === 'hero' && (
        <div className="space-y-4">
          <Input
            value={block.content.title || ''}
            onChange={(e) => updateContent('title', e.target.value)}
            placeholder="Hero Title"
            className="bg-zinc-800 border-zinc-600 text-white text-xl font-bold"
          />
          <Input
            value={block.content.subtitle || ''}
            onChange={(e) => updateContent('subtitle', e.target.value)}
            placeholder="Subtitle text"
            className="bg-zinc-800 border-zinc-600 text-white"
          />
          <Input
            value={block.content.backgroundImage || ''}
            onChange={(e) => updateContent('backgroundImage', e.target.value)}
            placeholder="Background image URL (optional)"
            className="bg-zinc-800 border-zinc-600 text-white"
          />
          <div className="flex gap-2">
            <Input
              value={block.content.buttonText || ''}
              onChange={(e) => updateContent('buttonText', e.target.value)}
              placeholder="Button text (optional)"
              className="bg-zinc-800 border-zinc-600 text-white flex-1"
            />
            <Input
              value={block.content.buttonLink || ''}
              onChange={(e) => updateContent('buttonLink', e.target.value)}
              placeholder="Button link"
              className="bg-zinc-800 border-zinc-600 text-white flex-1"
            />
          </div>
        </div>
      )}

      {block.type === 'text' && (
        <div className="space-y-4">
          <Input
            value={block.content.heading || ''}
            onChange={(e) => updateContent('heading', e.target.value)}
            placeholder="Heading (optional)"
            className="bg-zinc-800 border-zinc-600 text-white font-bold"
          />
          <Textarea
            value={block.content.text || ''}
            onChange={(e) => updateContent('text', e.target.value)}
            placeholder="Enter your text content here..."
            className="bg-zinc-800 border-zinc-600 text-white"
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant={block.settings.align === 'left' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings('align', 'left')}
              className="border-zinc-600"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={block.settings.align === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings('align', 'center')}
              className="border-zinc-600"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={block.settings.align === 'right' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings('align', 'right')}
              className="border-zinc-600"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {block.type === 'image' && (
        <div className="space-y-4">
          <Input
            value={block.content.url || ''}
            onChange={(e) => updateContent('url', e.target.value)}
            placeholder="Image URL"
            className="bg-zinc-800 border-zinc-600 text-white"
          />
          <Input
            value={block.content.caption || ''}
            onChange={(e) => updateContent('caption', e.target.value)}
            placeholder="Image caption (optional)"
            className="bg-zinc-800 border-zinc-600 text-white"
          />
          {block.content.url && (
            <img 
              src={block.content.url} 
              alt="Preview" 
              className="w-full max-w-md rounded border border-zinc-700"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <Select 
            value={block.settings.size || 'medium'} 
            onValueChange={(value) => updateSettings('size', value)}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white w-40">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              <SelectItem value="small" className="text-white">Small</SelectItem>
              <SelectItem value="medium" className="text-white">Medium</SelectItem>
              <SelectItem value="large" className="text-white">Large</SelectItem>
              <SelectItem value="full" className="text-white">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {block.type === 'video' && (
        <div className="space-y-4">
          <Input
            value={block.content.url || ''}
            onChange={(e) => updateContent('url', e.target.value)}
            placeholder="Video URL (.mp4, .webm)"
            className="bg-zinc-800 border-zinc-600 text-white"
          />
          <Input
            value={block.content.caption || ''}
            onChange={(e) => updateContent('caption', e.target.value)}
            placeholder="Video caption (optional)"
            className="bg-zinc-800 border-zinc-600 text-white"
          />
          {block.content.url && (
            <video 
              src={block.content.url} 
              controls 
              className="w-full max-w-md rounded border border-zinc-700"
            />
          )}
        </div>
      )}

      {block.type === 'gallery' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Add up to 7 image URLs (one per line)</p>
          <Textarea
            value={(block.content.images || []).join('\n')}
            onChange={(e) => updateContent('images', e.target.value.split('\n').filter(url => url.trim()))}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="bg-zinc-800 border-zinc-600 text-white font-mono text-sm"
            rows={5}
          />
          <Select 
            value={block.settings.columns || '3'} 
            onValueChange={(value) => updateSettings('columns', value)}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white w-40">
              <SelectValue placeholder="Columns" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              <SelectItem value="2" className="text-white">2 Columns</SelectItem>
              <SelectItem value="3" className="text-white">3 Columns</SelectItem>
              <SelectItem value="4" className="text-white">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {block.type === 'spacer' && (
        <div className="space-y-4">
          <Select 
            value={block.settings.height || 'medium'} 
            onValueChange={(value) => updateSettings('height', value)}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white w-40">
              <SelectValue placeholder="Height" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-600">
              <SelectItem value="small" className="text-white">Small (24px)</SelectItem>
              <SelectItem value="medium" className="text-white">Medium (48px)</SelectItem>
              <SelectItem value="large" className="text-white">Large (96px)</SelectItem>
              <SelectItem value="xlarge" className="text-white">Extra Large (144px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const PageBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    blocks: [],
    isPublished: false,
    showInNav: false
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEdit) {
      loadPage();
    }
  }, [id]);

  const loadPage = async () => {
    try {
      const page = await api.getPage(id);
      setFormData({
        title: page.title,
        slug: page.slug,
        blocks: page.blocks || [],
        isPublished: page.isPublished,
        showInNav: page.showInNav
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load page",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title)
    });
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      content: {},
      settings: {},
      order: formData.blocks.length
    };
    setFormData({
      ...formData,
      blocks: [...formData.blocks, newBlock]
    });
  };

  const updateBlock = (index, updatedBlock) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index] = updatedBlock;
    setFormData({ ...formData, blocks: newBlocks });
  };

  const deleteBlock = (index) => {
    setFormData({
      ...formData,
      blocks: formData.blocks.filter((_, i) => i !== index)
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = formData.blocks.findIndex((block) => block.id === active.id);
      const newIndex = formData.blocks.findIndex((block) => block.id === over.id);
      
      setFormData({
        ...formData,
        blocks: arrayMove(formData.blocks, oldIndex, newIndex)
      });
      
      toast({
        title: "Block Moved",
        description: "Drag and drop successful!",
        duration: 1500
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.updatePage(id, formData);
        toast({
          title: "Page Updated",
          description: "Page has been updated successfully",
        });
      } else {
        await api.createPage(formData);
        toast({
          title: "Page Created",
          description: "New page has been created successfully",
        });
      }
      navigate('/admin/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} page`;
      toast({
        title: "Error",
        description: errorMsg,
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
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/admin/dashboard">
          <Button variant="outline" className="mb-6 border-zinc-700 text-white hover:bg-zinc-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <form onSubmit={handleSubmit}>
          {/* Page Settings */}
          <Card className="bg-zinc-950 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                {isEdit ? 'Edit Page' : 'Create New Page'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Page Title *</label>
                  <Input
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g., About Us"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">URL Slug *</label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">/page/</span>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                      placeholder="about-us"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Published (visible to visitors)
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showInNav}
                    onChange={(e) => setFormData({ ...formData, showInNav: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Show in Navigation Menu
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Add Block Toolbar */}
          <Card className="bg-zinc-950 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">Add Content Block</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {BLOCK_TYPES.map((blockType) => (
                  <Button
                    key={blockType.id}
                    type="button"
                    variant="outline"
                    onClick={() => addBlock(blockType.id)}
                    className="border-zinc-700 text-white hover:bg-zinc-800 hover:border-red-500"
                  >
                    <blockType.icon className="h-4 w-4 mr-2" />
                    {blockType.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Blocks with Drag and Drop */}
          <Card className="bg-zinc-950 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                Page Content ({formData.blocks.length} blocks)
                {formData.blocks.length > 1 && (
                  <span className="text-sm font-normal text-gray-400">
                    - Drag blocks to reorder
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No content blocks yet. Add blocks using the toolbar above.</p>
                </div>
              ) : (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={formData.blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {formData.blocks.map((block, index) => (
                      <SortableBlockEditor
                        key={block.id}
                        block={block}
                        onChange={(updated) => updateBlock(index, updated)}
                        onDelete={() => deleteBlock(index)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>

          {/* Save Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : isEdit ? 'Update Page' : 'Create Page'}
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
      </div>
    </div>
  );
};

export default PageBuilder;
