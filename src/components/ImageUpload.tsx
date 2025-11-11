'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import ImageKitImage from './ImageKitImage';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  existingUrl?: string;
  onRemove?: () => void;
}

export default function ImageUpload({ onUploadComplete, existingUrl, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when existingUrl changes
  useEffect(() => {
    if (existingUrl && existingUrl !== preview) {
      setPreview(existingUrl);
    } else if (!existingUrl && preview && !preview.startsWith('data:')) {
      setPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensure cookies are sent with the request
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.data.url);
        onUploadComplete(result.data.url);
      } else {
        setError(result.error || 'Upload failed');
        setPreview(null);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onUploadComplete(''); // Clear the URL
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image
      </label>
      
      {/* Preview */}
      {preview && (
        <div className="relative group">
          <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
            {preview.startsWith('data:') ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : preview.includes('ik.imagekit.io') ? (
              <ImageKitImage
                src={preview}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Button (when preview exists) */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Change Image
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

