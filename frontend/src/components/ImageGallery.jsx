import { Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ImageGallery({ images, onDelete, loading = false }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group relative bg-gray-800 rounded-lg overflow-hidden">
          {/* Image preview */}
          <div className="aspect-square bg-gray-900 overflow-hidden">
            <img
              src={image.url}
              alt={image.filename}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => copyToClipboard(image.url, image.id)}
              title="Copy URL"
              className="p-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors"
            >
              {copied === image.id ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(image.id)}
                title="Delete"
                className="p-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Filename tooltip */}
          <div className="p-2 bg-gray-900 text-xs text-gray-400 truncate">
            {image.filename}
          </div>
        </div>
      ))}
    </div>
  );
}
