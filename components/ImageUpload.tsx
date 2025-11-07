
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileChange, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  }, [onFileChange, disabled]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    } else {
        onFileChange(null);
    }
  };

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex justify-center w-full h-48 px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-brand-primary' : 'border-gray-600'} border-dashed rounded-md transition-colors duration-200 ${disabled ? 'cursor-not-allowed bg-gray-700/50' : 'cursor-pointer bg-gray-700 hover:bg-gray-700/50'}`}
    >
      <div className="space-y-1 text-center flex flex-col items-center justify-center">
        <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
        <div className="flex text-sm text-gray-400">
          <span className="relative rounded-md font-medium text-brand-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
            <span>Upload a file</span>
            <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                disabled={disabled}
            />
          </span>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
      </div>
    </label>
  );
};

export default ImageUpload;
