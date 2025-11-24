
import React, { useState, useEffect, useMemo } from 'react';
import { HomeIcon, StarIcon } from './icons';
import { playSound, playDynamicSentence } from '../services/audioService';
import { playFeedback, getEquationText } from '../services/feedbackService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import ReadAloudButton from './ReadAloudButton';

// --- Sub-components ---

const Die: React.FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        if (!isRolling) {
            setDisplayValue(value);
            return;
        }

        // Fast face changing during rolling (every 60ms)
        const interval = setInterval(() => {
            setDisplayValue(Math.floor(Math.random() * 6) + 1);
        }, 60);

        return () => clearInterval(interval);
    }, [isRolling, value]);

    const Dot = () => <div className="w-6 h-6 md:w-9 md:h-9 bg-gray-800 rounded-full shadow-sm" />;

    const patterns: Record<number, React.ReactNode> = {
        1: <div className="flex justify-center items-center w-full h-full"><Dot /></div>,
        2: <div className="flex flex-col justify-between w-full h-full p-2"><Dot /> <div className="self-end"><Dot /></div></div>,
        3: <div className="flex flex-col justify-between w-full h-full p-2"><Dot /> <div className="self-center"><Dot /></div> <div className="self-end"><Dot /></div></div>,
        4: <div className="flex justify-between w-full h-full p-2"><div className="flex flex-col justify-between"><Dot /><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /></div></div>,
        5: <div className="flex justify-between w-full h-full p-2"><div className="flex flex-col justify-between"><Dot /><Dot /></div><div className="flex flex-col justify-center items-center"><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /></div></div>,
        6: <div className="flex justify-between w-full h-full p-2"><div className="flex flex-col justify-between"><Dot /><Dot /><Dot /></div><div className="flex flex-col justify-between"><Dot /><Dot /><Dot /></div></div>,
    };
    
    return (
        <div className="relative w-32 h-32 md:w-44 md:h-44 flex justify-center items-end">
            {/* Shadow Effect */}
            <div 
                className={`absolute -bottom-8 w-full h-6 bg-black/20 rounded-[50%] blur-md transition-all duration-300`}
                style={isRolling ? {
                    animation: 'shadowBounce 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                } : {}}
            />

            {/* The Die Block */}
            <div 
                className={`relative w-full h-full bg-white rounded-2xl shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.15)] border-2 border-gray-100 p-2 md:p-4 z-10`}
                style={isRolling ? {
                    animation: 'diceToss 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                    transformOrigin: 'center bottom',
                } : {
                    transform: 'translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(1)',
                }}
            >
                {patterns[displayValue]}
            </div>

            <style>{`
                @keyframes diceToss {
                    0% {
                        transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
                    }
                    10% { /* Anticipation / Squash down */
                        transform: translateY(10px) scaleY(0.9) scaleX(1.1) rotateX(0deg);
                    }
                    15% { /* Launch */
                        transform: translateY(-50px) scaleY(1.1) scaleX(0.9) rotateX(45deg) rotateY(45deg);
                    }
                    45% { /* Peak Height */
                        transform: translateY(-300px) rotateX(360deg) rotateY(540deg) rotateZ(180deg) scale(1);
                    }
                    75% { /* Impact / Squash */
                        transform: translateY(0) scaleY(0.6) scaleX(1.4) rotateX(720deg) rotateY(1080deg) rotateZ(360deg);
                    }
                    85% { /* Bounce / Stretch */
                        transform: translateY(-60px) scaleY(1.1) scaleX(0.9) rotateX(720deg) rotateY(1080deg) rotateZ(360deg);
                    }
                    95% { /* Land / Small Squash */
                        transform: translateY(0) scaleY(0.95) scaleX(1.05) rotateX(720deg) rotateY(1080deg) rotateZ(360deg);
                    }
                    100% { /* Settle */
                        transform: translateY(0) rotateX(720deg) rotateY(1080deg) rotateZ(360deg) scale(1);
                    }
                }

                @keyframes shadowBounce {
                    0% { transform: scale(1); opacity: 0.4; }
                    10% { transform: scale(1.1); opacity: 0.5; }
                    45% { transform: scale(0.4); opacity: 0.1; }
                    75% { transform: scale(1.5); opacity: 0.6; }
                    85% { transform: scale(0.8); opacity: 0.2; }
                    95% { transform: scale(1.1); opacity: 0.4; }
                    100% { transform: scale(1); opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

const NumberPad: React.FC<{ onNumberClick: (num: string) => void, onClear: () => void, disabled: boolean }> = ({ onNumberClick, onClear, disabled }) => {
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '⌫'];
    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
            {buttons.map(btn => {
                const isClear = btn === '⌫';
                return (
                    <button 
                        key={btn}
                        onClick={() => (isClear ? onClear() : onNumberClick(btn))}
                        disabled={disabled}
                        className={`py-5 rounded-xl text-5xl font-bold shadow-md transition-transform transform active:scale-95 disabled:opacity-50
                            ${isClear ? 'col-start-3 bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-sky-400 text-white hover:bg-sky-500'}
                        `}
                    >
                        {btn}
                    </button>
                );
            })}
        </div>
    );
};

// --- Main Game Component ---

interface DiceGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

const DiceGame: React.FC<DiceGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState<{ num1: number, num2: number, answer: number } | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [isRolling, setIsRolling] = useState(false);
    const [showResult, setShowResult] = useState<{ message: string; isCorrect: boolean } | null>(null);
    const [gameState, setGameState] = useState<'start' | 'rolling' | 'rolled'>('start');
    const [rollId, setRollId] = useState(0); 
    
    const level = Math.floor(score / 5) + 1;

    const handleRoll = () => {
        if (isRolling) return;

        playSound('dice-roll', isSoundOn);
        setIsRolling(true);
        setUserAnswer('');
        setShowResult(null);
        setRollId(prev => prev + 1); // Force re-mount dice for new animation
        
        // 1. Determine result immediately
        // Rule: Sum must be <= 10.
        
        // Dice 1: 1 to 6
        const num1 = Math.floor(Math.random() * 6) + 1;
        
        // Dice 2: 
        // Must be <= 6 (dice limit)
        // AND num1 + num2 <= 10  =>  num2 <= 10 - num1
        const maxNum2 = Math.min(6, 10 - num1);
        
        const num2 = Math.floor(Math.random() * maxNum2) + 1;
        
        const newProblem = { num1, num2, answer: num1 + num2 };
        
        setProblem(newProblem);
        setGameState('rolling');

        // Wait for animation (1.8s)
        setTimeout(() => {
            setIsRolling(false);
            setGameState('rolled');
            
            const questionText = getEquationText(`${newProblem.num1} + ${newProblem.num2}`, newProblem.answer, 'calculation', true);
            playDynamicSentence(questionText, 'vi', isSoundOn);

        }, 1800);
    };
    
    useEffect(() => {
        const checkAnswer = async () => {
            if (gameState !== 'rolled' || !problem || showResult) return;

            const answerString = String(problem.answer);
            if (userAnswer.length === answerString.length) {
                const isCorrect = userAnswer === answerString;
                
                const feedbackMessage = await playFeedback(isCorrect, isSoundOn);
                setShowResult({ message: feedbackMessage, isCorrect });

                if (isCorrect) {
                    setScore(s => s + 1);
                    onCorrectAnswer();
                    setTimeout(() => {
                        setGameState('start');
                        setProblem(null);
                        setUserAnswer('');
                        setShowResult(null);
                    }, 2500); 
                } else {
                    setTimeout(() => {
                        setUserAnswer('');
                        setShowResult(null);
                    }, 1000);
                }
            }
        };
        checkAnswer();
    }, [userAnswer, problem, onCorrectAnswer, gameState, showResult, isSoundOn]);

    const handleNumberClick = (num: string) => {
        playSound('click', isSoundOn);
        setUserAnswer(prev => prev.length < 3 ? prev + num : prev);
    };

    const handleClear = () => {
        playSound('click', isSoundOn);
        setUserAnswer(prev => prev.slice(0, -1));
    };
    
    const questionText = useMemo(() => problem ? getEquationText(`${problem.num1} + ${problem.num2}`, problem.answer, 'calculation', true) : '', [problem]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
            <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative min-h-[600px] flex flex-col">
                <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow-md z-20">
                    <StarIcon className="w-8 h-8 mr-2" />
                    <span className="text-3xl">{score}</span>
                </div>
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-20">
                    <HomeIcon className="w-12 h-12" />
                </button>

                <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-2 mt-12">Tung Xúc Xắc</h2>
                <p className="text-center text-3xl md:text-4xl text-pink-500 mb-8 font-semibold">Cấp độ {level}</p>

                <div className="flex-grow flex flex-col justify-center items-center">
                    {gameState === 'start' && (
                        <div className="text-center">
                            <button onClick={handleRoll} disabled={isRolling} className="bg-green-500 text-white font-bold py-8 px-16 rounded-2xl text-5xl shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 animate-bounce-slow">
                                {isRolling ? 'Đang tung...' : 'Tung Xúc Xắc!'}
                            </button>
                        </div>
                    )}

                    {(gameState === 'rolling' || gameState === 'rolled') && problem && (
                        <div className="flex flex-col items-center gap-6 w-full">
                            <div className="flex justify-center items-end gap-6 pb-6 pt-32 h-64 w-full overflow-visible">
                                {/* Key ensures remount for animation restart */}
                                <Die key={`die1-${rollId}`} value={problem.num1} isRolling={isRolling} />
                                <span className="text-8xl font-bold text-gray-700 pb-8">+</span>
                                <Die key={`die2-${rollId}`} value={problem.num2} isRolling={isRolling} />
                            </div>
                            
                            {!isRolling && (
                                <div className="animate-fade-in w-full flex flex-col items-center">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <p className="text-5xl text-center text-purple-600 font-semibold">{problem.num1} + {problem.num2} = ?</p>
                                        <ReadAloudButton text={questionText} lang="vi" isSoundOn={isSoundOn} />
                                    </div>

                                    <div className="w-full flex flex-col items-center gap-4">
                                        <div className={`p-4 bg-white rounded-xl shadow-inner min-w-[200px] text-center text-8xl font-bold text-purple-800 transition-colors
                                            ${showResult?.isCorrect ? 'bg-green-200' : ''}
                                            ${showResult && !showResult.isCorrect ? 'bg-red-200' : ''}
                                        `}>
                                            {userAnswer || '?'}
                                        </div>
                                        <NumberPad onNumberClick={handleNumberClick} onClear={handleClear} disabled={!!showResult} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
             {showResult && showResult.isCorrect && (
                <>
                    <CorrectAnswerPopup message={showResult.message} />
                    <Confetti />
                </>
            )}
             <style>{`
                .animate-bounce-slow {
                    animation: bounce 2s infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default DiceGame;
