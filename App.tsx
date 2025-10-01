import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import Editor from './components/Editor';
import { generateImage, extractImageDescription } from './services/geminiService';
import { ImageFile, EditMode } from './types';

const App: React.FC = () => {
  const [imageFile1, setImageFile1] = useState<ImageFile | null>(null);
  const [imageFile2, setImageFile2] = useState<ImageFile | null>(null);
  const [mode, setMode] = useState<EditMode>('prompt');
  
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const handleImageUpload = (file: File, imageSlot: 1 | 2) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImageFile = {
        base64: reader.result as string,
        mimeType: file.type,
        name: file.name
      };
      if (imageSlot === 1) {
        // Reset the previous session's state before setting the new primary image
        setImageFile2(null);
        setEditedImage(null);
        setError(null);
        setIsLoading(false);
        setMode('prompt');
        setPrompt('');
        setExtractionError(null);
        setIsExtracting(false);
        // Now, set the new primary image
        setImageFile1(newImageFile);
      } else {
        setImageFile2(newImageFile);
      }
    };
    reader.onerror = () => {
      setError("حدث خطأ أثناء قراءة الصورة. الرجاء المحاولة مرة أخرى.");
    };
    reader.readAsDataURL(file);
  };

  const handleExtractDescription = useCallback(async () => {
    if (!imageFile2) return;
    setIsExtracting(true);
    setExtractionError(null);
    try {
        const description = await extractImageDescription(imageFile2);
        setPrompt(description);
    } catch (e) {
        setExtractionError("لم نتمكن من استخراج الوصف. حاول مرة أخرى.");
        console.error(e);
    } finally {
        setIsExtracting(false);
    }
  }, [imageFile2]);

  const handleGenerate = useCallback(async () => {
    if (!imageFile1) {
      setError("الرجاء رفع الصورة الأساسية أولاً.");
      return;
    }
     if (!prompt.trim()) {
        setError("الرجاء كتابة وصف أو استخراجه من الصورة المرجعية أولاً.");
        return;
    }
    
    const images: ImageFile[] = [imageFile1];
    if ((mode === 'reference' || mode === 'merge') && imageFile2) {
      images.push(imageFile2);
    } else if (mode === 'reference' || mode === 'merge') {
      setError(`الرجاء رفع الصورة ${mode === 'reference' ? 'المرجعية' : 'الثانية للدمج'}.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setExtractionError(null);

    // For reference mode, we wrap the user's prompt (which came from extraction)
    // in a more detailed instruction set for the AI.
    let finalPrompt = prompt;
    if (mode === 'reference') {
        finalPrompt = `You are an expert photo editor. Your task is to edit the provided subject image to match a specific artistic style.

**Artistic Style to Apply:**
"${prompt}"

Please apply ONLY the artistic style described above to the subject image. Do not add new elements unless the style implies them (e.g., paint strokes). Return a high-resolution, professionally edited image.`;
    }

    try {
      const result = await generateImage(images, finalPrompt, mode);
      
      if (result) {
        setEditedImage(`data:${result.mimeType};base64,${result.base64}`);
      } else {
        setError("لم يتمكن الذكاء الاصطناعي من تعديل الصورة. قد يكون المحتوى غير مدعوم. حاول بوصف مختلف.");
      }

    } catch (e) {
      console.error(e);
      setError("حدث خطأ غير متوقع أثناء الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile1, imageFile2, mode, prompt]);

  const handleReset = () => {
    setImageFile1(null);
    setImageFile2(null);
    setEditedImage(null);
    setError(null);
    setIsLoading(false);
    setMode('prompt');
    setPrompt('');
    setExtractionError(null);
    setIsExtracting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        {!imageFile1 ? (
          <ImageUploader onImageUpload={(file) => handleImageUpload(file, 1)} />
        ) : (
          <Editor
            imageFile1={imageFile1}
            imageFile2={imageFile2}
            editedImage={editedImage}
            mode={mode}
            setMode={setMode}
            onImageUpload2={(file) => handleImageUpload(file, 2)}
            isLoading={isLoading}
            error={error}
            onGenerate={handleGenerate}
            onReset={handleReset}
            prompt={prompt}
            setPrompt={setPrompt}
            isExtracting={isExtracting}
            extractionError={extractionError}
            onExtractDescription={handleExtractDescription}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;