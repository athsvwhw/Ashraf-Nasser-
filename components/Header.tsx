import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-600">إطلالة</h1>
            <p className="text-gray-500 text-sm">استوديو الصور بالذكاء الاصطناعي</p>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="افتح القائمة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-40 transform transition-transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-cyan-600">القائمة</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="أغلق القائمة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
             <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>عن التطبيق</span>
                </h3>
                <p className="text-gray-600 text-sm">
                  إطلالة هو استوديو صور احترافي يعمل بالذكاء الاصطناعي يتيح لك تعديل صورك باستخدام أوامر نصية بسيطة، أو دمج الصور، أو حتى استخدام صورة كمرجع للإلهام.
                </p>
             </div>
             <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                   <span>تواصل معنا</span>
                </h3>
                <p className="text-gray-600 text-sm">
                  صُمم وبُرمج بواسطة المهندس أشرف المياحي.
                </p>
                <a href="mailto:achrafalmaiahy@gmail.com" className="block text-cyan-600 hover:underline mt-2 text-sm">achrafalmaiahy@gmail.com</a>
                <a href="https://wa.me/967774331072" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-600 hover:underline mt-1 text-sm group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l-1.217 4.439 4.555-1.191z" />
                  </svg>
                  <span>+967 774 331 072</span>
                </a>
             </div>
          </nav>
          <div className="mt-auto text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} إطلالة. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;