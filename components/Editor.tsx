import React from 'react';
import PromptInput from './PromptInput';
import ImageDisplay from './ImageDisplay';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import { ImageFile, EditMode } from '../types';

interface EditorProps {
  imageFile1: ImageFile;
  imageFile2: ImageFile | null;
  editedImage: string | null;
  mode: EditMode;
  setMode: (mode: EditMode) => void;
  onImageUpload2: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onReset: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isExtracting: boolean;
  extractionError: string | null;
  onExtractDescription: () => void;
}

const modeConfig = {
  prompt: { 
    title: 'تعديل بنص', 
    uploaderLabel: '', 
    tutorial: 'اكتب وصفاً للتعديل الذي تريده على الصورة. مثال: "اجعل السماء ليلية ومليئة بالنجوم".',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
  },
  reference: { 
    title: 'تعديل بصورة مرجعية', 
    uploaderLabel: 'ارفع صورة مرجعية', 
    tutorial: "ارفع صورة مرجعية، ثم انقر على زر 'استخراج الوصف' لملء خانة النص تلقائياً بأسلوب الصورة. يمكنك تعديل الوصف قبل الضغط على 'تعديل الصورة'.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
  },
  merge: { 
    title: 'دمج صورتين', 
    uploaderLabel: 'ارفع الصورة الثانية للدمج', 
    tutorial: 'ارفع صورة ثانية واكتب وصفاً لكيفية دمجهما معاً. مثال: "ضع الشخص من الصورة الأولى في خلفية الصورة الثانية".',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5v4m0 0h4" /></svg>
  },
};

const Editor: React.FC<EditorProps> = ({
  imageFile1, imageFile2, editedImage, mode, setMode, onImageUpload2, isLoading, error, onGenerate, onReset, prompt, setPrompt, isExtracting, extractionError, onExtractDescription
}) => {
  const currentMode = modeConfig[mode];

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Mode Switcher */}
      <div className="flex justify-center bg-gray-100 p-1 rounded-xl border border-gray-200">
        {(Object.keys(modeConfig) as EditMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === m ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {modeConfig[m].icon}
            <span>{modeConfig[m].title}</span>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Source Images */}
        <div className="w-full lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ImageDisplay title="الصورة الأصلية" imageUrl={imageFile1.base64} />
          {(mode === 'reference' || mode === 'merge') ? (
            imageFile2 ? (
              <div className="flex flex-col gap-2">
                <ImageDisplay title={currentMode.title} imageUrl={imageFile2.base64} />
                 {mode === 'reference' && (
                    <div className="flex flex-col gap-1">
                      <button 
                          onClick={onExtractDescription} 
                          disabled={isExtracting}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 text-cyan-700 font-semibold rounded-lg hover:bg-cyan-100 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                          {isExtracting ? (
                              <Spinner />
                          ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                          )}
                          <span>{isExtracting ? '...جاري الاستخراج' : 'استخراج وصف الصورة'}</span>
                      </button>
                      {extractionError && <p className="text-xs text-red-600 text-center">{extractionError}</p>}
                    </div>
                 )}
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-500 text-center">{currentMode.uploaderLabel}</h2>
                 <div className="aspect-square w-full">
                    <ImageUploader onImageUpload={onImageUpload2} compact={true} />
                </div>
              </div>
            )
          ) : (
             <div className="hidden md:flex flex-col gap-2 p-4 bg-gray-100 rounded-xl border border-gray-200 justify-center items-center text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h3 className="font-semibold text-gray-700">كيف تستخدم الوضع الحالي؟</h3>
                 <p className="text-sm text-gray-500">{currentMode.tutorial}</p>
             </div>
          )}
        </div>
        {/* Result Image */}
        <ImageDisplay
          title="الصورة المعدلة"
          imageUrl={editedImage}
          isLoading={isLoading}
          originalFileName={imageFile1.name}
        />
      </div>

       {/* Tutorial for mobile */}
       <div className="md:hidden w-full max-w-4xl p-4 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-3 text-sm text-gray-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <p>{currentMode.tutorial}</p>
       </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center">
        <PromptInput onGenerate={onGenerate} isLoading={isLoading || isExtracting} mode={mode} prompt={prompt} setPrompt={setPrompt} />
        <button
          onClick={onReset}
          className="w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-400 font-semibold flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" />
          </svg>
          <span>رفع صورة جديدة</span>
        </button>
      </div>
    </div>
  );
};

export default Editor;