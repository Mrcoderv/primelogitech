import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ onImageSelect, label = 'Upload Image', accept = 'image/*' }) {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageSelect?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageSelect?.(null);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : preview
            ? 'border-cyan-400 bg-gray-800'
            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              onClick={handleClear}
              className="mx-auto flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
            >
              <X size={16} />
              Clear Image
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {isDragging ? (
                <ImageIcon className="w-12 h-12 text-cyan-400" />
              ) : (
                <Upload className="w-12 h-12 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-gray-300 font-medium">Drag & drop your image here</p>
              <p className="text-gray-500 text-sm">or click to browse</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
