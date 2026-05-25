import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminImages,
  uploadImage,
  deleteAdminImage,
  updateAdminImage,
} from '../../services/api';
import ImageUploader from '../../components/ImageUploader';
import ImageGallery from '../../components/ImageGallery';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Loader2, Filter } from 'lucide-react';

export default function AdminImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageForm, setImageForm] = useState({
    alt_text: '',
    asset_type: 'other',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminImages();
      setImages(data);
    } catch {
      setError('Failed to load images.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image.');
      return;
    }

    setUploading(true);
    try {
      await uploadImage({
        filename: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        alt_text: imageForm.alt_text,
        asset_type: imageForm.asset_type,
        // The file upload will be handled via FormData in API
      });

      setShowUpload(false);
      setSelectedFile(null);
      setImageForm({ alt_text: '', asset_type: 'other' });
      await load();
    } catch {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdminImage(deleteConfirm.id);
      setDeleteConfirm(null);
      await load();
    } catch {
      setError('Failed to delete image.');
    }
  };

  const filteredImages =
    filterType === 'all' ? images : images.filter((img) => img.asset_type === filterType);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Image Gallery</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Upload Image
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-semibold">Upload New Image</h2>

          <ImageUploader
            label="Select Image"
            onImageSelect={setSelectedFile}
            accept="image/*"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Alt Text (optional)
              </label>
              <input
                type="text"
                value={imageForm.alt_text}
                onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
                placeholder="Describe the image..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Asset Type
              </label>
              <select
                value={imageForm.asset_type}
                onChange={(e) => setImageForm({ ...imageForm, asset_type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
              >
                <option value="project">Project</option>
                <option value="team">Team Member</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              onClick={() => {
                setShowUpload(false);
                setSelectedFile(null);
                setImageForm({ alt_text: '', asset_type: 'other' });
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex items-center gap-2">
        <Filter size={18} className="text-gray-400" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 text-sm"
        >
          <option value="all">All Images ({images.length})</option>
          <option value="project">Projects ({images.filter((i) => i.asset_type === 'project').length})</option>
          <option value="team">Team ({images.filter((i) => i.asset_type === 'team').length})</option>
          <option value="service">Services ({images.filter((i) => i.asset_type === 'service').length})</option>
          <option value="other">Other ({images.filter((i) => i.asset_type === 'other').length})</option>
        </select>
      </div>

      {/* Gallery */}
      {filteredImages.length > 0 ? (
        <ImageGallery
          images={filteredImages}
          onDelete={(imageId) => {
            const img = images.find((i) => i.id === imageId);
            setDeleteConfirm(img);
          }}
          loading={loading}
        />
      ) : (
        <div className="text-center p-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400">No images in this category</p>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Image"
        message={`Are you sure you want to delete ${deleteConfirm?.filename}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
