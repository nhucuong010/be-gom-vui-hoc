import React, { useEffect } from 'react';
import { FilmIcon } from './icons';
import { playSound } from '../services/audioService';

interface CartoonPlayerProps {
    onClose: () => void;
    isSoundOn: boolean;
}

const CartoonPlayer: React.FC<CartoonPlayerProps> = ({ onClose, isSoundOn }) => {
    useEffect(() => {
        // Use a celebratory sound, 'win' seems appropriate for the biggest reward.
        playSound('win', isSoundOn);
    }, [isSoundOn]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-gradient-to-br from-purple-500 to-indigo-700 p-8 rounded-3xl shadow-2xl w-full max-w-lg text-center transform transition-transform duration-300 animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Phần Thưởng Lớn!</h2>
                 <div className="w-56 h-56 mx-auto bg-white/20 p-2 rounded-full my-6 shadow-inner flex items-center justify-center">
                    <FilmIcon className="w-40 h-40 text-white drop-shadow-lg" />
                </div>
                <p className="text-3xl font-semibold text-yellow-200 mb-8 drop-shadow-md">
                    Con giỏi quá! Con đã được thưởng một suất xem phim hoạt hình. Hãy nói ba mẹ mở cho con xem nhé!
                </p>
                <button
                    onClick={onClose}
                    className="bg-white text-purple-600 font-bold px-10 py-4 rounded-full text-2xl shadow-lg hover:bg-purple-100 transition-colors transform hover:scale-105"
                >
                    Tuyệt vời!
                </button>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                 @keyframes slide-up {
                    from { transform: translateY(20px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default CartoonPlayer;