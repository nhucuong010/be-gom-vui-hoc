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

type GameMode = 'free' | 'find_letter' | 'find_number' | 'spell_word';

const LETTERS = 'ABCDEGHIKLMNOPQRSTUVXY'.split('');
const NUMBERS = '0123456789'.split('');
const SIMPLE_WORDS = [
    { word: 'MÈO', letters: ['M', 'È', 'O'] },
    { word: 'CHÓ', letters: ['C', 'H', 'Ó'] },
    { word: 'GÀ', letters: ['G', 'À'] },
    { word: 'BÒ', letters: ['B', 'Ò'] },
    { word: 'VỊT', letters: ['V', 'Ị', 'T'] },
];
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
    const [gameMode, setGameMode] = useState<GameMode>('free');
    const [showIntro, setShowIntro] = useState(true);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Learning mode states
    const [targetLetter, setTargetLetter] = useState<string>('');
    const [targetNumber, setTargetNumber] = useState<string>('');
    const [currentWord, setCurrentWord] = useState<typeof SIMPLE_WORDS[0] | null>(null);
    const [wordProgress, setWordProgress] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const nextIdRef = useRef(0);
    const animationFrameRef = useRef<number>();

    const unlockAudio = () => {
        setIsAudioReady(true);
        playDynamicSentence("Chào bé! Hãy chạm vào bong bóng để bắt đầu!", 'vi', isSoundOn);
    };

    const startGame = (mode: GameMode) => {
        setGameMode(mode);
        setShowIntro(false);
        setScore(0);
        setWordProgress(0);

        if (!isAudioReady) unlockAudio();

        // Initialize learning modes
        if (mode === 'find_letter') {
            const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
            setTargetLetter(letter);
            setTimeout(() => playDynamicSentence(`Bé hãy tìm chữ ${letter}`, 'vi', isSoundOn), 500);
        } else if (mode === 'find_number') {
            const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            setTargetNumber(number);
            setTimeout(() => playDynamicSentence(`Bé hãy tìm số ${number}`, 'vi', isSoundOn), 500);
        } else if (mode === 'spell_word') {
            const word = SIMPLE_WORDS[Math.floor(Math.random() * SIMPLE_WORDS.length)];
            setCurrentWord(word);
            setTimeout(() => playDynamicSentence(`Bé hãy ghép chữ ${word.word}`, 'vi', isSoundOn), 500);
        }
    };

    const nextChallenge = () => {
        if (gameMode === 'find_letter') {
            const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
            setTargetLetter(letter);
            playDynamicSentence(`Bé hãy tìm chữ ${letter}`, 'vi', isSoundOn);
        } else if (gameMode === 'find_number') {
            const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            setTargetNumber(number);
            playDynamicSentence(`Bé hãy tìm số ${number}`, 'vi', isSoundOn);
        } else if (gameMode === 'spell_word') {
            const word = SIMPLE_WORDS[Math.floor(Math.random() * SIMPLE_WORDS.length)];
            setCurrentWord(word);
            setWordProgress(0);
            playDynamicSentence(`Bé hãy ghép chữ ${word.word}`, 'vi', isSoundOn);
        }
    };

    // Spawn bubbles
    useEffect(() => {
        if (showIntro) return;

        const spawnInterval = setInterval(() => {
            if (document.hidden) return;

            let content: string;
            let type: 'letter' | 'number';

            // In learning modes, spawn more of the target
            if (gameMode === 'find_letter' && Math.random() > 0.4) {
                content = targetLetter;
                type = 'letter';
            } else if (gameMode === 'find_number' && Math.random() > 0.4) {
                content = targetNumber;
                type = 'number';
            } else if (gameMode === 'spell_word' && currentWord && Math.random() > 0.3) {
                const nextLetter = currentWord.letters[wordProgress];
                if (nextLetter) {
                    content = nextLetter;
                    type = 'letter';
                } else {
                    const isLetter = Math.random() > 0.5;
                    content = isLetter
                        ? LETTERS[Math.floor(Math.random() * LETTERS.length)]
                        : NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
                    type = isLetter ? 'letter' : 'number';
                }
            } else {
                const isLetter = Math.random() > 0.5;
                content = isLetter
                    ? LETTERS[Math.floor(Math.random() * LETTERS.length)]
                    : NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
                type = isLetter ? 'letter' : 'number';
            }

            const size = Math.random() * 60 + 100;

            const newBubble: Bubble = {
                id: nextIdRef.current++,
                x: Math.random() * 85,
                y: 100,
                size,
                content,
                type,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                popped: false,
                velocity: Math.random() * 0.5 + 0.3,
                drift: (Math.random() - 0.5) * 0.3,
            };

            setBubbles(prev => {
                if (prev.length > 15) return prev;
                return [...prev, newBubble];
            });

        }, 800);

        return () => clearInterval(spawnInterval);
    }, [showIntro, gameMode, targetLetter, targetNumber, currentWord, wordProgress]);

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
                }).filter(b => b.y > -20);

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
                    vy: p.vy + 0.2,
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

        // Check if correct in learning modes
        let isCorrect = true;
        if (gameMode === 'find_letter' && bubble.content !== targetLetter) {
            isCorrect = false;
        } else if (gameMode === 'find_number' && bubble.content !== targetNumber) {
            isCorrect = false;
        } else if (gameMode === 'spell_word' && currentWord) {
            const expectedLetter = currentWord.letters[wordProgress];
            if (bubble.content !== expectedLetter) {
                isCorrect = false;
            }
        }

        if (!isCorrect) {
            playSound('incorrect', isSoundOn);
            playDynamicSentence("Chưa đúng bé ơi!", 'vi', isSoundOn);
            return;
        }

        // Create explosion particles
        createParticles(x, y, bubble.color.split(' ')[1]);

        // Mark as popped
        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));

        // Audio
        playSound('correct', isSoundOn);
        playDynamicSentence(bubble.content, 'vi', isSoundOn);

        // Score
        const newScore = score + 10;
        setScore(newScore);

        // Learning mode logic
        if (gameMode === 'spell_word' && currentWord) {
            const newProgress = wordProgress + 1;
            setWordProgress(newProgress);

            if (newProgress >= currentWord.letters.length) {
                setShowConfetti(true);
                playDynamicSentence(`Giỏi quá! Bé đã ghép được chữ ${currentWord.word}!`, 'vi', isSoundOn);
                setTimeout(() => {
                    setShowConfetti(false);
                    nextChallenge();
                }, 3000);
            }
        } else if (gameMode === 'find_letter' || gameMode === 'find_number') {
            playDynamicSentence("Giỏi lắm!", 'vi', isSoundOn);
        }

        // Celebrate every 100 points
        if (newScore % 100 === 0 && newScore > 0 && gameMode === 'free') {
            setShowConfetti(true);
            playDynamicSentence("Giỏi quá!", 'vi', isSoundOn);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        // Remove after short delay
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        }, 100);
    };

    const isTargetBubble = (bubble: Bubble) => {
        if (gameMode === 'find_letter') {
            return bubble.content === targetLetter;
        } else if (gameMode === 'find_number') {
            return bubble.content === targetNumber;
        } else if (gameMode === 'spell_word' && currentWord) {
            return bubble.content === currentWord.letters[wordProgress];
        }
        return false;
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-gradient-to-b from-sky-200 via-blue-100 to-blue-300 overflow-hidden touch-none select-none">
            {showConfetti && <Confetti />}

            {/* Intro Screen */}
            {showIntro && (
                <div className="absolute inset-0 z-50 bg-gradient-to-b from-sky-300 to-blue-400 flex flex-col items-center justify-center p-8">
                    <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-2xl shadow-2xl">
                        <h1 className="text-5xl font-black text-blue-600 mb-6 text-center">🫧 Bong Bóng Vui Nhộn</h1>
                        <p className="text-2xl text-center text-pink-600 font-bold mb-6">Chọn chế độ chơi:</p>

                        <div className="space-y-4">
                            <button
                                onClick={() => startGame('free')}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-black py-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                            >
                                🎨 Tự Do - Nổ thoải mái!
                            </button>

                            <button
                                onClick={() => startGame('find_letter')}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl font-black py-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                            >
                                🔤 Tìm Chữ Cái
                            </button>

                            <button
                                onClick={() => startGame('find_number')}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl font-black py-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                            >
                                🔢 Tìm Số
                            </button>

                            <button
                                onClick={() => startGame('spell_word')}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-2xl font-black py-5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform"
                            >
                                ✍️ Ghép Chữ
                            </button>
                        </div>
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

            {/* Learning Mode Instructions */}
            {!showIntro && gameMode !== 'free' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur px-8 py-4 rounded-3xl shadow-2xl border-4 border-pink-400">
                        {gameMode === 'find_letter' && (
                            <p className="text-3xl font-black text-pink-600">Tìm chữ: <span className="text-5xl">{targetLetter}</span></p>
                        )}
                        {gameMode === 'find_number' && (
                            <p className="text-3xl font-black text-blue-600">Tìm số: <span className="text-5xl">{targetNumber}</span></p>
                        )}
                        {gameMode === 'spell_word' && currentWord && (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-2xl font-bold text-orange-600">Ghép chữ: {currentWord.word}</p>
                                <div className="flex gap-2">
                                    {currentWord.letters.map((letter, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-14 h-14 flex items-center justify-center rounded-xl border-4 font-black text-2xl
                                                ${idx < wordProgress ? 'bg-green-500 text-white border-green-600' :
                                                    idx === wordProgress ? 'bg-yellow-400 text-gray-800 border-yellow-600 animate-pulse' :
                                                        'bg-gray-200 text-gray-400 border-gray-300'}`}
                                        >
                                            {idx < wordProgress ? '✓' : letter}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bubbles */}
            {bubbles.map(bubble => {
                const isTarget = isTargetBubble(bubble);
                return (
                    <div
                        key={bubble.id}
                        className={`absolute flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-200
                            ${bubble.popped ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                            ${isTarget ? 'ring-8 ring-yellow-400 animate-pulse' : ''}
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
                            <div className="absolute top-[20%] left-[20%] w-[30%] h-[15%] bg-white rounded-[50%] opacity-70 transform -rotate-45 blur-sm"></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-black drop-shadow-lg select-none" style={{ fontSize: `${bubble.size * 0.45}px`, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {bubble.content}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

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
