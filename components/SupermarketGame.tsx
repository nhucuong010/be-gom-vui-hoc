
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HomeIcon, StarIcon, StorefrontIcon, CheckCircleIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import { supermarketItems, shoppers, categoryNames } from '../data/supermarketData';
import type { SupermarketItem } from '../types';

interface SupermarketGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

interface MovingItem {
    uid: number;
    item: SupermarketItem;
    x: number; // Percentage 
}

// Dragging state
interface DragState {
    item: MovingItem;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

interface BasketConfig {
    category: string;
    label: string;
    icon: string;
    color: string;
}

type GameMode = 'shopping' | 'scanning' | 'intro' | 'success';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// Cấu hình hiển thị cho từng loại
const CATEGORY_CONFIG: Record<string, { label: string, icon: string, color: string }> = {
    'fruit': { label: 'Trái Cây', icon: '🍎', color: 'bg-red-500 border-red-700 text-white' },
    'vegetable': { label: 'Rau Củ', icon: '🥦', color: 'bg-green-500 border-green-700 text-white' },
    'animal_product': { label: 'Sữa & Trứng', icon: '🥛', color: 'bg-blue-500 border-blue-700 text-white' },
    'prepared_food': { label: 'Bánh Kẹo', icon: '🍰', color: 'bg-pink-500 border-pink-700 text-white' },
    'drink': { label: 'Đồ Uống', icon: '🧃', color: 'bg-yellow-500 border-yellow-700 text-white' }
};

// Các cặp phân loại hợp lý cho bé
const SORTING_PAIRS = [
    ['fruit', 'vegetable'],        // Trái cây vs Rau củ
    ['prepared_food', 'drink'],    // Bánh kẹo vs Đồ uống
    ['animal_product', 'fruit'],   // Sữa trứng vs Trái cây
    ['vegetable', 'prepared_food'] // Rau củ vs Bánh kẹo
];

const SupermarketGame: React.FC<SupermarketGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [mode, setMode] = useState<GameMode>('intro');
    const [score, setScore] = useState(0);
    
    // Shopping State
    const [baskets, setBaskets] = useState<[BasketConfig, BasketConfig] | null>(null);
    const [collectedItems, setCollectedItems] = useState<SupermarketItem[]>([]);
    const [currentShopper, setCurrentShopper] = useState(shoppers[0]);
    const [beltItems, setBeltItems] = useState<MovingItem[]>([]);
    const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
    
    // Drag Drop State
    const [dragState, setDragState] = useState<DragState | null>(null);
    const leftBasketRef = useRef<HTMLDivElement>(null);
    const rightBasketRef = useRef<HTMLDivElement>(null);

    // Checkout/Scanning State
    const [scannedItems, setScannedItems] = useState<SupermarketItem[]>([]);
    const [currentTotal, setCurrentTotal] = useState(0);
    const [isScannerActive, setIsScannerActive] = useState(false);

    // Engine refs
    const requestRef = useRef<number>();
    const lastSpawnTime = useRef<number>(0);
    const uidCounter = useRef<number>(0);
    
    // --- CẤU HÌNH ---
    const BELT_SPEED = 0.15; 
    const SPAWN_INTERVAL = 3000; 
    const TARGET_COUNT = 6; // Tổng số món cần mua để qua màn

    // --- Logic: Start Shopping ---
    const startShopping = useCallback(() => {
        const randomShopper = shoppers[Math.floor(Math.random() * shoppers.length)];
        
        // Chọn ngẫu nhiên 1 cặp phân loại
        const pair = SORTING_PAIRS[Math.floor(Math.random() * SORTING_PAIRS.length)];
        const cat1 = pair[0];
        const cat2 = pair[1];

        // Ngẫu nhiên bên trái/phải
        const isSwapped = Math.random() > 0.5;
        const leftCat = isSwapped ? cat2 : cat1;
        const rightCat = isSwapped ? cat1 : cat2;

        setBaskets([
            { category: leftCat, ...CATEGORY_CONFIG[leftCat] },
            { category: rightCat, ...CATEGORY_CONFIG[rightCat] }
        ]);
        
        setCurrentShopper(randomShopper);
        setCollectedItems([]);
        setBeltItems([]);
        setScannedItems([]);
        setCurrentTotal(0);
        setMode('shopping');
        setDragState(null);

        const label1 = CATEGORY_CONFIG[leftCat].label;
        const label2 = CATEGORY_CONFIG[rightCat].label;
        
        // Đọc lời thoại hướng dẫn
        playDynamicSentence(`Gốm ơi, giúp ${randomShopper.name} phân loại ${label1} và ${label2} nhé!`, 'vi', isSoundOn, 'supermarket');

    }, [isSoundOn]);

    // --- Logic: Game Loop ---
    const updateGame = useCallback((time: number) => {
        if (mode !== 'shopping' || !baskets) return;

        // 1. Spawn Logic
        if (time - lastSpawnTime.current > SPAWN_INTERVAL) {
            // Chọn ngẫu nhiên món từ 1 trong 2 danh mục hiện tại hoặc nhiễu (ít hơn)
            const targetCats = [baskets[0].category, baskets[1].category];
            // 80% tỷ lệ ra món đúng loại cần tìm
            const randomCat = Math.random() < 0.8 
                ? targetCats[Math.floor(Math.random() * targetCats.length)]
                : Object.keys(CATEGORY_CONFIG)[Math.floor(Math.random() * Object.keys(CATEGORY_CONFIG).length)]; // 20% ra món bất kỳ (nhiễu)
            
            const possibleItems = supermarketItems.filter(i => i.category === randomCat);
            const itemToSpawn = possibleItems[Math.floor(Math.random() * possibleItems.length)];

            if (itemToSpawn) {
                const newItem: MovingItem = {
                    uid: uidCounter.current++,
                    item: itemToSpawn,
                    x: 110 // Bắt đầu ngoài bên phải
                };
                setBeltItems(prev => [...prev, newItem]);
            }
            lastSpawnTime.current = time;
        }

        // 2. Move Logic
        setBeltItems(prev => {
            const nextItems: MovingItem[] = [];
            prev.forEach(item => {
                if (dragState && dragState.item.uid === item.uid) return; // Item đang được kéo thì không di chuyển theo băng chuyền

                const nextX = item.x - BELT_SPEED;
                if (nextX > -20) nextItems.push({ ...item, x: nextX }); // Xóa item khi đi hết bên trái
            });
            return nextItems;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    }, [mode, baskets, dragState]);

    useEffect(() => {
        if (mode === 'shopping') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [mode, updateGame]);

    // --- Logic: Touch / Drag Events ---
    const handlePointerDown = (e: React.PointerEvent, movingItem: MovingItem) => {
        if (mode !== 'shopping') return;
        e.preventDefault();
        e.stopPropagation(); 
        
        // Xóa item khỏi băng chuyền ngay lập tức để bắt đầu kéo
        setBeltItems(prev => prev.filter(i => i.uid !== movingItem.uid));

        setDragState({
            item: movingItem,
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY
        });
        
        playDynamicSentence(movingItem.item.name, 'vi', isSoundOn, 'supermarket');
        playSound('click', isSoundOn);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState) return;
        e.preventDefault();
        setDragState(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!dragState || !baskets) return;
        e.preventDefault();

        const dropX = e.clientX;
        const dropY = e.clientY;

        // Kiểm tra va chạm với giỏ hàng
        const leftRect = leftBasketRef.current?.getBoundingClientRect();
        const rightRect = rightBasketRef.current?.getBoundingClientRect();

        let targetBasketIndex = -1; // -1: None, 0: Left, 1: Right

        // Xác định vùng thả là "lòng" xe đẩy (phần dưới của container)
        const isInRect = (rect: DOMRect, x: number, y: number) => {
            // Vùng thả rộng hơn một chút để dễ trúng
            return x >= rect.left && x <= rect.right && y >= rect.top + (rect.height * 0.2) && y <= rect.bottom;
        }

        if (leftRect && isInRect(leftRect, dropX, dropY)) {
            targetBasketIndex = 0;
        } else if (rightRect && isInRect(rightRect, dropX, dropY)) {
            targetBasketIndex = 1;
        }

        if (targetBasketIndex !== -1) {
            const targetCategory = baskets[targetBasketIndex].category;
            
            if (dragState.item.item.category === targetCategory) {
                // ĐÚNG: Thêm vào giỏ
                playSound('correct', isSoundOn);
                setCollectedItems(prev => {
                    const newItems = [...prev, dragState.item.item];
                    if (newItems.length >= TARGET_COUNT) {
                        playSound('win', isSoundOn);
                        setTimeout(() => startScanning(newItems), 1000);
                    }
                    return newItems;
                });
            } else {
                // SAI GIỎ
                playSound('incorrect', isSoundOn);
                const correctLabel = CATEGORY_CONFIG[dragState.item.item.category]?.label;
                // Nếu món đồ thuộc danh mục không có trong 2 giỏ hiện tại
                if (!correctLabel || (dragState.item.item.category !== baskets[0].category && dragState.item.item.category !== baskets[1].category)) {
                     setWrongFeedback(`Món này không cần mua con nhé!`);
                     playDynamicSentence(`Món này không có trong danh sách mua hàng!`, 'vi', isSoundOn, 'supermarket');
                } else {
                     setWrongFeedback(`Sai rồi! Để vào giỏ ${correctLabel} nhé!`);
                     playDynamicSentence(`Chưa đúng rồi, cái này là ${correctLabel} mà!`, 'vi', isSoundOn, 'supermarket');
                }
                
                setTimeout(() => setWrongFeedback(null), 2000);
            }
        } else {
            // Rơi ra ngoài -> Mất (hoặc trả về băng chuyền nếu muốn, nhưng ở đây cho mất luôn cho đơn giản)
            playSound('incorrect', isSoundOn);
        }

        setDragState(null);
    };


    // --- Logic: Scanning (Automated Checkout) ---
    const startScanning = (items: SupermarketItem[]) => {
        setMode('scanning');
        setScannedItems([]);
        setCurrentTotal(0);
        setIsScannerActive(true);
        playDynamicSentence("Đến quầy tính tiền thôi! Tít tít!", 'vi', isSoundOn, 'supermarket');

        // Automate scanning effect
        let currentIndex = 0;
        const scanInterval = setInterval(() => {
            if (currentIndex >= items.length) {
                clearInterval(scanInterval);
                setIsScannerActive(false);
                return;
            }

            const item = items[currentIndex];
            playSound('click', isSoundOn); // Beep sound replacement
            
            setScannedItems(prev => [...prev, item]);
            setCurrentTotal(prev => prev + item.price);
            currentIndex++;

        }, 1200); // Scan every 1.2s
    };

    const handlePayment = () => {
        playSound('correct', isSoundOn);
        onCorrectAnswer();
        setScore(s => s + 10);
        setMode('success');
        playSound('win', isSoundOn);
    };

    const handleNextLevel = () => {
        playSound('click', isSoundOn);
        startShopping();
    };

    return (
        <div 
            className="w-full h-screen overflow-hidden relative flex flex-col bg-[#E0F7FA] font-sans select-none touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30 pointer-events-none">
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="pointer-events-auto bg-white p-3 rounded-full shadow-lg text-sky-600 border-2 border-sky-100 transform active:scale-90 transition-transform hover:scale-110">
                    <HomeIcon className="w-8 h-8" />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border-2 border-sky-200 flex items-center gap-3 transform hover:scale-105 transition-transform">
                    <StarIcon className="w-8 h-8 text-yellow-400" />
                    <span className="text-3xl font-black text-sky-700">{score}</span>
                </div>
            </div>

            {/* --- PHASE 1: SHOPPING (SORTING) --- */}
            {mode === 'shopping' && baskets && (
                <div className="flex-grow relative flex flex-col h-full justify-between py-4">
                    {/* Background */}
                    <div 
                        className="absolute inset-0 opacity-70 bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: `url(${ASSET_BASE_URL}/assets/images/supermarket_bg.png)` }}
                    ></div>
                    
                    {/* --- TOP: INSTRUCTION & Shopper --- */}
                    <div className="relative z-20 flex justify-center pt-16 pointer-events-none">
                        <div className="bg-white/95 backdrop-blur px-6 py-3 rounded-full shadow-xl border-4 border-sky-300 flex items-center gap-4 animate-slide-down transform scale-90 sm:scale-100 max-w-[90%]">
                            <img src={currentShopper.imageUrl} className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-white object-cover shadow-md" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 font-bold text-xs uppercase">Nhiệm vụ:</span>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xl sm:text-2xl font-black text-purple-600">Mua {TARGET_COUNT} món</span>
                                    <div className="flex gap-1">
                                        {Array.from({length: TARGET_COUNT}).map((_, i) => (
                                            <div key={i} className={`w-4 h-4 rounded-full border-2 border-gray-300 ${i < collectedItems.length ? 'bg-green-500 border-green-600' : 'bg-gray-200' } transition-all duration-300`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MIDDLE: CONVEYOR BELT --- */}
                    <div className="relative z-10 flex-grow flex items-center justify-center w-full mt-4">
                        <div className="w-full h-40 sm:h-48 bg-[#546E7A] border-y-8 border-[#37474F] relative overflow-hidden shadow-2xl flex items-center">
                            {/* Moving Belt Texture */}
                            <div className="absolute inset-0 w-[200%] h-full flex animate-belt-scroll opacity-40 pointer-events-none">
                                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_99px,#263238_100px)]"></div>
                                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_99px,#263238_100px)]"></div>
                            </div>

                            {beltItems.map(item => (
                                <div
                                    key={item.uid}
                                    onPointerDown={(e) => handlePointerDown(e, item)}
                                    className="absolute top-1/2 -translate-y-1/2 transition-transform z-30 cursor-grab active:cursor-grabbing hover:scale-110 touch-none flex items-center justify-center"
                                    style={{ left: `${item.x}%` }}
                                >
                                    {/* Item Presentation: ROUNDED TOKEN - Beautiful style */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full border-[6px] border-white shadow-xl flex items-center justify-center relative overflow-hidden select-none group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/30 rounded-full"></div>
                                        <img src={item.item.imageUrl} className="w-[70%] h-[70%] object-contain drop-shadow-md transition-transform group-hover:scale-110" draggable={false} />
                                        <div className="absolute bottom-3 bg-yellow-300 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full shadow-sm border border-yellow-400">{item.item.price} xu</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- DRAGGED ITEM (Ghost) --- */}
                    {dragState && (
                        <div 
                            className="fixed z-[100] pointer-events-none touch-none flex items-center justify-center"
                            style={{ 
                                left: dragState.currentX, 
                                top: dragState.currentY,
                                transform: 'translate(-50%, -50%) scale(1.2)' 
                            }}
                        >
                             <div className="w-28 h-28 bg-white rounded-full border-[6px] border-green-400 shadow-2xl flex items-center justify-center relative overflow-hidden animate-pulse">
                                <img src={dragState.item.item.imageUrl} className="w-[75%] h-[75%] object-contain" />
                            </div>
                        </div>
                    )}

                    {/* --- BOTTOM: TWO CARTS --- */}
                    <div className="relative z-20 w-full flex justify-around items-end pb-4 px-2 gap-2 pointer-events-none">
                        {/* Basket 1 (Left) */}
                        <div ref={leftBasketRef} className="relative flex flex-col items-center group w-[45%] max-w-[280px]">
                            {/* Sign */}
                            <div className={`absolute -top-14 sm:-top-20 w-[90%] bg-white px-2 py-2 rounded-xl shadow-lg border-b-8 transform -rotate-3 z-30 flex flex-col items-center ${baskets[0].color}`}>
                                <span className="text-3xl sm:text-5xl drop-shadow-sm mb-1">{baskets[0].icon}</span>
                                <span className="font-black text-base sm:text-xl whitespace-nowrap">{baskets[0].label}</span>
                            </div>
                            
                            <div className="relative w-full aspect-square transition-transform duration-300">
                                {dragState && (
                                    <div className={`absolute inset-0 rounded-3xl opacity-20 animate-pulse z-0 ${baskets[0].category === dragState.item.item.category ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                )}
                                {/* Cart Image */}
                                <img src={`${ASSET_BASE_URL}/assets/images/supermarket_cart.png`} 
                                     onError={(e) => {e.currentTarget.src = `${ASSET_BASE_URL}/assets/images/supermarket_basket.png`}}
                                     className="absolute bottom-0 w-full h-auto object-contain drop-shadow-2xl z-10" 
                                />
                                {/* Items inside - Positioned ON TOP of the cart image (z-20) but aligned to look "inside" */}
                                <div className="absolute top-[20%] left-[15%] right-[10%] bottom-[30%] flex flex-wrap-reverse content-start justify-center gap-1 z-20 pointer-events-none overflow-visible">
                                    {collectedItems.filter(i => i.category === baskets[0].category).map((item, idx) => (
                                        <div key={idx} className="w-14 h-14 sm:w-20 sm:h-20 -ml-4 -mb-4 transition-all duration-300 animate-pop-in transform hover:scale-110 relative">
                                            <div className="w-full h-full bg-white rounded-full border-2 border-gray-300 shadow-md flex items-center justify-center overflow-hidden">
                                                <img src={item.imageUrl} className="w-[70%] h-[70%] object-contain" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Basket 2 (Right) */}
                        <div ref={rightBasketRef} className="relative flex flex-col items-center group w-[45%] max-w-[280px]">
                            {/* Sign */}
                            <div className={`absolute -top-14 sm:-top-20 w-[90%] bg-white px-2 py-2 rounded-xl shadow-lg border-b-8 transform rotate-3 z-30 flex flex-col items-center ${baskets[1].color}`}>
                                <span className="text-3xl sm:text-5xl drop-shadow-sm mb-1">{baskets[1].icon}</span>
                                <span className="font-black text-base sm:text-xl whitespace-nowrap">{baskets[1].label}</span>
                            </div>

                            <div className="relative w-full aspect-square transition-transform duration-300">
                                {dragState && (
                                    <div className={`absolute inset-0 rounded-3xl opacity-20 animate-pulse z-0 ${baskets[1].category === dragState.item.item.category ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                )}
                                <img src={`${ASSET_BASE_URL}/assets/images/supermarket_cart.png`} 
                                     onError={(e) => {e.currentTarget.src = `${ASSET_BASE_URL}/assets/images/supermarket_basket.png`}}
                                     className="absolute bottom-0 w-full h-auto object-contain drop-shadow-2xl z-10 transform scale-x-[-1]" 
                                />
                                 {/* Items inside */}
                                 <div className="absolute top-[20%] left-[10%] right-[15%] bottom-[30%] flex flex-wrap-reverse content-start justify-center gap-1 z-20 pointer-events-none overflow-visible">
                                    {collectedItems.filter(i => i.category === baskets[1].category).map((item, idx) => (
                                        <div key={idx} className="w-14 h-14 sm:w-20 sm:h-20 -ml-4 -mb-4 transition-all duration-300 animate-pop-in transform hover:scale-110 relative">
                                            <div className="w-full h-full bg-white rounded-full border-2 border-gray-300 shadow-md flex items-center justify-center overflow-hidden">
                                                <img src={item.imageUrl} className="w-[70%] h-[70%] object-contain" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {wrongFeedback && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl animate-bounce border-4 border-white whitespace-nowrap z-50 pointer-events-none">
                                {wrongFeedback}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PHASE 2: SCANNING (CHECKOUT) --- */}
            {mode === 'scanning' && (
                <div className="absolute inset-0 z-40 bg-white flex flex-col items-center justify-center p-4 animate-fade-in">
                    {/* Register and Scanner Visuals */}
                    <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center bg-gray-100 rounded-[3rem] shadow-inner border-8 border-gray-300 mb-8 overflow-hidden">
                        
                        {/* Conveyor Belt Moving */}
                        <div className="absolute bottom-0 w-full h-32 bg-gray-800 border-t-8 border-gray-600 flex items-center overflow-hidden">
                             <div className="w-[200%] h-full flex animate-belt-scroll opacity-20">
                                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,#ffffff_50px)]"></div>
                            </div>
                        </div>

                        {/* The Register Display */}
                        <div className="absolute top-6 right-6 bg-gray-900 p-4 rounded-xl border-4 border-gray-600 shadow-lg w-48 sm:w-64 z-20">
                            <div className="bg-green-900 h-16 sm:h-20 rounded-lg flex items-center justify-end px-4 font-mono text-green-400 text-3xl sm:text-4xl shadow-inner">
                                {currentTotal}
                            </div>
                            <p className="text-gray-400 text-right mt-2 text-xs sm:text-sm">TỔNG TIỀN (XU)</p>
                        </div>

                        {/* Scanned Items Stack */}
                        <div className="absolute top-6 left-6 flex flex-col-reverse gap-2 max-h-[300px] overflow-hidden w-48 sm:w-64 z-10">
                            {scannedItems.map((item, idx) => (
                                <div key={idx} className="bg-white p-2 rounded-lg shadow flex justify-between items-center animate-slide-right border border-gray-200">
                                    <span className="font-bold text-gray-700 truncate text-sm sm:text-base">{item.name}</span>
                                    <span className="font-mono text-purple-600 font-bold">{item.price}</span>
                                </div>
                            ))}
                        </div>

                        {/* Active Scanning Item Animation */}
                        {isScannerActive && (
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
                                <div className="w-1 h-24 bg-red-500 animate-pulse shadow-[0_0_15px_red] mb-2"></div>
                                <img src={`${ASSET_BASE_URL}/assets/images/supermarket_scanner.png`} className="w-24 sm:w-32 object-contain" />
                            </div>
                        )}
                        
                        {/* Current Item Passing By */}
                        {isScannerActive && scannedItems.length > 0 && (
                             <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-8 animate-pop-in z-20">
                                 <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center p-2">
                                     <img src={scannedItems[scannedItems.length - 1].imageUrl} className="w-full h-full object-contain" />
                                 </div>
                             </div>
                        )}

                    </div>

                    {/* Payment Button - Only Active when scanning done */}
                    <button 
                        onClick={handlePayment}
                        disabled={isScannerActive}
                        className={`px-12 sm:px-16 py-4 sm:py-6 rounded-full text-2xl sm:text-4xl font-black shadow-2xl transition-all transform
                            ${isScannerActive 
                                ? 'bg-gray-300 text-gray-500 cursor-wait' 
                                : 'bg-green-500 text-white hover:scale-105 hover:bg-green-400 animate-bounce'
                            }`}
                    >
                        {isScannerActive ? 'Đang tính tiền...' : 'Thanh Toán 💰'}
                    </button>
                </div>
            )}

            {/* --- PHASE 3: SUCCESS --- */}
            {mode === 'success' && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
                    <Confetti />
                    <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl text-center border-8 border-green-300 animate-pop-in max-w-2xl">
                        <div className="mb-8 text-8xl animate-bounce">🛍️</div>
                        <h2 className="text-5xl sm:text-6xl font-black text-purple-800 mb-6">Mua Xong Rồi!</h2>
                        <p className="text-2xl sm:text-3xl text-gray-600 mb-10 font-bold">Bé đi siêu thị giỏi quá!</p>
                        <div className="flex items-center justify-center gap-4 mb-8 bg-yellow-100 p-4 rounded-2xl">
                             <span className="text-xl sm:text-2xl text-gray-700">Tổng hóa đơn:</span>
                             <span className="text-4xl sm:text-5xl font-black text-green-600">{currentTotal} xu</span>
                        </div>
                        <button onClick={handleNextLevel} className="bg-pink-500 text-white font-bold py-4 sm:py-6 px-12 sm:px-16 rounded-full text-2xl sm:text-3xl shadow-xl hover:scale-105 transition-transform hover:shadow-2xl">
                            Đi tiếp nào ➡️
                        </button>
                    </div>
                </div>
            )}

            {/* --- PHASE 0: INTRO --- */}
            {mode === 'intro' && (
                <div className="absolute inset-0 z-50 bg-[#E0F7FA] flex items-center justify-center p-4">
                    <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl max-w-2xl text-center border-8 border-sky-300 animate-pop-in relative overflow-hidden">
                        <h2 className="text-5xl sm:text-6xl font-black text-purple-600 mb-6 tracking-tight drop-shadow-sm">Siêu Thị Vui Vẻ</h2>
                        <p className="text-xl sm:text-2xl text-gray-500 font-bold mb-10">Giúp mọi người mua sắm và phân loại hàng nhé!</p>
                        
                        <div className="flex justify-center gap-8 mb-12">
                            <img src={`${ASSET_BASE_URL}/assets/images/supermarket_cart.png`} className="w-32 h-32 object-contain animate-bounce-slow" />
                            <img src={`${ASSET_BASE_URL}/assets/images/supermarket_register.png`} className="w-32 h-32 object-contain animate-bounce-slow delay-100" />
                        </div>

                        <button onClick={startShopping} className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold py-4 sm:py-6 px-16 sm:px-20 rounded-full text-3xl sm:text-4xl shadow-xl hover:scale-105 transition-transform hover:shadow-2xl animate-pulse">
                            Vào Siêu Thị
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes belt-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(100px); } 
                }
                .animate-belt-scroll {
                    animation: belt-scroll 4s linear infinite;
                }
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes slide-down {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes slide-right {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-right { animation: slide-right 0.3s ease-out forwards; }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
            `}</style>
        </div>
    );
};

export default SupermarketGame;
