import React, { useState, useEffect, useCallback } from 'react';
import type { StreetFoodProblem, StreetFoodMenuItem, StreetFoodCookingStep } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import { MENU, problemBank } from '../data/streetFoodData';

// --- Interfaces & Types ---
interface StreetFoodGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}
type GamePhase = 'ordering' | 'cooking' | 'calculating_total' | 'giving_change' | 'summary' | 'loading' | 'end_level';

// --- Constants & Data ---
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// --- Helper Components ---
const IncorrectFeedbackPopup: React.FC<{ message: string; }> = ({ message }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
        <div className={`text-center p-8 sm:p-12 rounded-3xl shadow-2xl bg-red-400`}>
            <p className="text-4xl sm:text-5xl font-bold text-white">{message}</p>
        </div>
    </div>
);

// --- Main Game Component ---
const StreetFoodGame: React.FC<StreetFoodGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [phase, setPhase] = useState<GamePhase>('loading');
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState<StreetFoodProblem | null>(null);
    const [problemIndex, setProblemIndex] = useState(0);
    
    const [cookingProgress, setCookingProgress] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);
    const [showOrder, setShowOrder] = useState(false);

    const startLevel = useCallback((index: number) => {
        setPhase('loading');
        setProblemIndex(index);
        const newProblem = problemBank[index % problemBank.length]; // Loop through problems
        setProblem(newProblem);
        
        const initialProgress: Record<string, number> = {};
        newProblem.order.items.forEach(id => { initialProgress[id] = 0; });
        setCookingProgress(initialProgress);
        
        setFeedback(null);
        setShowOrder(false);

        setTimeout(() => {
            setPhase('ordering');
        }, 500);
    }, []);

    useEffect(() => {
        startLevel(0); // Start with the first problem
    }, [startLevel]);

    useEffect(() => {
        if (phase === 'ordering' && problem) {
            const orderTimeout = setTimeout(() => {
                setShowOrder(true);
                playDynamicSentence(problem.order.orderText, 'vi', isSoundOn, 'street_food');
                const hideTimeout = setTimeout(() => {
                    setShowOrder(false);
                    const startCookingTimeout = setTimeout(() => setPhase('cooking'), 1000);
                    return () => clearTimeout(startCookingTimeout);
                }, 4000);
                return () => clearTimeout(hideTimeout);
            }, 1000);
            return () => clearTimeout(orderTimeout);
        }
    }, [phase, problem, isSoundOn]);

    useEffect(() => {
        if (phase === 'calculating_total') {
            playDynamicSentence("Tổng cộng là bao nhiêu xu?", 'vi', isSoundOn, 'street_food');
        } else if (phase === 'giving_change' && problem) {
            const question = `${problem.order.payment} xu trừ ${problem.order.total} xu bằng mấy xu?`;
            playDynamicSentence(question, 'vi', isSoundOn, 'street_food');
        }
    }, [phase, problem, isSoundOn]);


    const handleCookingStep = (itemId: keyof typeof MENU) => {
        playSound('click', isSoundOn);
        const newProgress = { ...cookingProgress };
        // The image shown is for the CURRENT step, so we increment AFTER checking completion.
        const currentStepIndex = newProgress[itemId];
        const nextStepIndex = currentStepIndex + 1;
        const totalSteps = MENU[itemId].steps.length;

        if (nextStepIndex < totalSteps) {
            newProgress[itemId] = nextStepIndex;
            setCookingProgress(newProgress);
        }

        const allDone = Object.keys(newProgress).every(id => 
            (newProgress[id] + 1) >= MENU[id as keyof typeof MENU].steps.length
        );

        if (allDone) {
            setTimeout(() => setPhase('calculating_total'), 1500);
        }
    };

    const generateOptions = (correctAnswer: number) => {
        const opts = new Set<number>([correctAnswer]);
        while (opts.size < 3) {
            const offset = Math.floor(Math.random() * 5) - 2;
            const option = correctAnswer + offset;
            if (option >= 0 && option !== correctAnswer && option <= 20) {
                opts.add(option);
            }
        }
        return Array.from(opts).sort(() => 0.5 - Math.random());
    };

    const handleMathAnswer = (answer: number, type: 'total' | 'change') => {
        playSound('click', isSoundOn);
        if (!problem) return;
        
        const isCorrect = (type === 'total' && answer === problem.order.total) || (type === 'change' && answer === problem.order.change);
        
        if (isCorrect) {
            setFeedback({ isCorrect: true, message: "Đúng rồi!" });
            onCorrectAnswer();
            setScore(prev => prev + 1);
            setTimeout(() => {
                setFeedback(null);
                if (type === 'total') {
                     if(problem.order.change === 0) {
                        playDynamicSentence("Vừa đủ rồi, không cần thối tiền.", 'vi', isSoundOn, 'street_food');
                        setPhase('summary');
                        playSound('win', isSoundOn);
                     } else {
                        setPhase('giving_change');
                     }
                } else {
                    setPhase('summary');
                    playSound('win', isSoundOn);
                }
            }, 1500);
        } else {
            setFeedback({ isCorrect: false, message: "Thử lại nhé!" });
            playSound('incorrect', isSoundOn);
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const handleNextProblem = () => {
        playSound('click', isSoundOn);
        const nextIndex = problemIndex + 1;
        startLevel(nextIndex);
    };

    const renderContent = () => {
        if (phase === 'loading' || !problem) {
             return <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>;
        }

        switch(phase) {
            case 'ordering':
                return (
                    <div className="flex flex-col items-center">
                        <div className={`relative transition-transform duration-300 ${showOrder ? 'scale-110' : 'scale-100'}`}>
                            {showOrder && (
                                <div className="absolute bottom-full mb-2 w-64 bg-white p-3 rounded-2xl shadow-xl z-20 animate-fade-in-down">
                                    <p className="text-xl font-bold text-purple-900">{problem.order.orderText}</p>
                                </div>
                            )}
                            <img src={problem.order.customerImageUrl} alt={problem.order.customerName} className="w-64 h-64 object-contain" />
                        </div>
                         <p className="mt-2 text-3xl font-bold px-4 py-1 rounded-full shadow-md bg-white/70 text-purple-700">{problem.order.customerName}</p>
                    </div>
                );
            
            case 'cooking':
                return (
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-4xl font-bold text-purple-700 mb-6">Bé Gốm vào bếp!</h2>
                        <div className="flex flex-wrap justify-center items-start gap-6">
                           {problem.order.items.map(itemId => {
                                const item = MENU[itemId];
                                const currentStepIndex = cookingProgress[itemId];
                                const currentStep = item.steps[currentStepIndex];
                                const isDone = currentStepIndex >= item.steps.length - 1;

                                return (
                                <div key={item.id} className="flex flex-col items-center gap-2 p-4 bg-white/50 rounded-2xl shadow-lg w-72">
                                    <h3 className="text-3xl font-bold text-pink-500">{item.name}</h3>
                                    <div className="w-56 h-56 bg-white rounded-xl shadow-inner flex items-center justify-center p-2">
                                        <img src={currentStep.imageUrl} alt={currentStep.instruction} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <button
                                        onClick={() => handleCookingStep(item.id)}
                                        disabled={isDone}
                                        className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isDone ? "Đã xong!" : currentStep.instruction}
                                    </button>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                );

            case 'calculating_total':
            case 'giving_change':
                const isTotalPhase = phase === 'calculating_total';
                const questionText = isTotalPhase ? `Tổng cộng là bao nhiêu xu?` : `${problem.order.payment} xu trừ ${problem.order.total} xu bằng mấy xu?`;
                const correctAnswer = isTotalPhase ? problem.order.total : problem.order.change;
                const options = generateOptions(correctAnswer);

                return (
                    <div className="w-full max-w-2xl flex flex-col items-center">
                        <h2 className="text-4xl font-bold text-purple-700 mb-4">{isTotalPhase ? "Tính tiền thôi!" : "Thối tiền cho khách nào!"}</h2>
                        <div className="flex justify-center gap-4 mb-4">
                            {problem.order.items.map(id => (
                                <div key={id} className="p-2 bg-white rounded-lg shadow-sm">
                                    <img src={MENU[id].steps.slice(-1)[0].imageUrl} alt={MENU[id].name} className="w-24 h-24 object-contain" />
                                    <p className="text-center font-bold text-purple-800">{MENU[id].price} xu</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-3xl font-semibold text-center text-pink-500 mb-6">{questionText}</p>
                         <div className="flex gap-6">
                            {options.map(opt => (
                                <button key={opt} onClick={() => handleMathAnswer(opt, isTotalPhase ? 'total' : 'change')} className="w-32 h-32 bg-sky-400 text-white font-bold text-6xl rounded-2xl shadow-lg transform hover:scale-110 transition-transform disabled:opacity-50">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'summary':
            case 'end_level':
                return (
                     <div className="text-center">
                        <Confetti />
                        <h2 className="text-6xl font-bold text-green-500 drop-shadow-lg mb-4">Giỏi lắm!</h2>
                        <p className="text-3xl text-purple-700 mb-8">Đã xong một khách! Bé có muốn phục vụ khách tiếp theo?</p>
                        <button onClick={handleNextProblem} className="bg-pink-500 text-white font-bold py-4 px-10 rounded-full text-3xl shadow-lg transform hover:scale-105 transition-transform">
                           Khách tiếp theo!
                        </button>
                    </div>
                );
            
            default: return null;
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4">
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
            `}</style>
             <div className="w-full bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-3xl shadow-xl p-6 relative min-h-[70vh] flex items-center justify-center">
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="absolute top-4 left-4 text-orange-600 hover:text-red-600 transition-colors z-10">
                    <HomeIcon className="w-12 h-12" />
                </button>
                 <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow-md">
                    <StarIcon className="w-8 h-8 mr-2" />
                    <span className="text-3xl">{score}</span>
                </div>
                {renderContent()}

                {feedback && feedback.isCorrect && <CorrectAnswerPopup message={feedback.message} />}
                {feedback && !feedback.isCorrect && <IncorrectFeedbackPopup message={feedback.message} />}
            </div>
        </div>
    );
};

export default StreetFoodGame;