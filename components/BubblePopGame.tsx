import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HomeIcon, SpeakerOnIcon, SpeakerOffIcon } from './icons';
import { playSound, stopAllSounds, playDynamicSentence } from '../services/audioService';

interface BubblePopGameProps {
    onGoHome: () => void;
    isSoundOn: boolean;
}

interface Bubble {
    id: number;
    x: number; // percentage 0-100
    size: number; // pixels
    speed: number; // seconds to reach top
    content: string; // Letter or Number
    type: 'letter' | 'number';
    color: string;
    popped: boolean;
    delay: number;
}

const LETTERS = 'ABCDEGHIKLMNOPQRSTUVXY'.split('');
const NUMBERS = '0123456789'.split('');
const COLORS = [
    'from-red-400 to-pink-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-yellow-400 to-orange-500',
    'from-purple-400 to-indigo-500',
    'from-pink-400 to-rose-500',
];

const BubblePopGame: React.FC<BubblePopGameProps> = ({ onGoHome, isSoundOn }) => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [gameMode, setGameMode] = useState<'free' | 'learning'>('free');
    const [target, setTarget] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nextIdRef = useRef(0);
    const animationFrameRef = useRef<number>();

    // Spawn bubbles
    useEffect(() => {
        const spawnInterval = setInterval(() => {
            if (document.hidden) return;

            const isLetter = Math.random() > 0.5;
            const content = isLetter
                ? LETTERS[Math.floor(Math.random() * LETTERS.length)]
                : NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

            const size = Math.random() * 60 + 80; // 80px - 140px (Big for iPad)

            const newBubble: Bubble = {
                id: nextIdRef.current++,
                x: Math.random() * 90, // 0-90%
                size,
                speed: Math.random() * 5 + 5, // 5-10s
                content,
                type: isLetter ? 'letter' : 'number',
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                popped: false,
                delay: 0
            };

            setBubbles(prev => {
                // Limit max bubbles to prevent lag
                if (prev.length > 15) return prev;
                return [...prev, newBubble];
            });

        }, 1000); // Spawn every 1s

        return () => clearInterval(spawnInterval);
    }, []);

    // Cleanup bubbles that float off screen
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            setBubbles(prev => prev.filter(b => !b.popped)); // Ideally check position, but CSS handles movement
            // Real cleanup would need JS animation or onAnimationEnd event.
            // For simplicity, we'll use onAnimationEnd in the render.
        }, 5000);
        return () => clearInterval(cleanupInterval);
    }, []);

    const handlePop = (bubble: Bubble) => {
        if (bubble.popped) return;

        // Visual pop effect
        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));

        // Audio
        playSound('correct', isSoundOn); // Use a generic pop sound if available, or 'correct'
        playDynamicSentence(bubble.content, 'vi', isSoundOn);

        // Score
        setScore(prev => prev + 1);

        // Remove after animation
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        }, 300);
    };

    const handleAnimationEnd = (id: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="relative w-full h-full bg-gradient-to-b from-blue-200 to-blue-400 overflow-hidden touch-none select-none">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-32 bg-blue-600 blur-3xl transform translate-y-1/2"></div>
            </div>

            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50 pointer-events-none">
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto">
                    <HomeIcon className="w-8 h-8 text-blue-600" />
                </button>

                <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border-2 border-blue-300">
                    <span className="text-2xl font-black text-blue-600">Điểm: {score}</span>
                </div>
            </div>

            {/* Bubbles Container */}
            <div ref={containerRef} className="absolute inset-0">
                {bubbles.map(bubble => (
                    <div
                        key={bubble.id}
                        className={`absolute flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300
                            ${bubble.popped ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
                            animate-float
                        `}
                        style={{
                            left: `${bubble.x}%`,
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            bottom: '-150px', // Start below screen
                            animationDuration: `${bubble.speed}s`,
                            animationTimingFunction: 'linear',
                            animationFillMode: 'forwards',
                        }}
                        onAnimationEnd={() => handleAnimationEnd(bubble.id)}
                        onMouseDown={(e) => { e.preventDefault(); handlePop(bubble); }}
                        onTouchStart={(e) => { e.preventDefault(); handlePop(bubble); }}
                    >
                        {/* Bubble Visuals */}
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${bubble.color} opacity-80 shadow-inner border-2 border-white/50 relative overflow-hidden`}>
                            {/* Shine */}
                            <div className="absolute top-[15%] left-[15%] w-[20%] h-[10%] bg-white rounded-[50%] opacity-80 transform -rotate-45"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-black drop-shadow-md select-none" style={{ fontSize: `${bubble.size * 0.5}px` }}>
                                    {bubble.content}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Styles for animation */}
            <style>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-25vh) translateX(20px);
                    }
                    50% {
                        transform: translateY(-50vh) translateX(-20px);
                    }
                    75% {
                        transform: translateY(-75vh) translateX(20px);
                    }
                    100% {
                        transform: translateY(-120vh) translateX(0);
                    }
                }
                .animate-float {
                    animation-name: float;
                }
            `}</style>
        </div>
    );
};

export default BubblePopGame;
