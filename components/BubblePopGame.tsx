import React, { useState, useEffect, useRef } from 'react';
import { HomeIcon } from './icons';
import { playSound, playDynamicSentence } from '../services/audioService';
import Confetti from './Confetti';

interface BubblePopGameProps {
    onGoHome: () => void;
    isSoundOn: boolean;
}

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    content: string;
    type: 'letter' | 'number';
    color: string;
    popped: boolean;
    velocity: number;
    drift: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
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
    const [particles, setParticles] = useState<Particle[]>([]);
    const [score, setScore] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const nextIdRef = useRef(0);
    const animationFrameRef = useRef<number>();

    const unlockAudio = () => {
        setIsAudioReady(true);
        playDynamicSentence("Chào bé! Hãy chạm vào bong bóng để bắt đầu!", 'vi', isSoundOn);
    };

    const startGame = () => {
        setShowIntro(false);
        if (!isAudioReady) unlockAudio();
    };

    // Spawn bubbles
    useEffect(() => {
        if (showIntro) return;

        const spawnInterval = setInterval(() => {
            if (document.hidden) return;

            const isLetter = Math.random() > 0.5;
            const content = isLetter
                ? LETTERS[Math.floor(Math.random() * LETTERS.length)]
                : NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

            const size = Math.random() * 60 + 100; // 100px - 160px

            const newBubble: Bubble = {
                id: nextIdRef.current++,
                x: Math.random() * 85, // 0-85%
                y: 100, // Start at bottom
                size,
                content,
                type: isLetter ? 'letter' : 'number',
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                popped: false,
                velocity: Math.random() * 0.5 + 0.3, // 0.3-0.8 % per frame
                drift: (Math.random() - 0.5) * 0.3, // -0.15 to 0.15 % horizontal drift
            };

            setBubbles(prev => {
                if (prev.length > 15) return prev;
                return [...prev, newBubble];
            });

        }, 800); // Spawn every 0.8s

        return () => clearInterval(spawnInterval);
    }, [showIntro]);

    // Animate bubbles
    useEffect(() => {
        if (showIntro) return;

        const animate = () => {
            setBubbles(prev => {
                const updated = prev.map(b => {
                    if (b.popped) return b;
                    return {
                        ...b,
                        y: b.y - b.velocity,
                        x: b.x + b.drift,
                    };
                }).filter(b => b.y > -20); // Remove bubbles that floated off screen

                return updated;
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [showIntro]);

    // Animate particles
    useEffect(() => {
        if (particles.length === 0) return;

        const animateParticles = () => {
            setParticles(prev => {
                const updated = prev.map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + 0.2, // gravity
                    life: p.life - 1,
                })).filter(p => p.life > 0);

                return updated;
            });

            requestAnimationFrame(animateParticles);
        };

        const frame = requestAnimationFrame(animateParticles);
        return () => cancelAnimationFrame(frame);
    }, [particles.length]);

    const createParticles = (x: number, y: number, color: string) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Math.random() * 3 + 2;
            newParticles.push({
                id: Date.now() + i,
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                color,
                life: 30,
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    };

    const handlePop = (bubble: Bubble, event: React.TouchEvent | React.MouseEvent) => {
        if (bubble.popped) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        let clientX, clientY;
        if ('touches' in event) {
            clientX = event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0;
            clientY = event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Create explosion particles
        createParticles(x, y, bubble.color.split(' ')[1]); // Extract color

        // Mark as popped
        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));

        // Audio
        playSound('correct', isSoundOn);
        playDynamicSentence(bubble.content, 'vi', isSoundOn);

        // Score
        const newScore = score + 10;
        setScore(newScore);

        // Celebrate every 100 points
        if (newScore % 100 === 0 && newScore > 0) {
            setShowConfetti(true);
            playDynamicSentence("Giỏi quá!", 'vi', isSoundOn);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        // Remove after short delay
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        }, 100);
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-gradient-to-b from-sky-200 via-blue-100 to-blue-300 overflow-hidden touch-none select-none">
            {showConfetti && <Confetti />}

            {/* Intro Screen */}
            {showIntro && (
                <div className="absolute inset-0 z-50 bg-gradient-to-b from-sky-300 to-blue-400 flex flex-col items-center justify-center p-8">
                    <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-2xl shadow-2xl">
                        <h1 className="text-5xl font-black text-blue-600 mb-6 text-center">🫧 Bong Bóng Vui Nhộn</h1>
                        <div className="text-xl text-gray-700 space-y-4 mb-8">
                            <p className="font-bold text-2xl text-center text-pink-600">Cách chơi:</p>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-start gap-3">
                                    <span className="text-3xl">👆</span>
                                    <span>Chạm vào bong bóng để làm nổ tung!</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-3xl">🔤</span>
                                    <span>Nghe tên chữ cái hoặc số trong bong bóng</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-3xl">⭐</span>
                                    <span>Càng nổ nhiều, điểm càng cao!</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={startGame}
                            onTouchStart={startGame}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-3xl font-black py-6 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                            Bắt Đầu Chơi! 🎮
                        </button>
                    </div>
                </div>
            )}

            {/* Audio Unlock Overlay (iPad) */}
            {!showIntro && !isAudioReady && (
                <div
                    className="absolute inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center cursor-pointer"
                    onClick={unlockAudio}
                    onTouchStart={unlockAudio}
                >
                    <div className="bg-white p-8 rounded-3xl animate-bounce flex flex-col items-center">
                        <span className="text-6xl mb-4">🫧</span>
                        <span className="text-2xl font-bold text-blue-600">Chạm để bật âm thanh!</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-40 pointer-events-none">
                <button onClick={onGoHome} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto">
                    <HomeIcon className="w-8 h-8 text-blue-600" />
                </button>

                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border-4 border-yellow-400">
                    <span className="text-3xl font-black text-blue-600">🌟 {score}</span>
                </div>
            </div>

            {/* Bubbles */}
            {bubbles.map(bubble => (
                <div
                    key={bubble.id}
                    className={`absolute flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-200
                        ${bubble.popped ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                    `}
                    style={{
                        left: `${bubble.x}%`,
                        bottom: `${bubble.y}%`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        transition: bubble.popped ? 'opacity 0.2s, transform 0.2s' : 'none',
                    }}
                    onMouseDown={(e) => { e.preventDefault(); handlePop(bubble, e); }}
                    onTouchStart={(e) => { e.preventDefault(); handlePop(bubble, e); }}
                >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${bubble.color} opacity-90 shadow-2xl border-4 border-white/60 relative overflow-hidden`}>
                        {/* Shine effect */}
                        <div className="absolute top-[20%] left-[20%] w-[30%] h-[15%] bg-white rounded-[50%] opacity-70 transform -rotate-45 blur-sm"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-black drop-shadow-lg select-none" style={{ fontSize: `${bubble.size * 0.45}px`, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                {bubble.content}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        backgroundColor: particle.color,
                        opacity: particle.life / 30,
                    }}
                />
            ))}
        </div>
    );
};

export default BubblePopGame;
