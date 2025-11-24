
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Sticker } from '../types';
import { HomeIcon, TrashIcon, CameraIcon, LightBulbIcon, ArrowPathIcon, ArrowsPointingOutIcon, PencilIcon, ArrowUturnLeftIcon } from './icons';
import { playSound, playDynamicSentence } from '../services/audioService';

interface StickerBookProps {
    unlockedStickers: Sticker[];
    allStickerNames: { id: string; name: string }[];
    onGoHome: () => void;
    isSoundOn: boolean;
}

interface PlacedSticker {
    uid: number;
    stickerId: string;
    x: number; // % left relative to canvas
    y: number; // % top relative to canvas
    scale: number;
    isFlipped: boolean;
    zIndex: number;
}

interface DrawingPath {
    d: string; // SVG Path data
    color: string;
    strokeWidth: number;
}

interface SceneConfig {
    id: string;
    name: string;
    type: 'image' | 'css';
    bgValue: string;
    hintText: string;
    textColor: string;
}

// Cấu hình danh mục
const CATEGORIES = [
    { id: 'family', label: 'Gia Đình', icon: '👨‍👩‍👧' },
    { id: 'learning', label: 'Học Tập', icon: '💯' },
    { id: 'animal', label: 'Động Vật', icon: '🐶' },
    { id: 'food', label: 'Đồ Ăn', icon: '🍔' },
    { id: 'nature', label: 'Thiên Nhiên', icon: '🌳' },
    { id: 'object', label: 'Đồ Vật', icon: '🧸' },
    { id: 'transport', label: 'Xe Cộ', icon: '🚗' },
    { id: 'other', label: 'Khác', icon: '✨' },
];

// Drawing Colors
const DRAWING_COLORS = [
    { id: 'black', value: '#000000' },
    { id: 'red', value: '#ef4444' },
    { id: 'blue', value: '#3b82f6' },
    { id: 'green', value: '#22c55e' },
    { id: 'yellow', value: '#eab308' },
    { id: 'purple', value: '#a855f7' },
    { id: 'white', value: '#ffffff' },
];

// Cấu hình bối cảnh
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';
const SCENES: SceneConfig[] = [
    { id: 'paper', name: 'Giấy Trắng', type: 'css', bgValue: 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]', hintText: 'Bé hãy kéo hình lên giấy để vẽ chuyện nhé!', textColor: 'text-gray-800' },
    { id: 'road', name: 'Đường Phố', type: 'css', bgValue: 'bg-gray-300 bg-[linear-gradient(#374151_0px,transparent_1px)] [background-size:100%_100px] border-b-8 border-gray-600', hintText: 'Xe cộ đi trên đường phố tấp nập.', textColor: 'text-gray-800' },
    { id: 'lined_paper', name: 'Tập Viết', type: 'css', bgValue: 'bg-white bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] [background-size:100%_32px] border-l-8 border-red-200', hintText: 'Bé tập viết chữ và số nhé!', textColor: 'text-blue-800' },
    { id: 'chalkboard', name: 'Bảng Đen', type: 'css', bgValue: 'bg-[#2f3e46] border-8 border-[#5c4033]', hintText: 'Lớp học vui vẻ, bé hãy dán hình lên bảng nhé!', textColor: 'text-white' },
    { id: 'sky', name: 'Bầu Trời', type: 'css', bgValue: 'bg-gradient-to-b from-sky-300 to-sky-100', hintText: 'Trên bầu trời xanh có gì bay lượn thế nhỉ?', textColor: 'text-blue-900' },
    { id: 'space', name: 'Vũ Trụ', type: 'css', bgValue: 'bg-gray-900 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]', hintText: 'Phi hành gia Gốm đang bay vào vũ trụ bao la!', textColor: 'text-yellow-200' },
    { id: 'farm', name: 'Nông Trại', type: 'image', bgValue: `${ASSET_BASE_URL}/assets/images/gm_scene_farm.png`, hintText: 'Bé hãy kể chuyện về các bạn thú ở nông trại nhé!', textColor: 'text-green-900' },
    { id: 'ocean', name: 'Đại Dương', type: 'image', bgValue: `${ASSET_BASE_URL}/assets/images/gm_scene_sea.png`, hintText: 'Dưới đáy biển xanh có những ai đang bơi lội thế nhỉ?', textColor: 'text-blue-900' },
    { id: 'stage', name: 'Sân Khấu', type: 'image', bgValue: `${ASSET_BASE_URL}/assets/images/gm_scene_party.png`, hintText: 'Bé hãy sắp xếp các nhân vật để biểu diễn văn nghệ nhé!', textColor: 'text-purple-900' },
    { id: 'room', name: 'Phòng Bé', type: 'image', bgValue: `${ASSET_BASE_URL}/assets/images/gm_scene_playroom.png`, hintText: 'Cùng dọn dẹp và trang trí phòng nào.', textColor: 'text-gray-800' },
    { id: 'forest', name: 'Khu Rừng', type: 'image', bgValue: `${ASSET_BASE_URL}/assets/images/gm_scene_forest.png`, hintText: 'Trong rừng có sóc và nấm đấy.', textColor: 'text-white' },
];

const StickerBook: React.FC<StickerBookProps> = ({ unlockedStickers, onGoHome, isSoundOn }) => {
    // --- State ---
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
    const [selectedStickerUid, setSelectedStickerUid] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('family');
    const [isFlash, setIsFlash] = useState(false);

    // Drawing State
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [paths, setPaths] = useState<DrawingPath[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [drawingColor, setDrawingColor] = useState<string>('#000000');
    const [isDrawing, setIsDrawing] = useState(false);

    // Dragging from Drawer State
    const [drawerDragItem, setDrawerDragItem] = useState<{ sticker: Sticker, startX: number, startY: number, currentX: number, currentY: number, isDragging: boolean } | null>(null);

    // Dragging / Resizing on Canvas State
    const [canvasDragMode, setCanvasDragMode] = useState<'move' | 'scale' | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number, y: number, initialParam: { x: number, y: number } | number } | null>(null);

    // Refs
    const canvasRef = useRef<HTMLDivElement>(null);
    const uniqueIdCounter = useRef(0);
    const maxZIndex = useRef(10);

    const currentScene = SCENES[currentSceneIndex];

    // Categorization Logic
    const categorizedStickers = useMemo(() => {
        const cats: Record<string, Sticker[]> = { family: [], learning: [], animal: [], food: [], nature: [], object: [], transport: [], other: [] };
        unlockedStickers.forEach(s => {
            const id = s.id.toLowerCase();
            const name = s.name.toLowerCase();
            const text = id + ' ' + name;
            
            const isFamily = ['ba', 'me', 'gom', 'gao', 'ong', 'anh', 'chi', 'em', 'doctor', 'nurse', 'police', 'farmer', 'teacher', 'chef', 'astronaut', 'firefighter', 'customer', 'princess', 'prince', 'person', 'nguoi', 'shopper', 'shipper', 'co giao', 'bac si', 'chu cong an'].some(k => text.includes(k)) && !text.includes('bear');
            const isLearning = ['num_', 'math_', 'shape_', 'operator', 'dau ', 'so ', 'hinh ', 'img_num', 'img_char'].some(k => text.includes(k));
            const isAnimal = ['cat', 'dog', 'fish', 'bird', 'lion', 'tiger', 'bee', 'ant', 'tho', 'ga', 'vit', 'cow', 'pig', 'sheep', 'horse', 'bear', 'penguin', 'frog', 'butterfly', 'capy', 'snail', 'spider', 'shark', 'whale', 'dolphin', 'octopus', 'seahorse', 'turtle', 'jellyfish', 'starfish', 'monkey', 'zebra', 'snake', 'hippo', 'crocodile', 'dinosaur', 'chim', 'ca', 'gau', 'meo', 'cho', 'caterpillar', 'cocoon', 'tadpole', 'cua'].some(k => text.includes(k));
            const isFood = ['apple', 'banana', 'cake', 'bread', 'milk', 'egg', 'water', 'ice', 'cream', 'pizza', 'juice', 'grape', 'cookie', 'candy', 'donut', 'popcorn', 'fries', 'hotdog', 'banhmi', 'pasta', 'soup', 'rice', 'carrot', 'corn', 'mushroom', 'broccoli', 'strawberry', 'orange', 'cheese', 'sausage', 'yogurt', 'thit', 'rau', 'cu', 'qua', 'trai', 'banh', 'sugar', 'che', 'tra', 'sinh to', 'tao pho', 'nuoc'].some(k => text.includes(k));
            const isNature = ['tree', 'flower', 'sun', 'moon', 'star', 'cloud', 'rain', 'mountain', 'river', 'sea', 'rock', 'grass', 'leaf', 'volcano', 'desert', 'forest', 'garden', 'cay', 'hoa', 'la', 'mat troi', 'may', 'wind', 'thunder', 'rainbow', 'sprout', 'roots', 'seed', 'cave', 'nest', 'web'].some(k => text.includes(k)) && !isLearning; // Avoid overlap with shapes like star
            const isTransport = ['car', 'bus', 'bike', 'train', 'plane', 'ship', 'boat', 'truck', 'motorcycle', 'helicopter', 'submarine', 'rocket', 'ambulance', 'xe', 'tau', 'may bay', 'duong', 'sky', 'road'].some(k => text.includes(k));
            const isObject = ['toy', 'ball', 'book', 'chair', 'table', 'bed', 'lamp', 'pencil', 'pen', 'crayon', 'bag', 'hat', 'shoe', 'sock', 'shirt', 'pants', 'dress', 'glass', 'cup', 'plate', 'spoon', 'fork', 'knife', 'box', 'gift', 'balloon', 'kite', 'drum', 'piano', 'guitar', 'violin', 'robot', 'doll', 'teddy', 'ban', 'ghe', 'den', 'umbrella', 'raincoat', 'scarf', 'jacket', 'pinwheel', 'trash', 'bottle', 'switch', 'tap', 'magnet', 'nails', 'scale', 'stethoscope', 'telescope', 'palette', 'money', 'coin'].some(k => text.includes(k)) && !isLearning;

            if (isLearning) cats.learning.push(s);
            else if (isFamily) cats.family.push(s);
            else if (isAnimal) cats.animal.push(s);
            else if (isFood) cats.food.push(s);
            else if (isNature) cats.nature.push(s);
            else if (isTransport) cats.transport.push(s);
            else if (isObject) cats.object.push(s);
            else cats.other.push(s);
        });
        return cats;
    }, [unlockedStickers]);

    useEffect(() => {
        playDynamicSentence("Chào mừng bé đến với Studio Sáng Tạo! Bé hãy chạm vào hình để thêm nhé!", 'vi', isSoundOn);
    }, [isSoundOn]);

    // --- Helpers ---
    const addStickerToCanvas = (sticker: Sticker, x: number = 50, y: number = 50) => {
        const newSticker: PlacedSticker = {
            uid: uniqueIdCounter.current++,
            stickerId: sticker.id,
            x, y,
            scale: 1,
            isFlipped: false,
            zIndex: ++maxZIndex.current,
        };
        setPlacedStickers(prev => [...prev, newSticker]);
        setSelectedStickerUid(newSticker.uid);
        playSound('correct', isSoundOn);
        playDynamicSentence(sticker.name, 'vi', isSoundOn);
    };

    // --- Handlers: Drawer Interaction (Click to Add & Drag start) ---

    const handleDrawerItemPointerDown = (e: React.PointerEvent, sticker: Sticker) => {
        if (isDrawingMode) return;
        
        // Start tracking potential drag or click
        setDrawerDragItem({
            sticker,
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
            isDragging: false
        });
    };

    // --- Handlers: Canvas Interaction ---

    const handleCanvasPointerDown = (e: React.PointerEvent) => {
        if (isDrawingMode) {
            e.preventDefault();
            e.stopPropagation();
            setIsDrawing(true);
            
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setCurrentPath(`M ${x} ${y}`);
            }
            return;
        }
        // Deselect if clicking background
        setSelectedStickerUid(null);
    };

    const handleStickerDown = (e: React.PointerEvent, uid: number, mode: 'move' | 'scale') => {
        if (isDrawingMode) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        if (selectedStickerUid !== uid) {
            setSelectedStickerUid(uid);
            setPlacedStickers(prev => prev.map(s => s.uid === uid ? { ...s, zIndex: ++maxZIndex.current } : s));
        }

        const sticker = placedStickers.find(s => s.uid === uid);
        if (!sticker) return;

        setCanvasDragMode(mode);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            initialParam: mode === 'move' ? { x: sticker.x, y: sticker.y } : sticker.scale
        });
    };

    // --- Global Handlers ---

    const handlePointerMove = (e: React.PointerEvent) => {
        // 1. Drawing
        if (isDrawingMode && isDrawing && canvasRef.current) {
            e.preventDefault();
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setCurrentPath(prev => `${prev} L ${x} ${y}`);
            return;
        }

        // 2. Drawer Dragging logic
        if (drawerDragItem) {
            if (!drawerDragItem.isDragging) {
                // Check if user moved enough to consider it a move intent
                const dist = Math.sqrt(Math.pow(e.clientX - drawerDragItem.startX, 2) + Math.pow(e.clientY - drawerDragItem.startY, 2));
                
                if (dist > 5) {
                    // Check movement direction. 
                    const deltaY = e.clientY - drawerDragItem.startY;
                    const deltaX = e.clientX - drawerDragItem.startX;
                    
                    // If moving UP significantly (negative Y) more than horizontal, start dragging out
                    if (deltaY < -10 && Math.abs(deltaY) > Math.abs(deltaX)) {
                        setDrawerDragItem(prev => prev ? { ...prev, isDragging: true } : null);
                    }
                    // Else if moving horizontally, it's likely a scroll, so do nothing and let browser scroll
                }
            }

            if (drawerDragItem.isDragging) {
                e.preventDefault(); // Stop scrolling/default if we are dragging the ghost
                setDrawerDragItem(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
            }
            return;
        }

        // 3. Canvas Item Dragging/Scaling
        if (canvasDragMode && dragStart && selectedStickerUid !== null && canvasRef.current) {
            e.preventDefault();
            const rect = canvasRef.current.getBoundingClientRect();
            
            if (canvasDragMode === 'move') {
                const deltaXPixels = e.clientX - dragStart.x;
                const deltaYPixels = e.clientY - dragStart.y;
                
                const deltaXPercent = (deltaXPixels / rect.width) * 100;
                const deltaYPercent = (deltaYPixels / rect.height) * 100;
                
                const initialPos = dragStart.initialParam as { x: number, y: number };

                setPlacedStickers(prev => prev.map(s => 
                    s.uid === selectedStickerUid 
                        ? { ...s, x: initialPos.x + deltaXPercent, y: initialPos.y + deltaYPercent } 
                        : s
                ));
            } else if (canvasDragMode === 'scale') {
                const deltaX = e.clientX - dragStart.x;
                const initialScale = dragStart.initialParam as number;
                const scaleChange = deltaX * 0.005; 
                const newScale = Math.max(0.3, Math.min(3.0, initialScale + scaleChange));

                setPlacedStickers(prev => prev.map(s =>
                    s.uid === selectedStickerUid ? { ...s, scale: newScale } : s
                ));
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        // End Drawing
        if (isDrawingMode && isDrawing) {
            setIsDrawing(false);
            if (currentPath.length > 10) { 
                setPaths(prev => [...prev, { d: currentPath, color: drawingColor, strokeWidth: 5 }]);
            }
            setCurrentPath('');
            return;
        }

        // End Drawer Interaction
        if (drawerDragItem) {
            if (drawerDragItem.isDragging && canvasRef.current) {
                // Dropped!
                const rect = canvasRef.current.getBoundingClientRect();
                const isOverCanvas = 
                    e.clientX >= rect.left && 
                    e.clientX <= rect.right && 
                    e.clientY >= rect.top && 
                    e.clientY <= rect.bottom;

                if (isOverCanvas) {
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    addStickerToCanvas(drawerDragItem.sticker, x, y);
                }
            } else {
                // Was not dragging (or drag threshold not met), check if it was just a tap/click
                // To prevent accidental adds while scrolling, we check distance again
                const dist = Math.sqrt(Math.pow(e.clientX - drawerDragItem.startX, 2) + Math.pow(e.clientY - drawerDragItem.startY, 2));
                if (dist < 10) {
                    // Consider as Click -> Add to center
                    addStickerToCanvas(drawerDragItem.sticker);
                }
            }
            setDrawerDragItem(null);
        }

        // End Canvas Drag
        if (canvasDragMode) {
            setCanvasDragMode(null);
            setDragStart(null);
        }
    };

    // --- Actions ---
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedStickerUid === null) return;
        playSound('incorrect', isSoundOn);
        setPlacedStickers(prev => prev.filter(s => s.uid !== selectedStickerUid));
        setSelectedStickerUid(null);
    };

    const handleFlip = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedStickerUid === null) return;
        playSound('click', isSoundOn);
        setPlacedStickers(prev => prev.map(s => 
            s.uid === selectedStickerUid ? { ...s, isFlipped: !s.isFlipped } : s
        ));
    };

    const handleSnapshot = () => {
        playSound('win', isSoundOn);
        setIsFlash(true);
        setTimeout(() => setIsFlash(false), 300);
        playDynamicSentence("Tác phẩm tuyệt vời!", 'vi', isSoundOn);
        setSelectedStickerUid(null);
    };

    const toggleDrawingMode = () => {
        playSound('click', isSoundOn);
        setIsDrawingMode(prev => !prev);
        setSelectedStickerUid(null);
    };

    const handleUndoDrawing = () => {
        playSound('click', isSoundOn);
        setPaths(prev => prev.slice(0, -1));
    };

    const handleClearDrawings = () => {
        playSound('incorrect', isSoundOn);
        setPaths([]);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] w-full h-[100dvh] flex flex-col bg-gray-200 overflow-hidden select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {/* --- Top Bar --- */}
            <div className="flex-shrink-0 h-14 sm:h-16 bg-white shadow-sm flex items-center justify-between px-4 z-30 border-b border-gray-200">
                <button onClick={onGoHome} className="p-2 rounded-full hover:bg-gray-100 border border-gray-300 text-gray-600">
                    <HomeIcon className="w-6 h-6" />
                </button>
                
                {/* Scenes (Scrollable) - Add touch-pan-x */}
                <div className="flex overflow-x-auto gap-2 px-4 scrollbar-hide mask-gradient max-w-[40%] md:max-w-[60%] touch-pan-x">
                    {SCENES.map((scene, idx) => (
                        <button
                            key={scene.id}
                            onClick={() => { playSound('click', isSoundOn); setCurrentSceneIndex(idx); }}
                            className={`w-10 h-10 rounded-lg border-2 overflow-hidden transition-transform shrink-0 ${currentSceneIndex === idx ? 'border-purple-500 scale-110 ring-2 ring-purple-200' : 'border-gray-300'}`}
                        >
                            {scene.type === 'image' ? <img src={scene.bgValue} className="w-full h-full object-cover" /> : <div className={`w-full h-full ${scene.bgValue}`}></div>}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={toggleDrawingMode} 
                        className={`p-2 rounded-full shadow-sm transition-all ${isDrawingMode ? 'bg-yellow-400 text-white ring-4 ring-yellow-200 scale-110' : 'bg-gray-100 text-gray-600'}`}
                    >
                        <PencilIcon className="w-6 h-6" />
                    </button>
                    {!isDrawingMode && <button onClick={() => playDynamicSentence(currentScene.hintText, 'vi', isSoundOn)} className="p-2 text-yellow-600 bg-yellow-50 rounded-full shadow-sm"><LightBulbIcon className="w-6 h-6" /></button>}
                    <button onClick={handleSnapshot} className="p-2 text-blue-600 bg-blue-50 rounded-full shadow-sm"><CameraIcon className="w-6 h-6" /></button>
                </div>
            </div>

            {/* --- Drawing Toolbar --- */}
            {isDrawingMode && (
                <div className="flex-shrink-0 bg-yellow-50 py-2 px-4 flex items-center justify-between border-b border-yellow-200 animate-slide-down shadow-inner z-20">
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 touch-pan-x">
                        {DRAWING_COLORS.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => { playSound('click', isSoundOn); setDrawingColor(color.value); }}
                                className={`w-8 h-8 rounded-full border-2 shadow-sm shrink-0 transition-transform ${drawingColor === color.value ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                                style={{ backgroundColor: color.value, borderColor: '#e5e7eb' }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleUndoDrawing} className="p-2 bg-white text-gray-600 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"><ArrowUturnLeftIcon className="w-5 h-5" /></button>
                        <button onClick={handleClearDrawings} className="p-2 bg-white text-red-500 rounded-full shadow-sm border border-gray-200 hover:bg-red-50"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            )}

            {/* --- Canvas Container --- */}
            {/* Add touch-none to prevent scrolling while interacting with canvas */}
            <div className="flex-grow min-h-0 relative p-2 sm:p-4 flex items-center justify-center bg-gray-100 touch-none">
                <div 
                    ref={canvasRef}
                    onPointerDown={handleCanvasPointerDown}
                    className={`relative w-auto h-auto max-w-full max-h-full aspect-[4/3] md:aspect-video shadow-2xl rounded-xl overflow-hidden bg-white transition-all ${currentScene.type === 'css' ? currentScene.bgValue : 'bg-cover bg-center'} ${isDrawingMode ? 'cursor-crosshair' : ''}`}
                    style={currentScene.type === 'image' ? { backgroundImage: `url(${currentScene.bgValue})` } : {}}
                >
                    <div className={`absolute inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-300 ${isFlash ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    {/* Drawing Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                        {paths.map((path, index) => (
                            <path key={index} d={path.d} stroke={path.color} strokeWidth={path.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        ))}
                        {isDrawing && <path d={currentPath} stroke={drawingColor} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                    </svg>

                    {/* Sticker Layer */}
                    {placedStickers.map(s => {
                        const data = unlockedStickers.find(k => k.id === s.stickerId);
                        if (!data) return null;
                        const isSelected = s.uid === selectedStickerUid;

                        return (
                            <div
                                key={s.uid}
                                onPointerDown={(e) => handleStickerDown(e, s.uid, 'move')}
                                className={`absolute flex items-center justify-center group cursor-move ${isDrawingMode ? 'pointer-events-none opacity-90' : ''}`}
                                style={{
                                    left: `${s.x}%`, top: `${s.y}%`,
                                    width: '120px', height: '120px',
                                    transform: `translate(-50%, -50%) scale(${s.scale})`,
                                    zIndex: s.zIndex,
                                }}
                            >
                                {isSelected && !isDrawingMode && (
                                    <>
                                        <div className="absolute -inset-2 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none"></div>
                                        <button onPointerDown={handleDelete} className="absolute -top-5 -right-5 bg-red-500 text-white rounded-full p-1.5 shadow-md pointer-events-auto"><TrashIcon className="w-4 h-4" /></button>
                                        <button onPointerDown={handleFlip} className="absolute -bottom-5 -left-5 bg-yellow-400 text-yellow-900 rounded-full p-1.5 shadow-md pointer-events-auto"><ArrowPathIcon className="w-4 h-4" /></button>
                                        <div onPointerDown={(e) => handleStickerDown(e, s.uid, 'scale')} className="absolute -bottom-5 -right-5 bg-blue-500 text-white rounded-full p-1.5 shadow-md cursor-se-resize pointer-events-auto"><ArrowsPointingOutIcon className="w-4 h-4" /></div>
                                    </>
                                )}
                                <img src={data.imageUrl} className={`w-full h-full object-contain drop-shadow-md pointer-events-none select-none ${s.isFlipped ? 'scale-x-[-1]' : ''}`} draggable={false} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- Bottom Drawer --- */}
            {/* Add touch-pan-x to allow horizontal scrolling */}
            <div className={`flex-shrink-0 h-auto min-h-[140px] sm:min-h-[160px] bg-white shadow-inner z-40 flex flex-col border-t border-purple-100 transition-opacity ${isDrawingMode ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                {/* Categories */}
                <div className="flex overflow-x-auto px-2 py-2 gap-2 bg-purple-50 scrollbar-hide touch-pan-x">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { playSound('click', isSoundOn); setSelectedCategory(cat.id); }}
                            className={`px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-purple-500 text-white' : 'bg-white text-purple-700 hover:bg-purple-100'}`}
                        >
                            <span className="mr-1">{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Stickers List */}
                <div className="flex-grow overflow-x-auto p-4 bg-white flex items-center gap-4 scrollbar-hide touch-pan-x">
                    {categorizedStickers[selectedCategory]?.map((sticker, idx) => (
                        <div
                            key={`${sticker.id}-${idx}`}
                            onPointerDown={(e) => handleDrawerItemPointerDown(e, sticker)}
                            className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-grab"
                        >
                            <img src={sticker.imageUrl} className="w-16 h-16 object-contain pointer-events-none" draggable={false} />
                        </div>
                    ))}
                    {(!categorizedStickers[selectedCategory] || categorizedStickers[selectedCategory].length === 0) && (
                        <span className="text-gray-400 italic w-full text-center">Trống</span>
                    )}
                </div>
            </div>

            {/* --- Drag Proxy (Ghost Item) --- */}
            {drawerDragItem && drawerDragItem.isDragging && (
                <div 
                    className="fixed pointer-events-none z-[100] w-24 h-24 flex items-center justify-center opacity-80"
                    style={{ left: drawerDragItem.currentX, top: drawerDragItem.currentY, transform: 'translate(-50%, -50%)' }}
                >
                    <img src={drawerDragItem.sticker.imageUrl} className="w-full h-full object-contain drop-shadow-xl" />
                </div>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes slide-down { from { transform: translateY(-100%); } to { transform: translateY(0); } }
                .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default StickerBook;
