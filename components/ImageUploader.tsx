
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  if (compact) {
     return (
        <div 
         className={`relative w-full h-full border-2 border-dashed border-gray-300 rounded-xl transition-all duration-300 flex items-center justify-center text-center ${isDragging ? 'border-cyan-500 bg-cyan-50 scale-105' : 'bg-gray-100 hover:bg-gray-200'}`}
         onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
        >
           <input type="file" id="file-upload-compact" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
           <label htmlFor="file-upload-compact" className="cursor-pointer flex flex-col items-center justify-center space-y-2 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-semibold text-gray-600">انقر أو اسحب للإضافة</p>
           </label>
        </div>
     );
  }

  return (
    <div className="w-full max-w-2xl text-center p-8">
       <div 
         className={`relative border-2 border-dashed border-gray-300 rounded-xl p-10 transition-all duration-300 ${isDragging ? 'border-cyan-500 bg-cyan-50 scale-105' : 'bg-white'}`}
         onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
        >
        <input type="file" id="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xl font-semibold text-gray-700">اسحب وأفلت صورة هنا، أو انقر للاختيار</p>
          <p className="text-gray-400">تدعم صيغ PNG, JPG, WEBP بدقة تصل إلى 4K</p>
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
