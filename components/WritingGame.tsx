
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HomeIcon, StarIcon, ArrowUturnLeftIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import { WRITING_DATA, WRITING_WORDS, Point, WritingCharacter, WritingWord } from '../data/writingData';

interface WritingGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
    vx: number;
    vy: number;
}

type GameMode = 'menu' | 'writing';

const COLORS = ['#F472B6', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24'];

const WritingGame: React.FC<WritingGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [mode, setMode] = useState<GameMode>('menu');
    const [currentWord, setCurrentWord] = useState<WritingWord | null>(null);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
    const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [checkpointsPassed, setCheckpointsPassed] = useState<number>(0);
    const [score, setScore] = useState(0);
    const [isCharComplete, setIsCharComplete] = useState(false);
    const [isWordComplete, setIsWordComplete] = useState(false);
    const [drawnPath, setDrawnPath] = useState<Point[]>([]);
    const [cursorPos, setCursorPos] = useState<Point | null>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    const svgRef = useRef<SVGSVGElement>(null);
    const particleIdCounter = useRef(0);
    const animationFrameRef = useRef<number>();

    const getCurrentCharData = (): WritingCharacter | undefined => {
        if (!currentWord) return undefined;
        const charId = currentWord.charIds[currentCharIndex];
        return WRITING_DATA.find(c => c.id === charId);
    };

    const currentCharData = useMemo(() => getCurrentCharData(), [currentWord, currentCharIndex]);

    useEffect(() => {
        if (mode === 'menu') {
            playDynamicSentence("Bé muốn tập viết chữ gì nào?", 'vi', isSoundOn, 'english');
        }
    }, [mode, isSoundOn]);

    useEffect(() => {
        if (mode === 'writing' && currentWord && !isWordComplete && !isCharComplete) {
            const char = currentCharData?.char || '';
            if (char.match(/\d/)) {
                 playDynamicSentence(`Số ${char}`, 'vi', isSoundOn);
            } else {
                 playDynamicSentence(`Chữ ${char}`, 'vi', isSoundOn);
            }
        }
    }, [mode, currentWord, currentCharIndex, isCharComplete, isWordComplete, currentCharData, isSoundOn]);

    useEffect(() => {
        if (mode !== 'writing') return;
        const loop = () => {
            setParticles(prev => {
                if (prev.length === 0) return prev;
                return prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        opacity: p.opacity - 0.02,
                        size: p.size * 0.95
                    }))
                    .filter(p => p.opacity > 0);
            });
            animationFrameRef.current = requestAnimationFrame(loop);
        };
        loop();
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [mode]);

    const handleSelectWord = (word: WritingWord) => {
        playSound('click', isSoundOn);
        setCurrentWord(word);
        setCurrentCharIndex(0);
        setCurrentStrokeIndex(0);
        setCompletedStrokes([]);
        setIsCharComplete(false);
        setIsWordComplete(false);
        setDrawnPath([]);
        setMode('writing');
        // Play label or specific instructions for phone numbers
        if (word.id.includes('phone')) {
             playDynamicSentence(`Hãy nhớ số điện thoại của ${word.label.replace('SĐT ', '')} nhé!`, 'vi', isSoundOn);
        } else {
             playDynamicSentence(word.label, 'vi', isSoundOn);
        }
    };

    // Logic to find and play the next word in the category
    const handleNextWord = () => {
        if (!currentWord) return;
        
        let currentCategoryIndex = -1;
        let currentWordIndex = -1;

        // Find where we are
        WRITING_WORDS.forEach((cat, cIdx) => {
            const wIdx = cat.words.findIndex(w => w.id === currentWord.id);
            if (wIdx !== -1) {
                currentCategoryIndex = cIdx;
                currentWordIndex = wIdx;
            }
        });

        if (currentCategoryIndex !== -1 && currentWordIndex !== -1) {
            const category = WRITING_WORDS[currentCategoryIndex];
            if (currentWordIndex + 1 < category.words.length) {
                // Load next word
                handleSelectWord(category.words[currentWordIndex + 1]);
            } else {
                // End of category, go back to menu
                setMode('menu');
                playDynamicSentence("Chúc mừng bé đã hoàn thành bài học!", 'vi', isSoundOn);
            }
        } else {
            setMode('menu');
        }
    };

    const addParticle = (x: number, y: number, intense: boolean = false) => {
        const count = intense ? 8 : 2;
        for(let i=0; i<count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.5 + 0.2;
            const newParticle: Particle = {
                id: particleIdCounter.current++,
                x: x,
                y: y,
                size: Math.random() * 3 + 2,
                opacity: 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed
            };
            setParticles(prev => [...prev, newParticle]);
        }
    };

    const getTouchPoint = (e: React.PointerEvent | React.TouchEvent | React.MouseEvent): Point | null => {
        if (!svgRef.current) return null;
        const rect = svgRef.current.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            const touch = (e as React.TouchEvent).touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = (e as React.PointerEvent).clientX;
            clientY = (e as React.PointerEvent).clientY;
        }
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        return { x, y };
    };

    const handleStart = (e: React.PointerEvent | React.MouseEvent) => {
        if (isCharComplete || !currentCharData) return;
        const pt = getTouchPoint(e);
        if (!pt) return;

        const currentStroke = currentCharData.strokes[currentStrokeIndex];
        const dist = Math.sqrt(Math.pow(pt.x - currentStroke.startPoint.x, 2) + Math.pow(pt.y - currentStroke.startPoint.y, 2));
        
        if (dist < 15) {
            setIsDrawing(true);
            setCheckpointsPassed(0);
            setDrawnPath([pt]);
            setCursorPos(pt);
            playSound('click', isSoundOn);
            addParticle(pt.x, pt.y, true);
        }
    };

    const handleMove = (e: React.PointerEvent | React.MouseEvent) => {
        if (!isDrawing || isCharComplete || !currentCharData) return;
        const pt = getTouchPoint(e);
        if (!pt) return;

        setDrawnPath(prev => [...prev, pt]);
        setCursorPos(pt);
        
        if (Math.random() > 0.3) addParticle(pt.x, pt.y);

        const currentStroke = currentCharData.strokes[currentStrokeIndex];
        const nextCheckpointIndex = checkpointsPassed;
        
        if (nextCheckpointIndex < currentStroke.checkpoints.length) {
            const target = currentStroke.checkpoints[nextCheckpointIndex];
            const dist = Math.sqrt(Math.pow(pt.x - target.x, 2) + Math.pow(pt.y - target.y, 2));

            if (dist < 12) { 
                setCheckpointsPassed(prev => prev + 1);
                addParticle(target.x, target.y, true);
                if (nextCheckpointIndex === currentStroke.checkpoints.length - 1) {
                    completeStroke();
                }
            }
        }
    };

    const handleEnd = () => {
        setIsDrawing(false);
        setDrawnPath([]);
        setCheckpointsPassed(0);
        setCursorPos(null);
    };

    const completeStroke = () => {
        if (!currentCharData) return;
        setIsDrawing(false);
        setDrawnPath([]);
        setCursorPos(null);
        playSound('correct', isSoundOn);
        
        const newCompleted = [...completedStrokes, currentStrokeIndex];
        setCompletedStrokes(newCompleted);

        if (newCompleted.length === currentCharData.strokes.length) {
            setIsCharComplete(true);
            setScore(s => s + 1);
            onCorrectAnswer();
            playSound('win', isSoundOn);
            
            setTimeout(() => {
                if (currentWord && currentCharIndex < currentWord.charIds.length - 1) {
                    setCurrentCharIndex(prev => prev + 1);
                    setCurrentStrokeIndex(0);
                    setCompletedStrokes([]);
                    setIsCharComplete(false);
                } else {
                    setIsWordComplete(true);
                    playDynamicSentence(currentWord?.label || "Tuyệt vời", 'vi', isSoundOn);
                }
            }, 1500);
        } else {
            setCurrentStrokeIndex(prev => prev + 1);
        }
    };

    if (mode === 'menu') {
        // Fixed inset-0 with z-[100] ensures menu covers everything including parent padding
        // Use h-[100dvh] for mobile browsers to handle address bar correctly
        return (
            <div className="fixed inset-0 z-[100] bg-[#1a1a2e] p-4 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] h-[100dvh]">
                <div className="max-w-7xl mx-auto pt-16 pb-20">
                    <div className="flex items-center mb-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/20">
                        <button onClick={() => { stopAllSounds(); onGoHome(); }} className="bg-white p-4 rounded-full shadow-md mr-6 hover:scale-110 transition-transform">
                            <HomeIcon className="w-10 h-10 text-purple-600" />
                        </button>
                        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-md">
                            Bé Tập Viết
                        </h2>
                    </div>

                    {WRITING_WORDS.map((category, idx) => (
                        <div key={idx} className="mb-16 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <h3 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-500 to-pink-500 inline-block px-8 py-3 rounded-full shadow-md border border-white/30">
                                {category.category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                                {category.words.map((word) => (
                                    <button
                                        key={word.id}
                                        onClick={() => handleSelectWord(word)}
                                        className="group relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-white/30 hover:border-pink-400"
                                    >
                                        <div className="p-6 flex flex-col items-center">
                                            {word.image ? (
                                                <div className="w-28 h-28 md:w-32 md:h-32 mb-4 rounded-full bg-gray-50 border-4 border-gray-100 overflow-hidden group-hover:scale-110 transition-transform shadow-inner">
                                                    <img src={word.image} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-28 h-28 md:w-32 md:h-32 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl font-black text-purple-400 group-hover:scale-110 transition-transform shadow-inner border-4 border-white">
                                                    {word.label[0]}
                                                </div>
                                            )}
                                            <span className="text-2xl md:text-3xl font-black text-white group-hover:text-pink-300 drop-shadow-md break-words text-center">{word.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        // Use h-[100dvh] for proper full screen on mobile browsers.
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f0f23] touch-none overflow-hidden select-none h-[100dvh]">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="absolute bg-white rounded-full animate-twinkle" 
                        style={{ 
                            top: `${Math.random() * 100}%`, 
                            left: `${Math.random() * 100}%`, 
                            width: `${Math.random() * 3 + 1}px`, 
                            height: `${Math.random() * 3 + 1}px`, 
                            animationDelay: `${Math.random() * 5}s`,
                            boxShadow: '0 0 6px white'
                        }} 
                    />
                ))}
            </div>

            {/* Header - Adjusted padding to account for browser chrome/notches on iPad. 
                pt-12 md:pt-14 ensures it pushes down below address bar in some view modes, 
                or sits nicely below status bar in standalone mode. */}
            <div className="flex-shrink-0 w-full flex justify-between items-start px-6 pt-14 md:pt-16 pb-4 z-50 pointer-events-none">
                {/* Back Button - Increased contrast and size */}
                <button 
                    onClick={() => { stopAllSounds(); setMode('menu'); }} 
                    className="pointer-events-auto bg-white text-purple-700 p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] border-4 border-purple-100 transform hover:scale-110 active:scale-95 transition-all"
                >
                    <ArrowUturnLeftIcon className="w-8 h-8 md:w-10 md:h-10" />
                </button>
                
                {/* Score Badge - Increased contrast */}
                <div className="pointer-events-auto flex items-center gap-3 bg-white px-6 py-3 rounded-full text-purple-900 border-4 border-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.5)]">
                    <StarIcon className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 animate-pulse" />
                    <span className="text-4xl font-black">{score}</span>
                </div>
            </div>

            {/* Content Container - Flex grow to take available space, min-h-0 to allow shrinking */}
            <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full min-h-0 pb-4">
                
                {/* Word Progress - Ensure it wraps and doesn't overflow */}
                <div className="flex justify-center items-center flex-wrap gap-2 md:gap-3 mb-4 z-10 px-4 w-full max-w-5xl flex-shrink-0">
                    {currentWord?.charIds.map((charId, idx) => {
                        const charInfo = WRITING_DATA.find(c => c.id === charId);
                        const isActive = idx === currentCharIndex && !isWordComplete;
                        const isDone = idx < currentCharIndex || isWordComplete;
                        
                        const isLongWord = (currentWord.charIds.length || 0) > 6;
                        const boxSizeClass = isLongWord ? 'w-12 h-16 md:w-16 md:h-20' : 'w-16 h-24 md:w-24 md:h-32';
                        const textSizeClass = isLongWord ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl';

                        return (
                            <div 
                                key={idx} 
                                className={`
                                    relative transition-all duration-500 ease-out flex items-center justify-center font-black rounded-xl shadow-lg border-2
                                    ${boxSizeClass}
                                    ${isActive 
                                        ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white scale-110 border-white z-20 ring-4 ring-yellow-500/30' 
                                        : isDone 
                                            ? 'bg-green-500 text-white opacity-100 border-green-300' 
                                            : 'bg-gray-800/60 text-gray-500 border-gray-600'
                                    }
                                    ${textSizeClass}
                                `}
                            >
                                {charInfo?.char}
                                {isActive && <div className="absolute inset-0 bg-white rounded-xl animate-ping opacity-20"></div>}
                            </div>
                        );
                    })}
                </div>

                {/* Main Canvas - Auto scaling within remaining space */}
                <div className="relative flex-grow w-full max-w-[800px] p-2 flex items-center justify-center" style={{ maxHeight: '70vh' }}>
                    <div className="w-full h-full relative aspect-square max-h-full">
                        
                        {isWordComplete ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center animate-pop-in z-50">
                                <Confetti />
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(255,215,0,0.3)]"></div>
                                <div className="relative z-10 text-center p-6">
                                    {currentWord?.image && (
                                        <div className="w-40 h-40 md:w-56 md:h-56 mx-auto mb-6 rounded-3xl border-4 border-white/50 bg-white/20 overflow-hidden drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] animate-bounce-slow">
                                            <img 
                                                src={currentWord.image} 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg mb-8 leading-tight break-words">
                                        {currentWord?.label}
                                    </h2>
                                    <button onClick={handleNextWord} className="bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold px-12 py-4 md:px-16 md:py-5 rounded-full text-3xl md:text-4xl shadow-[0_0_40px_rgba(52,211,153,0.6)] hover:scale-105 transition-transform animate-pulse border-4 border-green-300">
                                        Tiếp tục ➜
                                    </button>
                                </div>
                            </div>
                        ) : currentCharData ? (
                            <div className={`w-full h-full bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] border-4 md:border-8 border-slate-500/30 shadow-[0_0_50px_rgba(139,92,246,0.25)] overflow-hidden relative ${isCharComplete ? 'scale-90 opacity-0' : 'scale-100 opacity-100'} transition-all duration-500`}>
                                <svg 
                                    ref={svgRef}
                                    className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    onPointerDown={handleStart}
                                    onPointerMove={handleMove}
                                    onPointerUp={handleEnd}
                                    onPointerLeave={handleEnd}
                                >
                                    <defs>
                                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {currentCharData.strokes.map((stroke, idx) => (
                                        <path key={`ghost-${idx}`} d={stroke.path} stroke="#475569" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" className="opacity-50" strokeDasharray="0.1 10" />
                                    ))}

                                    {completedStrokes.map(idx => (
                                        <g key={`completed-${idx}`} filter="url(#glow)">
                                            <path d={currentCharData.strokes[idx].path} stroke={COLORS[idx % COLORS.length]} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-draw-fast" />
                                            <path d={currentCharData.strokes[idx].path} stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
                                        </g>
                                    ))}

                                    {!isCharComplete && (
                                        <>
                                            <path d={currentCharData.strokes[currentStrokeIndex].path} stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" className="opacity-10" />
                                            <g transform={`translate(${currentCharData.strokes[currentStrokeIndex].startPoint.x}, ${currentCharData.strokes[currentStrokeIndex].startPoint.y})`}>
                                                <circle r="8" fill="#FACC15" className="animate-ping opacity-75" />
                                                <circle r="5" fill="#FACC15" stroke="white" strokeWidth="2" />
                                            </g>
                                            {!isDrawing && (
                                                <image href="https://be-gom-vui-hoc.vercel.app/assets/images/chucai/hand_cursor.png" x={currentCharData.strokes[currentStrokeIndex].startPoint.x} y={currentCharData.strokes[currentStrokeIndex].startPoint.y} width="25" height="25" className="animate-guide-hand" />
                                            )}
                                        </>
                                    )}

                                    {isDrawing && drawnPath.length > 1 && (
                                        <polyline points={drawnPath.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#60A5FA" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" filter="url(#glow)" />
                                    )}
                                    
                                    {particles.map(p => (
                                        <circle key={p.id} cx={p.x} cy={p.y} r={p.size} fill={p.color} opacity={p.opacity} />
                                    ))}
                                </svg>
                            </div>
                        ) : null}

                        {cursorPos && (
                            <div className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}>
                                <div className="w-8 h-8 bg-yellow-300 rounded-full blur-md opacity-80 animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
                .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
                
                @keyframes guide-hand { 
                    0% { transform: translate(0, 0); opacity: 0; } 
                    20% { opacity: 1; }
                    80% { transform: translate(30px, 30px); opacity: 0; }
                    100% { transform: translate(0, 0); opacity: 0; }
                }
                .animate-guide-hand { animation: guide-hand 2s infinite ease-in-out; }

                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

                @keyframes draw-fast { from { stroke-dasharray: 0 1000; } to { stroke-dasharray: 1000 0; } }
                .animate-draw-fast { animation: draw-fast 0.5s ease-out forwards; }

                @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default WritingGame;
