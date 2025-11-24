

import React, { useEffect } from 'react';
import type { Sticker } from '../types';
import { playSound } from '../services/audioService';

interface StickerUnlockedPopupProps {
    sticker: Sticker;
    onClose: () => void;
    isSoundOn: boolean;
}

const StickerUnlockedPopup: React.FC<StickerUnlockedPopupProps> = ({ sticker, onClose, isSoundOn }) => {
    useEffect(() => {
        playSound('sticker-unlock', isSoundOn);
    }, [isSoundOn]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-3xl shadow-2xl text-center transform scale-100 transition-transform duration-300 animate-popup" onClick={e => e.stopPropagation()}>
                <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Mở khóa sticker mới!</h2>
                <div className="w-64 h-64 mx-auto bg-white/50 p-2 rounded-2xl mb-4 shadow-inner">
                    <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-4xl font-bold text-white mb-6 drop-shadow-md">{sticker.name}</p>
                <button
                    onClick={onClose}
                    className="bg-white text-pink-500 font-bold px-8 py-3 rounded-full text-2xl shadow-lg hover:bg-pink-100 transition-colors transform hover:scale-105"
                >
                    Tuyệt vời!
                </button>
            </div>
            <style>{`
                @keyframes popup {
                    0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
                    70% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-popup {
                    animation: popup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default StickerUnlockedPopup;