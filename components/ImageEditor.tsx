
import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import { WandIcon } from './icons/WandIcon';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ src: string; file: File } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setEditedImage(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage({ src: reader.result as string, file });
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImage(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) return;
    setIsLoading(true);
    setEditedImage(null);
    setError(null);
    try {
      const base64 = originalImage.src.split(',')[1];
      const newImageBase64 = await editImage(base64, prompt, originalImage.file.type);
      setEditedImage(`data:${originalImage.file.type};base64,${newImageBase64}`);
    } catch (e) {
      console.error(e);
      setError('Failed to edit image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">AI-Powered Image Editor</h2>
        <p className="mt-2 text-gray-400">Upload an image and describe the changes you want to make.</p>
      </div>

      <div className="space-y-4 md:w-2/3 lg:w-1/2">
         <ImageUpload onFileChange={handleFileChange} disabled={isLoading} />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Add a retro filter', 'Make the sky look like a sunset'"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary transition"
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={!originalImage || !prompt || isLoading}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
            <WandIcon className="w-5 h-5 mr-2" />
            Generate Image
            </>
          )}
        </button>
      </div>
      
      {error && <p className="text-red-400">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Original</h3>
            <div className="aspect-square w-full bg-gray-800/50 rounded-lg flex items-center justify-center">
                {originalImage ? (
                    <img src={originalImage.src} alt="Original" className="rounded-lg shadow-lg object-contain max-h-full max-w-full" />
                ) : (
                    <p className="text-gray-500">Upload an image to start</p>
                )}
            </div>
        </div>
         <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Edited</h3>
            <div className="aspect-square w-full bg-gray-800/50 rounded-lg flex items-center justify-center animate-fade-in">
                {isLoading && <p className="text-gray-400 animate-pulse-fast">Generating new image...</p>}
                {editedImage && (
                    <img src={editedImage} alt="Edited" className="rounded-lg shadow-lg object-contain max-h-full max-w-full" />
                )}
                {!isLoading && !editedImage && <p className="text-gray-500">Edited image will appear here</p>}
            </div>
        </div>
      </div>

    </div>
  );
};

export default ImageEditor;
