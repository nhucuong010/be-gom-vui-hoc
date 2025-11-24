import React, { useState, useEffect } from 'react';

const IOSInstallPrompt: React.FC = () => {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Detects if device is on iOS 
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        // Detects if device is in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // Show prompt only on iOS and not in standalone mode
        if (isIOS && !isStandalone) {
            // Delay showing to not be annoying immediately
            const timer = setTimeout(() => setShowPrompt(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[200] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-purple-200 animate-slide-up flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-inner">
                        <img src="/vite.svg" className="w-8 h-8" alt="Logo" />
                    </div>
                    <div>
                        <h3 className="font-bold text-purple-900 text-lg">Cài đặt Bé Gốm</h3>
                        <p className="text-sm text-gray-600">Thêm vào màn hình chính để chơi toàn màn hình!</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowPrompt(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-purple-800 font-semibold bg-purple-50 p-3 rounded-xl">
                <span>1. Nhấn nút Chia sẻ</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-800 font-semibold bg-purple-50 p-3 rounded-xl">
                <span>2. Chọn "Thêm vào MH chính"</span>
                <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">+</span>
                </div>
            </div>

            <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
};

export default IOSInstallPrompt;
