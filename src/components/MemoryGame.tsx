import React, { useState, useEffect, useCallback } from 'react';
import { generateMemoryPairs } from '../services/geminiService';
import type { MemoryCard } from '../types';
import { HomeIcon, GearIcon, StarIcon } from './icons';
import { playSound } from '../services/audioService';
import { playFeedback } from '../services/feedbackService';


// Cấu hình cho từng cấp độ: Bắt đầu dễ hơn
const LEVEL_CONFIGS = [
  { level: 1, cols: 2, pairs: 2 },  // 4 cards (2x2)
  { level: 2, cols: 3, pairs: 3 },  // 6 cards (3x2)
  { level: 3, cols: 4, pairs: 4 },  // 8 cards (4x2)
  { level: 4, cols: 4, pairs: 6 },  // 12 cards (4x3)
  { level: 5, cols: 5, pairs: 10 }, // 20 cards (5x4)
];
const MAX_LEVEL = LEVEL_CONFIGS.length;

// Hàm xáo trộn mảng (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getGridColsClass = (cols: number) => {
    switch (cols) {
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-4';
        case 5: return 'grid-cols-5';
        case 6: return 'grid-cols-6';
        default: return 'grid-cols-4';
    }
}

// Giúp lưới thẻ trông đẹp hơn ở các cấp độ dễ
const getGridContainerClass = (cols: number) => {
    switch (cols) {
        case 2: return 'max-w-md';
        case 3: return 'max-w-lg';
        case 4: return 'max-w-4xl';
        case 5: return 'max-w-5xl';
        default: return 'max-w-full';
    }
}


const WinPopup: React.FC<{ onNextLevel: () => void; onReplay: () => void; isLastLevel: boolean; isSoundOn: boolean; }> = ({ onNextLevel, onReplay, isLastLevel, isSoundOn }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
        <div className="bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-3xl shadow-2xl text-center transform scale-100 transition-transform duration-300 animate-popup">
            <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Con giỏi quá!</h2>
            <p className="text-2xl text-white mb-6 drop-shadow-md">
                {isLastLevel ? "Con đã hoàn thành tất cả các cấp độ!" : "Con muốn chơi lại hay lên màn mới?"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                    onClick={() => { playSound('click', isSoundOn); onReplay(); }}
                    className="bg-white/80 text-purple-700 font-bold px-8 py-3 rounded-full text-xl shadow-lg hover:bg-white transition-colors transform hover:scale-105"
                >
                    {isLastLevel ? 'Chơi lại màn này' : 'Chơi lại'}
                </button>
                <button
                    onClick={() => { playSound('click', isSoundOn); onNextLevel(); }}
                    className="bg-white text-pink-500 font-bold px-8 py-3 rounded-full text-xl shadow-lg hover:bg-pink-100 transition-colors transform hover:scale-105"
                >
                    {isLastLevel ? 'Chơi lại từ đầu' : 'Lên màn!'}
                </button>
            </div>
        </div>
        <style>{`
            @keyframes popup {
                0% { transform: scale(0.7); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-popup { animation: popup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        `}</style>
    </div>
);

const MemoryGame: React.FC<{ onGoHome: () => void; onCorrectAnswer: () => void; isSoundOn: boolean; }> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isGameWon, setIsGameWon] = useState(false);
    const [level, setLevel] = useState(1);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [mismatchedPair, setMismatchedPair] = useState<number[] | null>(null);
    const [justMatchedPair, setJustMatchedPair] = useState<number[] | null>(null);

    const [maxNumber, setMaxNumber] = useState<number>(() => {
        const saved = localStorage.getItem('memoryGameMaxNumber');
        return saved ? parseInt(saved, 10) : 10;
    });
    const [operationType, setOperationType] = useState<'add' | 'add-subtract'>(() => {
        const saved = localStorage.getItem('memoryGameOperationType');
        return saved === 'add-subtract' ? 'add-subtract' : 'add';
    });


    useEffect(() => {
        localStorage.setItem('memoryGameMaxNumber', String(maxNumber));
    }, [maxNumber]);

    useEffect(() => {
        localStorage.setItem('memoryGameOperationType', operationType);
    }, [operationType]);


    const setupGame = useCallback(async () => {
        setIsLoading(true);
        setIsGameWon(false);
        setFlippedIndices([]);
        
        const config = LEVEL_CONFIGS[level - 1];

        try {
            const pairs = await generateMemoryPairs(level, config.pairs, maxNumber, operationType);
            let cardId = 0;
            const gameCards: MemoryCard[] = [];
            pairs.forEach((pair, index) => {
                const matchId = index;
                gameCards.push({ id: cardId++, content: pair.problemImageUrl, matchId, isFlipped: false, isMatched: false });
                gameCards.push({ id: cardId++, content: pair.answerImageUrl, matchId, isFlipped: false, isMatched: false });
            });
            setCards(shuffleArray(gameCards));
        } catch (error) {
            console.error("Failed to setup memory game:", error);
        } finally {
            setIsLoading(false);
        }
    }, [level, maxNumber, operationType]);

    useEffect(() => {
        setupGame();
    }, [setupGame]);

    useEffect(() => {
        if (isGameWon) {
            playSound('win', isSoundOn);
        }
    }, [isGameWon, isSoundOn]);

    const handleCardClick = async (index: number) => {
        if (isChecking || cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
            return;
        }
        
        playSound('card-flip', isSoundOn);

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        if (newFlippedIndices.length === 2) {
            setIsChecking(true);
            const [firstIndex, secondIndex] = newFlippedIndices;
            if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
                // Match found
                await playFeedback(true, isSoundOn);
                onCorrectAnswer();
                setJustMatchedPair(newFlippedIndices);
                setTimeout(() => {
                    setCards(prevCards => {
                        const updatedCards = [...prevCards];
                        updatedCards[firstIndex].isMatched = true;
                        updatedCards[secondIndex].isMatched = true;
                        if(updatedCards.every(c => c.isMatched)) {
                            setIsGameWon(true);
                        }
                        return updatedCards;
                    });
                    setFlippedIndices([]);
                    setIsChecking(false);
                    setJustMatchedPair(null);
                }, 800);
            } else {
                // No match
                await playFeedback(false, isSoundOn);
                setMismatchedPair(newFlippedIndices);
                setTimeout(() => {
                    setCards(prevCards => {
                        const updatedCards = [...prevCards];
                        updatedCards[firstIndex].isFlipped = false;
                        updatedCards[secondIndex].isFlipped = false;
                        return updatedCards;
                    });
                    setFlippedIndices([]);
                    setIsChecking(false);
                    setMismatchedPair(null);
                }, 1200);
            }
        }
    };
    
    const handleNextLevel = () => {
        if (level < MAX_LEVEL) {
            setLevel(l => l + 1);
        } else {
            setLevel(1); // Reset to level 1 after the last level
        }
        setIsGameWon(false);
    };

    const handleReplay = () => {
        setIsGameWon(false);
        setupGame();
    };

    const handleSettingChange = () => {
         playSound('click', isSoundOn);
         setLevel(1);
         setIsSettingsVisible(false);
    }


    const currentConfig = LEVEL_CONFIGS[level - 1];

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4">
             <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
                    <HomeIcon className="w-12 h-12" />
                </button>
                 <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-1 mt-12">Lật Thẻ Trí Nhớ</h2>
                 
                 <div className="flex justify-center items-center gap-3 mb-6">
                    <p className="text-center text-3xl md:text-4xl text-pink-500 font-semibold">Cấp độ {level}</p>
                    <button
                        onClick={() => { playSound('click', isSoundOn); setIsSettingsVisible(!isSettingsVisible); }}
                        className="text-purple-600 hover:text-pink-600 transition-colors"
                        aria-label="Mở cài đặt"
                    >
                        <GearIcon className="w-8 h-8" />
                    </button>
                </div>
                 
                {isSettingsVisible && (
                    <div className="bg-purple-50 p-4 rounded-xl my-4 flex flex-col items-center gap-4 animate-fade-in-down">
                        <div className="flex justify-center items-center gap-2 md:gap-4">
                            <p className="text-lg md:text-xl font-semibold text-purple-700 self-center">Phạm vi số:</p>
                            {[5, 10, 20].map(num => (
                                <button
                                    key={num}
                                    onClick={() => { setMaxNumber(num); handleSettingChange(); }}
                                    className={`px-4 py-2 md:px-5 md:py-2 rounded-full font-bold text-lg md:text-xl transition-colors ${
                                        maxNumber === num
                                            ? 'bg-pink-500 text-white shadow-md'
                                            : 'bg-gray-200 text-gray-700 hover:bg-pink-200'
                                    }`}
                                >
                                    {`0 - ${num}`}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center items-center gap-2 md:gap-4">
                            <p className="text-lg md:text-xl font-semibold text-purple-700 self-center">Phép tính:</p>
                            <button
                                onClick={() => { setOperationType('add'); handleSettingChange(); }}
                                className={`px-4 py-2 md:px-5 md:py-2 rounded-full font-bold text-lg md:text-xl transition-colors ${
                                    operationType === 'add'
                                        ? 'bg-pink-500 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-pink-200'
                                }`}
                            >
                            Chỉ Cộng
                            </button>
                            <button
                                onClick={() => { setOperationType('add-subtract'); handleSettingChange(); }}
                                className={`px-4 py-2 md:px-5 md:py-2 rounded-full font-bold text-lg md:text-xl transition-colors ${
                                    operationType === 'add-subtract'
                                        ? 'bg-pink-500 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-pink-200'
                                }`}
                            >
                                Cộng & Trừ
                            </button>
                        </div>
                    </div>
                )}


                {isLoading ? (
                    <div className="text-center p-16"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto"></div><p className="mt-4 text-purple-600">Đang tạo thẻ bài...</p></div>
                ) : (
                    <div className={`${getGridContainerClass(currentConfig.cols)} mx-auto mt-4`}>
                        <div className={`grid ${getGridColsClass(currentConfig.cols)} gap-4 md:gap-6`}>
                            {cards.map((card, index) => (
                                <div 
                                    key={card.id} 
                                    className={`perspective cursor-pointer card-container w-36 h-48 md:w-48 md:h-64 ${mismatchedPair?.includes(index) ? 'is-mismatched' : ''}`} 
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className={`card-inner ${card.isFlipped || card.isMatched ? 'is-flipped' : ''}`}>
                                        <div className="card-face card-back bg-purple-400 flex items-center justify-center rounded-2xl shadow-lg">
                                            <img src="https://be-gom-vui-hoc.vercel.app/assets/images/covers/memory-card-back.png" alt="Card Back" className="w-full h-full object-cover rounded-2xl" />
                                        </div>
                                        <div className={`card-face card-front flex items-center justify-center p-1 rounded-2xl shadow-lg transition-all duration-300 relative
                                            ${card.isMatched ? 'bg-white border-4 border-green-500' : 'bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100'}
                                            ${justMatchedPair?.includes(index) ? 'is-just-matched' : ''}
                                        `}>
                                            <img src={card.content} alt="Card content" className={`relative z-10 w-full h-full object-contain transition-opacity duration-300 ${card.isMatched ? 'opacity-100' : 'opacity-100'}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
             {isGameWon && <WinPopup onNextLevel={handleNextLevel} onReplay={handleReplay} isLastLevel={level === MAX_LEVEL} isSoundOn={isSoundOn} />}
             <style>{`
                .perspective { perspective: 1000px; }
                .card-container {
                    transition: transform 0.2s ease-in-out;
                }
                .card-container:not([class*="is-mismatched"]):hover {
                    transform: scale(1.05);
                }
                .card-container:active {
                    transform: scale(0.98);
                }
                .card-inner { 
                    position: relative; 
                    width: 100%; 
                    height: 100%; 
                    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-style: preserve-3d; 
                }
                .is-flipped { transform: rotateY(180deg); }
                .card-face { 
                    position: absolute; 
                    width: 100%; 
                    height: 100%; 
                    backface-visibility: hidden; 
                    -webkit-backface-visibility: hidden; 
                    border-radius: 1rem; /* rounded-2xl */
                }
                .card-front { transform: rotateY(180deg); }
                @keyframes fadeInDown {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.3s ease-out forwards;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-2px, 0, 0) rotate(-1deg); }
                    20%, 80% { transform: translate3d(4px, 0, 0) rotate(1deg); }
                    30%, 50%, 70% { transform: translate3d(-6px, 0, 0) rotate(-2deg); }
                    40%, 60% { transform: translate3d(6px, 0, 0) rotate(2deg); }
                }
                .is-mismatched {
                    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
                }
                 @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15) rotate(5deg); }
                    100% { transform: scale(1); }
                }
                .card-inner.is-flipped .is-just-matched {
                    animation: pop 0.5s ease-in-out;
                }
             `}</style>
        </div>
    );
};

export default MemoryGame;