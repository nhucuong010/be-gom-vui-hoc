
import React, { useState, useEffect, useRef } from 'react';
import { HomeIcon, StarIcon, CheckCircleIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';

// --- Types ---
interface OnlineItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface OnlineShoppingGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

type Phase = 'intro' | 'browsing' | 'shipping' | 'unboxing' | 'invoice' | 'success';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

const ITEMS: OnlineItem[] = [
    { id: 'teddy', name: 'Gấu Bông Hồng', price: 3, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_teddy.png` },
    { id: 'doll', name: 'Búp Bê Xinh Xắn', price: 4, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_doll.png` },
    { id: 'schoolbag', name: 'Cặp Sách Hồng', price: 4, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_schoolbag.png` },
    { id: 'crayons', name: 'Hộp Bút Màu', price: 2, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_crayons.png` },
    { id: 'hairclip', name: 'Kẹp Tóc Xinh', price: 1, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_hairclip.png` },
    { id: 'dress', name: 'Váy Công Chúa', price: 5, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_dress.png` },
    { id: 'notebook', name: 'Vở Tập Tô', price: 1, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_notebook.png` },
    { id: 'pencilcase', name: 'Hộp Đựng Bút', price: 2, imageUrl: `${ASSET_BASE_URL}/assets/images/muasam/os_item_pencil_case.png` },
    { id: 'hat', name: 'Mũ Điệu Đà', price: 3, imageUrl: `${ASSET_BASE_URL}/assets/images/hat.png` },
    { id: 'shoes', name: 'Giày Búp Bê', price: 4, imageUrl: `${ASSET_BASE_URL}/assets/images/shoes.png` },
    { id: 'pillow', name: 'Gối Ôm Mềm', price: 2, imageUrl: `${ASSET_BASE_URL}/assets/images/english/english_cushion.png` },
    { id: 'guitar', name: 'Đàn Đồ Chơi', price: 5, imageUrl: `${ASSET_BASE_URL}/assets/images/english/english_guitar.png` },
];

// Helper visual component for coins
const CoinDisplay: React.FC<{ count: number, size?: 'sm' | 'md' }> = ({ count, size = 'sm' }) => {
    // Increased sizes for better visibility for kids
    const sizeClass = size === 'sm' ? 'w-10 h-10 text-lg border-b-4' : 'w-14 h-14 text-2xl border-b-4';
    return (
        <div className="flex flex-wrap gap-2 mt-1 justify-end max-w-[240px]">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`${sizeClass} bg-yellow-400 rounded-full border-yellow-600 shadow-md flex items-center justify-center font-black text-yellow-900 animate-pop-in transform hover:scale-110 transition-transform`} style={{ animationDelay: `${i * 0.1}s` }}>
                    $
                </div>
            ))}
        </div>
    );
};

const OnlineShoppingGame: React.FC<OnlineShoppingGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [phase, setPhase] = useState<Phase>('intro');
    const [cart, setCart] = useState<OnlineItem[]>([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);
    const [displayItems, setDisplayItems] = useState<OnlineItem[]>([]);
    
    // Animation state for flying items
    const [animatingItem, setAnimatingItem] = useState<OnlineItem | null>(null);

    // Audio Sequence Controller
    const isSpeakingRef = useRef(false);

    useEffect(() => {
        // Shuffle items on load
        setDisplayItems([...ITEMS].sort(() => 0.5 - Math.random()));
        // Initial audio trigger handled by the phase effect below
    }, []);

    // Centralized Audio Sequencer to prevent overlapping
    const runPhaseAudio = async (currentPhase: Phase) => {
        if (isSpeakingRef.current) return; // Simple lock
        isSpeakingRef.current = true;
        stopAllSounds(); // Stop previous sounds

        try {
            if (currentPhase === 'intro') {
                await playDynamicSentence("Gốm ơi, lên mạng mua quà nào!", 'vi', isSoundOn, 'online_shopping');
                await new Promise(r => setTimeout(r, 500));
                setPhase('browsing');
                await playDynamicSentence("Con hãy chọn 2 món đồ chơi nhé.", 'vi', isSoundOn, 'online_shopping');
            } 
            else if (currentPhase === 'shipping') {
                await playDynamicSentence("Alo, Gốm ơi! Chú shipper đến rồi.", 'vi', isSoundOn, 'online_shopping');
            } 
            else if (currentPhase === 'unboxing') {
                await playDynamicSentence("Giao hàng cho bé Gốm đây! Con hãy mở hộp ra nhé!", 'vi', isSoundOn, 'online_shopping');
            }
            else if (currentPhase === 'invoice') {
                await playDynamicSentence("Gốm ơi, ra nhận hàng và thanh toán tiền cho chú nhé!", 'vi', isSoundOn, 'online_shopping');
                await new Promise(r => setTimeout(r, 800));
                await playDynamicSentence("Con tính xem hết bao nhiêu tiền?", 'vi', isSoundOn, 'online_shopping');
            }
            else if (currentPhase === 'success') {
                await playDynamicSentence("Cảm ơn shop! Hàng đẹp quá.", 'vi', isSoundOn, 'online_shopping');
            }
        } catch (e) {
            console.error("Audio sequence error", e);
        } finally {
            isSpeakingRef.current = false;
        }
    };

    // Trigger audio when phase changes
    useEffect(() => {
        // Browsing audio is handled inside the 'intro' sequence in runPhaseAudio to ensure flow
        if (phase !== 'browsing') {
            runPhaseAudio(phase);
        }
    }, [phase]);


    const handleAddToCart = (item: OnlineItem) => {
        if (cart.length >= 2) return;
        
        // Visual effect
        setAnimatingItem(item);
        playSound('click', isSoundOn);
        
        // Speak item name (non-blocking)
        playDynamicSentence(item.name, 'vi', isSoundOn, 'online_shopping');

        setTimeout(() => {
            setCart(prev => [...prev, item]);
            setAnimatingItem(null);
        }, 600); // Wait for animation
    };

    const handleRemoveFromCart = (index: number) => {
        playSound('click', isSoundOn);
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const handlePlaceOrder = () => {
        if (cart.length < 2) return;
        playSound('correct', isSoundOn);
        setPhase('shipping');
    };

    const handleShippingDone = () => {
        setPhase('unboxing');
    };

    const handleOpenBox = () => {
        playSound('dice-roll', isSoundOn); // Sound effect for shaking/opening
        setPhase('invoice');
        playSound('win', isSoundOn); // Ta-da sound
    };

    const handlePayment = (selectedTotal: number) => {
        const actualTotal = cart.reduce((sum, item) => sum + item.price, 0);
        if (selectedTotal === actualTotal) {
            playSound('correct', isSoundOn);
            setFeedback({ isCorrect: true, message: "Đúng rồi!" });
            onCorrectAnswer();
            setScore(s => s + 1);
            
            setTimeout(() => {
                setFeedback(null); // Hide the feedback popup
                setPhase('success');
                playSound('win', isSoundOn);
            }, 1000);
        } else {
            playSound('incorrect', isSoundOn);
            setFeedback({ isCorrect: false, message: "Thử lại nhé!" });
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const handleNext = () => {
        playSound('click', isSoundOn);
        setCart([]);
        setDisplayItems([...ITEMS].sort(() => 0.5 - Math.random()));
        setFeedback(null);
        // Reset to intro to replay the flow
        setPhase('intro');
    };

    const generateOptions = (total: number) => {
        const opts = new Set<number>([total]);
        while (opts.size < 3) {
            const offset = Math.floor(Math.random() * 5) - 2;
            const val = total + offset;
            if (val > 0 && val !== total && val <= 10) opts.add(val);
        }
        return Array.from(opts).sort(() => 0.5 - Math.random());
    };

    // --- RENDERERS ---

    const renderBrowsing = () => (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl relative animate-fade-in">
            {/* Tablet Frame */}
            <div className="relative bg-gray-800 p-3 md:p-6 rounded-[2.5rem] shadow-2xl w-full aspect-[3/4] md:aspect-[16/10] border-4 border-gray-600 ring-4 ring-gray-300">
                {/* Screen */}
                <div className="absolute inset-3 md:inset-6 bg-gray-50 rounded-2xl overflow-hidden flex flex-col">
                    {/* App Header */}
                    <div className="bg-pink-500 p-3 md:p-4 flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-500 font-bold">G</div>
                            <span className="text-white font-black text-xl md:text-2xl tracking-tight">Gốm Shop</span>
                        </div>
                        <div className="bg-white/20 px-4 py-1 rounded-full text-white font-bold text-sm backdrop-blur-sm border border-white/30">
                            Giỏ: {cart.length}/2
                        </div>
                    </div>
                    
                    {/* Content Grid */}
                    <div className="flex-grow bg-gray-50 p-3 md:p-5 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 content-start">
                        {displayItems.map(item => {
                            const inCartCount = cart.filter(c => c.id === item.id).length;
                            const isAnimating = animatingItem?.id === item.id;
                            
                            return (
                                <button 
                                    key={item.id} 
                                    onClick={() => handleAddToCart(item)}
                                    disabled={cart.length >= 2 || isAnimating}
                                    className={`bg-white p-2 rounded-xl shadow-sm border-2 flex flex-col items-center relative transition-all active:scale-95 hover:shadow-md
                                        ${inCartCount > 0 ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-pink-300'}
                                    `}
                                >
                                    {/* Flying Animation Clone */}
                                    {isAnimating && (
                                        <img 
                                            src={item.imageUrl} 
                                            className="fixed z-50 w-24 h-24 object-contain transition-all duration-500 ease-in-out"
                                            style={{ 
                                                top: '50%', 
                                                left: '50%',
                                                transform: 'translate(-50%, -50%) scale(0.1)',
                                                opacity: 0
                                            }}
                                        />
                                    )}

                                    <div className="w-full aspect-square flex items-center justify-center mb-2 bg-gray-50 rounded-lg p-2">
                                        <img src={item.imageUrl} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                                    </div>
                                    <span className="font-bold text-gray-700 text-xs md:text-sm line-clamp-1">{item.name}</span>
                                    <div className="flex items-center gap-1 mt-1 bg-yellow-100 px-2 py-0.5 rounded-md">
                                        <span className="text-orange-600 font-black text-sm">{item.price}</span>
                                        <span className="text-[10px] text-orange-600">xu</span>
                                    </div>
                                    {inCartCount > 0 && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm animate-pop-in">✓</div>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Bottom Bar (Cart) */}
                    <div className="bg-white border-t border-gray-200 p-3 flex justify-between items-center h-20 md:h-24 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                        <div className="flex gap-3 overflow-x-auto flex-1 items-center px-2">
                            {cart.length === 0 && <span className="text-gray-400 italic text-sm animate-pulse">Chọn 2 món đồ chơi...</span>}
                            {cart.map((item, idx) => (
                                <div key={idx} className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg border-2 border-pink-200 flex-shrink-0 flex items-center justify-center shadow-sm animate-pop-in">
                                    <img src={item.imageUrl} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(idx); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm hover:bg-red-600"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={cart.length < 2}
                            className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg transition-all transform flex items-center gap-2
                                ${cart.length < 2 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 hover:shadow-orange-300/50 animate-pulse'}
                            `}
                        >
                            <span>Đặt hàng</span>
                            <span>🚀</span>
                        </button>
                    </div>
                </div>
                {/* Home Button */}
                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full opacity-50"></div>
            </div>
        </div>
    );

    const renderShipping = () => (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative bg-sky-100 rounded-3xl border-4 border-sky-300">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-50"></div>
            
            {/* Road */}
            <div className="absolute bottom-0 w-full h-40 bg-[#8d6e63] border-t-8 border-[#5d4037] flex items-center justify-center">
                 <div className="w-full border-t-4 border-dashed border-white/50 mt-1"></div>
            </div>
            
            {/* Background Elements */}
            <div className="absolute top-10 left-10 text-6xl animate-float-cloud opacity-80">☁️</div>
            <div className="absolute top-24 right-20 text-5xl animate-float-cloud-reverse opacity-60">☁️</div>
            
            {/* House (Destination) */}
            <div className="absolute bottom-20 right-[-2rem] md:right-4 z-10 transition-transform">
                 <img src={`${ASSET_BASE_URL}/assets/images/muasam/os_house_door.png`} className="w-64 md:w-80 object-contain drop-shadow-2xl" />
            </div>

            {/* Shipper Animation */}
            <div 
                className="absolute bottom-24 left-[-20%] z-20 animate-drive-in"
                onAnimationEnd={handleShippingDone}
            >
                <img src={`${ASSET_BASE_URL}/assets/images/muasam/os_shipper.png`} className="w-56 md:w-72 object-contain drop-shadow-2xl" />
                <div className="absolute -right-4 top-0 bg-white px-3 py-1 rounded-xl shadow-md animate-bounce border-2 border-orange-400">
                    📦 Giao hàng!
                </div>
                {/* Dust effect */}
                <div className="absolute bottom-0 right-0 text-2xl text-gray-400 animate-pulse">💨</div>
            </div>

            <style>{`
                @keyframes drive-in {
                    0% { left: -20%; }
                    70% { left: 40%; }
                    100% { left: 120%; } 
                }
                .animate-drive-in {
                    animation: drive-in 4s ease-in-out forwards;
                }
                @keyframes float-cloud {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(20px); }
                    100% { transform: translateX(0); }
                }
                .animate-float-cloud { animation: float-cloud 5s infinite ease-in-out; }
                .animate-float-cloud-reverse { animation: float-cloud 5s infinite ease-in-out reverse; }
            `}</style>
        </div>
    );

    const renderUnboxing = () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50 rounded-3xl border-4 border-orange-200 p-4 relative animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-8 animate-bounce">Hàng đến rồi! Mở thôi!</h2>
            <button 
                onClick={handleOpenBox}
                className="relative group transform transition-transform hover:scale-105 active:scale-95"
            >
                <img src={`${ASSET_BASE_URL}/assets/images/muasam/os_package.png`} className="w-64 h-64 object-contain drop-shadow-2xl animate-shake" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ✨
                </div>
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-bold px-6 py-2 rounded-full shadow-lg animate-pulse whitespace-nowrap">
                    Chạm để mở hộp
                </div>
            </button>
            
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }
                .animate-shake { animation: shake 0.5s infinite; }
            `}</style>
        </div>
    );

    const renderInvoice = () => {
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-purple-50 rounded-3xl border-4 border-purple-200 p-4 relative animate-pop-in">
                <Confetti />
                
                {/* Invoice */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-purple-400 w-full max-w-lg mb-8 relative">
                    {/* Zigzag bottom */}
                    <div className="absolute -bottom-2 left-0 w-full h-4 bg-purple-50" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
                    
                    <h3 className="text-center font-black text-2xl text-purple-800 mb-4 uppercase tracking-widest border-b-2 border-purple-100 pb-2">Hóa Đơn</h3>
                    
                    <div className="space-y-4">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                     <img src={item.imageUrl} className="w-16 h-16 object-contain bg-white rounded-lg p-1 border border-gray-200" />
                                     <span className="text-gray-700 font-bold text-lg">{item.name}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-orange-600 font-black text-xl">{item.price} xu</span>
                                    <CoinDisplay count={item.price} size="md" />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t-2 border-dashed border-gray-300 mt-4 pt-3 flex justify-between items-center">
                        <span className="text-xl font-black text-gray-800">TỔNG CỘNG:</span>
                        <div className="bg-gray-100 w-20 h-10 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-purple-700 mb-4">Con trả bao nhiêu xu?</h3>
                <div className="grid grid-cols-3 gap-6">
                    {generateOptions(total).map(opt => (
                        <button
                            key={opt}
                            onClick={() => handlePayment(opt)}
                            className="w-20 h-20 rounded-full bg-yellow-400 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-3xl font-black text-yellow-900 shadow-xl hover:bg-yellow-300 hover:scale-110"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const renderSuccess = () => {
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white/90 rounded-3xl animate-pop-in p-6">
                <Confetti />
                <div className="text-8xl mb-4 animate-bounce">🛍️</div>
                <h2 className="text-5xl font-black text-green-500 mb-6 drop-shadow-sm text-center">Mua Hàng Thành Công!</h2>
                
                <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200 mb-8 text-center w-full max-w-xs">
                    <p className="text-gray-600 font-bold mb-2 uppercase tracking-wide">Tổng thiệt hại</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-6xl font-black text-orange-500">{total}</span>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold text-orange-400">xu</span>
                            <div className="w-12 h-12 bg-yellow-400 rounded-full border-b-4 border-yellow-600 flex items-center justify-center text-xl font-bold text-yellow-900">$</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mb-10">
                    {cart.map((item, idx) => (
                        <div key={idx} className="w-24 h-24 bg-white rounded-2xl shadow-lg border-2 border-gray-100 flex items-center justify-center p-2 animate-bounce-slow" style={{ animationDelay: `${idx * 0.2}s` }}>
                            <img src={item.imageUrl} className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
                <button onClick={handleNext} className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-xl hover:scale-105 transition-transform hover:shadow-2xl">
                    Mua tiếp nào! 🛒
                </button>
            </div>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4 h-screen max-h-screen">
            <div className="w-full bg-white/80 backdrop-blur-sm rounded-[3rem] shadow-2xl p-4 relative flex-grow flex flex-col items-center justify-center overflow-hidden border-8 border-purple-100">
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="absolute top-6 left-6 z-50 bg-white p-3 rounded-full shadow-lg text-purple-500 hover:scale-110 transition-transform">
                    <HomeIcon className="w-8 h-8" />
                </button>
                <div className="absolute top-6 right-6 z-50 flex items-center bg-yellow-400 text-white px-6 py-2 rounded-full shadow-lg border-2 border-white">
                    <StarIcon className="w-6 h-6 mr-2" />
                    <span className="text-2xl font-black">{score}</span>
                </div>

                {phase === 'browsing' && renderBrowsing()}
                {phase === 'shipping' && renderShipping()}
                {phase === 'unboxing' && renderUnboxing()}
                {phase === 'invoice' && renderInvoice()}
                {phase === 'success' && renderSuccess()}
                {phase === 'intro' && <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>}

                {feedback && feedback.isCorrect && <CorrectAnswerPopup message={feedback.message} />}
            </div>
             <style>{`
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.5s ease-out; }
            `}</style>
        </div>
    );
};

export default OnlineShoppingGame;
