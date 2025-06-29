import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Image } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  onPhotoRemove: () => void;
  selectedPhoto: File | null;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelect,
  onPhotoRemove,
  selectedPhoto
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onPhotoSelect(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoRemove();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Device Photo (Optional)
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!selectedPhoto ? (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-gray-400">
              <Camera className="w-6 h-6" />
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">
              Click to upload a photo of your damaged device
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WebP up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Device preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPhoto.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};