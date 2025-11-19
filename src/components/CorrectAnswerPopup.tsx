import React from 'react';
import { CheckCircleIcon } from './icons';

interface CorrectAnswerPopupProps {
    message: string;
}

const CorrectAnswerPopup: React.FC<CorrectAnswerPopupProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-2xl text-center transform scale-100 transition-transform duration-300 animate-popup">
                <CheckCircleIcon className="w-16 h-16 text-white mx-auto mb-1" />
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">{message}</h2>
            </div>
            <style>{`
                @keyframes popup {
                    0% { transform: scale(0.7) rotate(-5deg); opacity: 0; }
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

export default CorrectAnswerPopup;