
import React, { useState, useEffect, useCallback } from 'react';
import type { StreetFoodProblem, StreetFoodMenuItem, StreetFoodCookingStep } from '../types';
import { HomeIcon, StarIcon, CheckCircleIcon, FoodBowlIcon } from './icons';
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
// Added 'serving' phase
type GamePhase = 'ordering' | 'cooking' | 'serving' | 'calculating_total' | 'giving_change' | 'summary' | 'loading' | 'end_level';

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

// Component hiển thị từng trạm nấu ăn
const CookingStation: React.FC<{ 
    item: StreetFoodMenuItem; 
    progress: number; 
    onStep: () => void; 
    isSoundOn: boolean;
}> = ({ item, progress, onStep, isSoundOn }) => {
    const currentStep = item.steps[progress];
    const totalSteps = item.steps.length;
    const isDone = progress >= totalSteps - 1;
    const progressPercent = ((progress + 1) / totalSteps) * 100;

    // Tự động đọc hướng dẫn khi bước thay đổi
    useEffect(() => {
        if (!isDone && currentStep) {
            // Delay một chút để không bị chồng âm thanh click
            const timer = setTimeout(() => {
                playDynamicSentence(currentStep.instruction, 'vi', isSoundOn, 'street_food');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [progress, isDone, currentStep, isSoundOn]);

    return (
        <div className="flex flex-col items-center bg-white rounded-3xl shadow-xl overflow-hidden w-72 transform transition-all hover:scale-105 border-4 border-orange-200">
            {/* Header tên món */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 w-full py-3 text-center shadow-md relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-md">{item.name}</h3>
            </div>

            {/* Hình ảnh món ăn */}
            <div className="w-full h-56 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-orange-50 flex items-center justify-center relative p-4">
                <img 
                    src={currentStep.imageUrl} 
                    alt={currentStep.instruction} 
                    className={`max-w-full max-h-full object-contain transition-all duration-300 ${isDone ? 'scale-110 drop-shadow-2xl' : 'drop-shadow-lg'}`} 
                />
                {isDone && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center animate-fade-in">
                        <div className="bg-green-500 text-white p-2 rounded-full shadow-xl transform scale-125">
                             <CheckCircleIcon className="w-16 h-16" />
                        </div>
                    </div>
                )}
            </div>

            {/* Thanh tiến độ */}
            <div className="w-full bg-gray-200 h-3 border-t border-b border-gray-300">
                <div 
                    className="bg-green-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,197,94,0.6)]" 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            {/* Nút hành động */}
            <div className="p-4 w-full bg-white">
                <button
                    onClick={onStep}
                    disabled={isDone}
                    className={`w-full font-bold py-4 px-4 rounded-2xl text-xl shadow-[0_4px_0_rgb(0,0,0,0.2)] transition-all active:shadow-none active:translate-y-1 flex items-center justify-center gap-2
                        ${isDone 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border-2 border-gray-200' 
                            : 'bg-gradient-to-b from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400 border-b-4 border-orange-700 animate-pulse-slow'
                        }`}
                >
                    {isDone ? (
                        <span className="flex items-center gap-2">Hoàn thành <StarIcon className="w-5 h-5 text-yellow-500"/></span>
                    ) : (
                        <>
                            <span className="text-2xl">👨‍🍳</span>
                            <span>{currentStep.instruction}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Component hóa đơn
const Receipt: React.FC<{ items: string[], total: number }> = ({ items, total }) => {
    return (
        <div className="bg-white p-6 rounded-sm shadow-xl w-80 border-t-8 border-b-8 border-t-gray-200 border-b-gray-200 relative mx-auto transform rotate-1 animate-slide-up">
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Hóa Đơn</h3>
                <p className="text-gray-500 font-serif italic">Tiệm Gốm Ngon Tuyệt</p>
            </div>
            <div className="space-y-3 mb-6">
                {items.map((itemId, idx) => {
                    const item = MENU[itemId as keyof typeof MENU];
                    return (
                        <div key={`${itemId}-${idx}`} className="flex justify-between items-center text-xl border-b border-dotted border-gray-200 pb-1">
                            <span className="text-gray-700 font-bold">{item.name}</span>
                            <span className="text-gray-900 font-mono">{item.price} xu</span>
                        </div>
                    );
                })}
            </div>
            <div className="border-t-4 border-double border-gray-300 pt-4 flex justify-between items-center bg-yellow-50 p-2 rounded-lg">
                <span className="text-xl font-black text-purple-800 uppercase">TỔNG CỘNG</span>
                <span className="text-3xl font-black text-red-600 font-mono">{total} xu</span>
            </div>
            {/* Răng cưa hóa đơn */}
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-white" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
        </div>
    );
};

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
        // Randomize the problem from the bank to ensure variety
        const randomIndex = Math.floor(Math.random() * problemBank.length);
        const newProblem = problemBank[randomIndex]; 
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
        startLevel(0); // Start initially
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
        // Logic for new phases
        if (phase === 'serving') {
            playDynamicSentence("Đồ ăn nóng hổi đây ạ! Chúc quý khách ngon miệng!", 'vi', isSoundOn, 'street_food');
            setTimeout(() => {
                 // Sau khi phục vụ, khách hỏi tính tiền
                 playDynamicSentence("Ngon quá! Hết bao nhiêu tiền vậy Gốm?", 'vi', isSoundOn, 'street_food');
                 setTimeout(() => setPhase('calculating_total'), 3500);
            }, 3500);
        } else if (phase === 'calculating_total') {
            playDynamicSentence("Tổng cộng là bao nhiêu xu?", 'vi', isSoundOn, 'street_food');
        } else if (phase === 'giving_change' && problem) {
            const question = `${problem.order.payment} xu trừ ${problem.order.total} xu bằng mấy xu?`;
            playDynamicSentence(question, 'vi', isSoundOn, 'street_food');
        }
    }, [phase, problem, isSoundOn]);


    const handleCookingStep = (itemId: keyof typeof MENU) => {
        playSound('click', isSoundOn);
        const newProgress = { ...cookingProgress };
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
            // Thay đổi: Chuyển sang phase Serving thay vì tính tiền ngay
            setTimeout(() => setPhase('serving'), 1000);
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
                    <div className="flex flex-col items-center justify-center h-full pt-24">
                        <div className={`relative transition-transform duration-500 ${showOrder ? 'scale-110 translate-y-0' : 'scale-100 translate-y-10'}`}>
                            {showOrder && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 bg-white p-6 rounded-[2rem] shadow-2xl z-20 animate-pop-in border-4 border-purple-200">
                                    <p className="text-2xl font-bold text-purple-900 text-center leading-relaxed">{problem.order.orderText}</p>
                                    <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] border-t-white"></div>
                                </div>
                            )}
                            <img src={problem.order.customerImageUrl} alt={problem.order.customerName} className="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-2xl" />
                        </div>
                         <div className="mt-6 bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg border-2 border-purple-300">
                            <p className="text-4xl font-black text-purple-700">{problem.order.customerName}</p>
                         </div>
                    </div>
                );
            
            case 'cooking':
                return (
                    <div className="w-full flex flex-col items-center">
                        {/* Bếp Trưởng Gốm Image */}
                        <div className="relative mb-4 animate-bounce-slow">
                            <img src={`${ASSET_BASE_URL}/assets/images/sf_chef_gom.png`} alt="Bếp trưởng Gốm" className="w-40 h-40 object-contain drop-shadow-xl" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 drop-shadow-md bg-orange-500 px-8 py-2 rounded-full shadow-lg border-4 border-white">BẾP TRƯỞNG GỐM 🍳</h2>
                        <div className="flex flex-wrap justify-center items-start gap-8 w-full">
                           {problem.order.items.map((itemId, index) => {
                                const item = MENU[itemId];
                                const currentStepIndex = cookingProgress[itemId];
                                
                                return (
                                    <CookingStation 
                                        key={`${itemId}-${index}`}
                                        item={item}
                                        progress={currentStepIndex}
                                        onStep={() => handleCookingStep(itemId)}
                                        isSoundOn={isSoundOn}
                                    />
                                )
                            })}
                        </div>
                    </div>
                );

            case 'serving':
                return (
                    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                        <h2 className="text-4xl font-bold text-white drop-shadow-md mb-8">Mời khách dùng bữa nào!</h2>
                        
                        <div className="flex items-end justify-center gap-4">
                            {/* Gốm bưng bê */}
                            <div className="relative animate-slide-right">
                                <img src={`${ASSET_BASE_URL}/assets/images/gom-sac.png`} className="w-48 h-48 object-contain" alt="Gốm" />
                                <div className="absolute -right-10 top-1/2 bg-white p-2 rounded-xl shadow-md animate-bounce">
                                    <FoodBowlIcon className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>

                            {/* Khách hàng */}
                            <div className="relative">
                                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-2xl shadow-lg whitespace-nowrap animate-pop-in delay-1000">
                                    <p className="text-xl font-bold text-purple-700">Woa! Ngon quá!</p>
                                    <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white"></div>
                                </div>
                                <img src={problem.order.customerImageUrl} className="w-56 h-56 object-contain drop-shadow-2xl" alt="Khách" />
                            </div>
                        </div>
                    </div>
                );

            case 'calculating_total':
                return (
                    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4">
                        <div className="flex flex-col items-center animate-fade-in-left">
                            <div className="bg-white px-6 py-3 rounded-full shadow-lg mb-6 border-2 border-purple-100">
                                <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                                    <span>📝</span> Tính tiền cho {problem.order.customerName}
                                </h2>
                            </div>
                            <Receipt items={problem.order.items} total={problem.order.total} />
                        </div>
                        
                        <div className="flex flex-col items-center gap-6 animate-fade-in-right">
                            <div className="bg-orange-500 px-8 py-4 rounded-3xl shadow-xl transform -rotate-2">
                                <p className="text-3xl font-bold text-white drop-shadow-md">Tổng cộng là bao nhiêu?</p>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {generateOptions(problem.order.total).map(opt => (
                                    <button 
                                        key={opt} 
                                        onClick={() => handleMathAnswer(opt, 'total')} 
                                        className="w-28 h-28 rounded-full bg-yellow-400 border-b-8 border-yellow-600 shadow-xl hover:translate-y-1 hover:border-b-4 hover:shadow-md transition-all flex items-center justify-center text-5xl font-black text-yellow-900"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'giving_change':
                return (
                    <div className="w-full max-w-4xl flex flex-col items-center">
                        <div className="w-full bg-white/95 backdrop-blur-sm p-8 rounded-[3rem] shadow-2xl border-4 border-green-200 mb-10 flex flex-col md:flex-row items-center justify-around gap-8 transform hover:scale-105 transition-transform duration-500">
                            <div className="text-center group">
                                <p className="text-gray-500 font-bold text-xl uppercase mb-2 group-hover:text-green-600 transition-colors">Khách đưa</p>
                                <div className="bg-green-100 text-green-800 text-6xl font-black px-8 py-4 rounded-2xl shadow-inner border-2 border-green-300">
                                    {problem.order.payment}
                                </div>
                            </div>
                            <div className="text-7xl text-gray-300 font-black">-</div>
                            <div className="text-center group">
                                <p className="text-gray-500 font-bold text-xl uppercase mb-2 group-hover:text-red-600 transition-colors">Giá tiền</p>
                                <div className="bg-red-100 text-red-800 text-6xl font-black px-8 py-4 rounded-2xl shadow-inner border-2 border-red-300">
                                    {problem.order.total}
                                </div>
                            </div>
                            <div className="text-7xl text-gray-300 font-black">=</div>
                            <div className="text-center">
                                <p className="text-gray-500 font-bold text-xl uppercase mb-2">Tiền thừa</p>
                                <div className="bg-yellow-100 text-yellow-800 text-6xl font-black px-8 py-4 rounded-2xl shadow-inner border-2 border-yellow-300 animate-pulse">
                                    ?
                                </div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-black text-white mb-8 drop-shadow-md bg-purple-500 px-8 py-3 rounded-full shadow-lg">Thối lại bao nhiêu xu?</h2>
                        
                        <div className="grid grid-cols-3 gap-8">
                            {generateOptions(problem.order.change).map(opt => (
                                <button 
                                    key={opt} 
                                    onClick={() => handleMathAnswer(opt, 'change')} 
                                    className="w-32 h-32 rounded-full bg-yellow-400 border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center text-6xl font-black text-yellow-900 shadow-2xl hover:bg-yellow-300"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'summary':
            case 'end_level':
                return (
                     <div className="text-center bg-white/95 p-12 rounded-[3rem] shadow-2xl border-8 border-yellow-300 animate-pop-in max-w-3xl">
                        <Confetti />
                        <div className="mb-8 animate-bounce-slow">
                            <span className="text-9xl">🌟</span>
                        </div>
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500 mb-4">Tuyệt Vời!</h2>
                        <p className="text-3xl text-gray-700 font-bold mb-10">Bé đã phục vụ khách hàng rất tốt!</p>
                        <button onClick={handleNextProblem} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-6 px-16 rounded-full text-4xl shadow-xl transform hover:scale-105 transition-transform hover:shadow-2xl flex items-center gap-4 mx-auto">
                           <span>Khách tiếp theo</span>
                           <span className="text-5xl">➡️</span>
                        </button>
                    </div>
                );
            
            default: return null;
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center p-4">
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
                
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    70% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

                @keyframes fade-in-left {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-left { animation: fade-in-left 0.6s ease-out forwards; }

                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right { animation: fade-in-right 0.6s ease-out forwards; }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 2s infinite; }

                @keyframes slide-up {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

                @keyframes slide-right {
                    from { transform: translateX(-50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-right { animation: slide-right 0.7s ease-out forwards; }
            `}</style>
             <div className="w-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] bg-orange-50 rounded-[3rem] shadow-2xl p-6 relative min-h-[80vh] flex items-center justify-center overflow-hidden border-[10px] border-orange-200">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/90 to-orange-100/90 pointer-events-none"></div>
                
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="absolute top-6 left-6 text-orange-600 hover:text-red-600 transition-colors z-10 bg-white p-4 rounded-full shadow-lg hover:scale-110 transform">
                    <HomeIcon className="w-12 h-12" />
                </button>
                 <div className="absolute top-6 right-6 flex items-center bg-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-lg border-4 border-white z-10 transform hover:scale-105 transition-transform">
                    <StarIcon className="w-10 h-10 mr-3 text-yellow-100" />
                    <span className="text-5xl drop-shadow-sm">{score}</span>
                </div>
                
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    {renderContent()}
                </div>

                {feedback && feedback.isCorrect && <CorrectAnswerPopup message={feedback.message} />}
                {feedback && !feedback.isCorrect && <IncorrectFeedbackPopup message={feedback.message} />}
            </div>
        </div>
    );
};

export default StreetFoodGame;
