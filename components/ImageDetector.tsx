
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import ImageUpload from './ImageUpload';
import ProgressBar from './ProgressBar';
import { SparklesIcon } from './icons/SparklesIcon';

const ImageDetector: React.FC = () => {
  const [image, setImage] = useState<{ src: string; file: File } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setResult(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ src: reader.result as string, file });
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!image) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const base64 = image.src.split(',')[1];
      const analysisResult = await analyzeImage(base64, image.file.type);
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [image]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">AI-Generated Image Detector</h2>
        <p className="mt-2 text-gray-400">Upload an image (JPEG, PNG, WEBP) to determine the likelihood of it being AI-generated.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <ImageUpload onFileChange={handleFileChange} />
          {image && (
            <div className="mt-4">
              <img src={image.src} alt="Uploaded preview" className="rounded-lg shadow-lg w-full object-contain max-h-96" />
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!image || isLoading}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
                <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Analyze Image
                </>
            )}
          </button>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg min-h-[20rem] flex items-center justify-center animate-fade-in">
          {isLoading && <p className="text-gray-400">Analyzing image with Gemini...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {result && (
            <div className="w-full space-y-6">
                <ProgressBar value={result.is_ai_generated_probability} />
                <div>
                    <h3 className="text-lg font-semibold text-white">Analysis Details:</h3>
                    <p className="mt-2 text-gray-300 bg-gray-700/50 p-4 rounded-md">{result.explanation}</p>
                </div>
            </div>
          )}
          {!isLoading && !result && !error && (
            <p className="text-gray-500">Analysis results will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetector;
