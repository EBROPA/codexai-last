/**
 * ImageUploader Component
 * Reusable component for uploading images to the server
 * Supports file selection, drag-and-drop, and clipboard paste
 */

import React, { useState, useRef } from 'react';
import { Image, X, Upload } from 'lucide-react';

interface ImageUploaderProps {
  value: string; // Current image URL
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  alt?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onAltChange,
  alt = '',
  placeholder = 'Upload image or paste URL',
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload file to server
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('alt', alt || file.name.split('.')[0]);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(`Server returned invalid response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.details || `Upload failed with status ${response.status}`);
      }

      if (!data?.image?.url) {
        throw new Error('Server did not return image URL');
      }

      onChange(data.image.url);
      if (onAltChange && data.image.alt) {
        onAltChange(data.image.alt);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      setUploadError('Please drop an image file');
    }
  };

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items) as DataTransferItem[]) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          uploadFile(file);
          return;
        }
      }
    }
  };

  // Handle URL submit
  const handleUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl('');
    }
  };

  // Helper to fix image URL if it's just an ID
  const getDisplayUrl = (url: string): string => {
    if (!url) return '';
    // If it looks like a UUID (no slashes, 36 chars with dashes), prepend /api/images/
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(url)) {
      return `/api/images/${url}`;
    }
    return url;
  };

  const displayUrl = getDisplayUrl(value);

  return (
    <div className={`image-uploader ${className}`}>
      {value ? (
        <div className="relative">
          <img
            src={displayUrl}
            alt={alt}
            className="w-full h-48 object-cover rounded border border-white/10"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-black/70 text-white hover:bg-black rounded"
          >
            <X size={16} />
          </button>
          <div className="mt-2 text-xs text-zinc-500 truncate">
            {displayUrl}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
          className={`border-2 border-dashed rounded p-6 text-center transition-colors cursor-pointer ${
            isDragging 
              ? 'border-neon-acid bg-neon-acid/10' 
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-neon-acid border-t-transparent mb-3"></div>
              <p className="text-zinc-400 text-sm">Uploading...</p>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Upload size={24} className="mx-auto text-zinc-500 mb-2" />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-neon-acid text-black font-mono text-sm hover:bg-white transition-colors rounded mb-2"
              >
                Choose file
              </button>
              
              <p className="text-zinc-500 text-xs mb-3">
                or drag and drop
              </p>

              {/* URL input as fallback */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  placeholder="Or paste URL..."
                  className="flex-1 bg-zinc-900 border border-white/10 px-3 py-2 text-white text-sm rounded"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl}
                  className="px-3 py-2 bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 disabled:opacity-50 rounded"
                >
                  Add
                </button>
              </div>

              {/* Error message */}
              {uploadError && (
                <p className="text-red-500 text-sm mt-3">{uploadError}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
