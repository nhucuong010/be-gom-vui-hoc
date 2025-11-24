import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateRestaurantProblem } from '../services/geminiService';
import type { RestaurantProblem, RestaurantCustomer, RestaurantOrder, RestaurantMenuItem } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, playDynamicSentence } from '../services/audioService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';

interface RestaurantGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

type GamePhase = 'level_select' | 'ordering' | 'serving' | 'summary' | 'loading';
interface ItemToServe {
    item: RestaurantMenuItem;
    customerId: string;
}

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// --- Helper Components ---
const IncorrectFeedbackPopup: React.FC<{ message: string; }> = ({ message }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
        <div className={`text-center p-8 sm:p-12 rounded-3xl shadow-2xl bg-red-400`}>
            <p className="text-4xl sm:text-5xl font-bold text-white">{message}</p>
        </div>
    </div>
);

const CustomerTable: React.FC<{ customer: RestaurantCustomer; isOrdering: boolean; order?: RestaurantOrder; }> = ({ customer, isOrdering, order }) => {
    return (
        <div className={`relative flex flex-col items-center transition-transform duration-300 ${isOrdering ? 'scale-110' : 'scale-100'}`}>
            {isOrdering && order && (
                <div className="absolute bottom-full mb-4 w-64 max-w-xs bg-gradient-to-br from-white to-gray-100 p-3 rounded-2xl shadow-xl border border-gray-200 animate-fade-in-down z-20">
                    <p className="text-xl font-bold text-purple-900 mb-2">{order.orderSentence}</p>
                    <div className="flex flex-col items-start gap-1">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-2 bg-white/60 p-1 rounded-lg w-full">
                                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-contain rounded-md bg-white p-1 shadow-sm" />
                                <span className="text-base font-bold text-gray-700">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-gray-100"></div>
                </div>
            )}
            <img src={customer.imageUrl} alt={customer.name} className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain drop-shadow-lg" />
            <p className={`mt-2 text-2xl sm:text-3xl font-bold px-4 py-1 rounded-full shadow-md transition-colors ${isOrdering ? 'bg-pink-500 text-white' : 'bg-white/70 text-purple-700'}`}>{customer.name}</p>
        </div>
    )
};


const RestaurantGame: React.FC<RestaurantGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [phase, setPhase] = useState<GamePhase>('level_select');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState<RestaurantProblem | null>(null);

    // State for game flow
    const [orderingCustomerIndex, setOrderingCustomerIndex] = useState<number | null>(null);
    const [showOrder, setShowOrder] = useState(false);
    const [itemsToServe, setItemsToServe] = useState<ItemToServe[]>([]);
    const [servingItemIndex, setServingItemIndex] = useState(0);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);


    const startLevel = useCallback(async (selectedLevel: number) => {
        playSound('click', isSoundOn);
        setLevel(selectedLevel);
        setPhase('loading');
        setProblem(null);
        setFeedback(null);
        try {
            const newProblem = await generateRestaurantProblem(selectedLevel);
            setProblem(newProblem);
            setOrderingCustomerIndex(0);
            setPhase('ordering');
        } catch (error) {
            console.error("Failed to start level:", error);
            setPhase('level_select');
        }
    }, [isSoundOn]);

    // Effect to manage the ordering sequence
    useEffect(() => {
        if (phase !== 'ordering' || problem === null || orderingCustomerIndex === null) {
            return;
        }

        if (orderingCustomerIndex >= problem.orders.length) {
            const allItems = problem.orders.flatMap(order =>
                order.items.map(item => ({ item, customerId: order.customerId }))
            );
            setItemsToServe(allItems.sort(() => 0.5 - Math.random()));
            setServingItemIndex(0);
            setPhase('serving');
            return;
        }
        
        // Play intro sound for the first customer
        if (orderingCustomerIndex === 0) {
            playDynamicSentence('Khách đang gọi món...', 'vi', isSoundOn, 'restaurant');
        }

        const currentOrder = problem.orders[orderingCustomerIndex];
        // Delay longer for the first customer to let the intro sound play
        const orderTimeout = setTimeout(() => {
            setShowOrder(true);
            playDynamicSentence(currentOrder.orderSentence, 'vi', isSoundOn, 'restaurant');

            const hideTimeout = setTimeout(() => {
                setShowOrder(false);
                const nextCustomerTimeout = setTimeout(() => {
                    setOrderingCustomerIndex(prev => (prev !== null ? prev + 1 : 0));
                }, 1000);
                return () => clearTimeout(nextCustomerTimeout);
            }, 4000);
            return () => clearTimeout(hideTimeout);
        }, orderingCustomerIndex === 0 ? 2000 : 500);

        return () => clearTimeout(orderTimeout);
    }, [phase, problem, orderingCustomerIndex, isSoundOn]);
    
    // Effect to play sound when serving phase starts
    useEffect(() => {
        if (phase === 'serving') {
            playDynamicSentence('Bé phục vụ món nào!', 'vi', isSoundOn, 'restaurant');
        }
    }, [phase, isSoundOn]);


    const handleServeChoice = async (selectedCustomerId: string) => {
        if (feedback || !problem || itemsToServe.length === 0) return;
        playSound('click', isSoundOn);

        const currentItem = itemsToServe[servingItemIndex];
        const isCorrect = selectedCustomerId === currentItem.customerId;

        if (isCorrect) {
            onCorrectAnswer();
            setScore(prev => prev + 1);
            setFeedback({ isCorrect: true, message: "Đúng rồi!" });

            setTimeout(() => {
                setFeedback(null);
                if (servingItemIndex >= itemsToServe.length - 1) {
                    setPhase('summary');
                    playSound('win', isSoundOn);
                    playDynamicSentence('Con giỏi quá! Bé đã phục vụ đúng hết tất cả các món!', 'vi', isSoundOn, 'restaurant');
                } else {
                    setServingItemIndex(prev => prev + 1);
                }
            }, 1200);
        } else {
            setFeedback({ isCorrect: false, message: "Thử lại nhé!" });
            playDynamicSentence('Chưa đúng rồi, con nhớ lại xem!', 'vi', isSoundOn, 'restaurant');
            setTimeout(() => {
                setFeedback(null);
            }, 1200);
        }
    };

    const renderContent = () => {
        switch (phase) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto"></div>
                        <p className="mt-4 text-2xl text-white font-semibold">Đang chuẩn bị nhà hàng...</p>
                    </div>
                );

            case 'ordering':
                if (!problem) return null;
                return (
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-16" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.7)' }}>Khách đang gọi món...</h2>
                        <div className="flex flex-wrap justify-center items-end w-full gap-x-6 gap-y-10 md:gap-x-12">
                            {problem.customers.map((customer) => {
                                const order = problem.orders.find(o => o.customerId === customer.id);
                                const isOrdering = showOrder && orderingCustomerIndex !== null && problem.orders[orderingCustomerIndex]?.customerId === customer.id;
                                return (
                                    <CustomerTable
                                        key={customer.id}
                                        customer={customer}
                                        isOrdering={isOrdering}
                                        order={order}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );

            case 'serving':
                if (!problem || itemsToServe.length === 0) return null;
                const currentItemToServe = itemsToServe[servingItemIndex];
                if (!currentItemToServe) return null;

                return (
                    <div className="w-full flex flex-col items-center animate-fade-in">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Bé phục vụ món nào!</h2>
                        <p className="text-xl sm:text-2xl text-yellow-200 mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Ai là người đã gọi...</p>

                        <div className="my-4 p-3 bg-white rounded-2xl shadow-lg">
                            <img src={currentItemToServe.item.imageUrl} alt={currentItemToServe.item.name} className="w-40 h-40 sm:w-56 sm:h-56 object-contain" />
                            <p className="text-center text-2xl sm:text-3xl font-bold text-purple-800 mt-2">{currentItemToServe.item.name}</p>
                        </div>

                        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mt-4">
                            {problem.customers.map(customer => (
                                <button
                                    key={customer.id}
                                    onClick={() => handleServeChoice(customer.id)}
                                    disabled={!!feedback}
                                    className="flex flex-col items-center gap-2 bg-white p-2 sm:p-3 rounded-2xl shadow-lg transform hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
                                >
                                    <img src={customer.imageUrl} alt={customer.name} className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
                                    <p className="text-lg sm:text-xl font-semibold text-purple-700">{customer.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            
            case 'summary':
                return (
                    <div className="text-center">
                        <Confetti />
                        <h2 className="text-4xl sm:text-6xl font-bold text-green-400 drop-shadow-lg mb-4">Con giỏi quá!</h2>
                        <p className="text-xl sm:text-3xl text-white mb-8">Bé đã phục vụ đúng hết tất cả các món!</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                            <button onClick={() => startLevel(level)} className="bg-sky-500 text-white font-bold py-3 px-6 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform">Chơi lại màn này</button>
                            <button onClick={() => setPhase('level_select')} className="bg-pink-500 text-white font-bold py-3 px-6 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-transform">Chọn cấp độ khác</button>
                        </div>
                    </div>
                );

            case 'level_select':
            default:
                return (
                    <div className="text-center flex flex-col items-center">
                        <h1 
                            className="text-5xl sm:text-7xl font-black text-white mb-4" 
                            style={{ fontFamily: "'Nunito', sans-serif", textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}
                        >
                            Nhà Hàng Gốm
                        </h1>
                        <p className="text-xl sm:text-2xl text-yellow-200 mb-10 font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                            Con muốn thử thách ở cấp độ nào?
                        </p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                            <button 
                                onClick={() => startLevel(1)} 
                                className="group relative w-64 bg-gradient-to-br from-green-500 to-teal-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg text-3xl transform hover:scale-105 transition-transform duration-300 ease-in-out border-4 border-white/50 hover:border-white"
                            >
                                <span className="z-10 relative">Dễ (2 khách)</span>
                                <div className="absolute inset-0 bg-black/10 rounded-xl group-hover:bg-black/20 transition-colors"></div>
                            </button>
                            <button 
                                onClick={() => startLevel(2)} 
                                className="group relative w-64 bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg text-3xl transform hover:scale-105 transition-transform duration-300 ease-in-out border-4 border-white/50 hover:border-white"
                            >
                                <span className="z-10 relative">Thường (3 khách)</span>
                                <div className="absolute inset-0 bg-black/10 rounded-xl group-hover:bg-black/20 transition-colors"></div>
                            </button>
                            <button 
                                onClick={() => startLevel(3)} 
                                className="group relative w-64 bg-gradient-to-br from-red-600 to-rose-700 text-white font-bold py-5 px-8 rounded-2xl shadow-lg text-3xl transform hover:scale-105 transition-transform duration-300 ease-in-out border-4 border-white/50 hover:border-white"
                            >
                                <span className="z-10 relative">Khó (4 khách)</span>
                                <div className="absolute inset-0 bg-black/10 rounded-xl group-hover:bg-black/20 transition-colors"></div>
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                 @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out forwards;
                }
            `}</style>
            <div 
                className="w-full bg-cover bg-center rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 relative flex items-center justify-center"
                style={{ 
                    backgroundImage: `url(${ASSET_BASE_URL}/assets/images/covers/restaurant_game_cover.jpeg)`,
                    minHeight: '85vh' 
                }}
            >
                <div className="absolute inset-0 bg-black/40 rounded-3xl z-0"></div>

                <button onClick={onGoHome} className="absolute top-4 left-4 text-white hover:text-yellow-300 transition-colors z-30">
                    <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
                </button>
                <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-full shadow-md z-30">
                    <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" />
                    <span className="text-2xl sm:text-3xl">{score}</span>
                </div>
                
                <div className="relative z-10 w-full">
                    {renderContent()}
                </div>

                {feedback && feedback.isCorrect && <CorrectAnswerPopup message={feedback.message} />}
                {feedback && !feedback.isCorrect && <IncorrectFeedbackPopup message={feedback.message} />}
            </div>
        </div>
    );
};

export default RestaurantGame;