import React from 'react';
import { EditMode } from '../types';

interface PromptInputProps {
  onGenerate: () => void;
  isLoading: boolean;
  mode: EditMode;
  prompt: string;
  setPrompt: (value: string) => void;
}

const placeholderTexts: Record<EditMode, string> = {
  prompt: 'مثال: اجعل الخلفية عند غروب الشمس، مع إضافة لمسة ناعمة على البشرة...',
  reference: 'استخرج وصفاً من الصورة المرجعية أو اكتب أسلوبك الخاص هنا...',
  merge: 'مثال: ادمج الشخص من الصورة الأولى مع خلفية الصورة الثانية...'
};


const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading, mode, prompt, setPrompt }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholderTexts[mode]}
        rows={2}
        className="flex-grow bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-gray-800 placeholder-gray-400 resize-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-600 shrink-0 self-stretch"
      >
        {isLoading ? '...جاري التعديل' : 'تعديل الصورة'}
      </button>
    </form>
  );
};

export default PromptInput;