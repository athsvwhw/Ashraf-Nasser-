
import React from 'react';
import Spinner from './Spinner';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  originalFileName?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false, originalFileName }) => {
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    
    const name = originalFileName ? originalFileName.substring(0, originalFileName.lastIndexOf('.')) || 'image' : 'image';
    const ext = imageUrl.substring(imageUrl.indexOf('/') + 1, imageUrl.indexOf(';'));
    link.download = `etlaa-${name}-edited.${ext}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
        {imageUrl && !isLoading && originalFileName && (
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 font-semibold p-2 rounded-lg hover:bg-cyan-50 transition-colors"
            aria-label="تحميل الصورة المعدلة"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
             <span>تحميل</span>
          </button>
        )}
      </div>
      <div className="aspect-square w-full bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-cyan-600">
             <Spinner />
             <p>الذكاء الاصطناعي يعمل على إبداعك...</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center gap-2 p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 00-4.132 0M9.75 3.104c-.621 0-1.223.24-1.67.662M19.5 14.5l-4.09-4.09a2.25 2.25 0 00-3.182 0L9.75 14.5M19.5 14.5c.249.023.498.05.748.082M19.5 14.5c.621 0 1.223.24 1.67.662m-1.67-.662a24.301 24.301 0 01-4.132 0m0 0c1.906 0 3.68.74 5.034 1.956" />
            </svg>
            <p>ستظهر النتيجة هنا</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
