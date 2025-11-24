import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon } from './icons';
import { playSound } from '../services/audioService';

interface ColoringGameProps {
    onGoHome: () => void;
    isSoundOn: boolean;
}

const COLORS = [
    { name: 'Đỏ', value: '#FF3B3B', emoji: '❤️' },
    { name: 'Cam', value: '#FF8C42', emoji: '🧡' },
    { name: 'Vàng', value: '#FFD93D', emoji: '💛' },
    { name: 'Xanh lá', value: '#6BCF7F', emoji: '💚' },
    { name: 'Xanh dương', value: '#4D96FF', emoji: '💙' },
    { name: 'Tím', value: '#9D4EDD', emoji: '💜' },
    { name: 'Hồng', value: '#FF6AD5', emoji: '🩷' },
    { name: 'Nâu', value: '#A0522D', emoji: '🤎' },
    { name: 'Đen', value: '#2D2D2D', emoji: '🖤' },
    { name: 'Trắng', value: '#FFFFFF', emoji: '🤍' },
    { name: 'Xám', value: '#95A5A6', emoji: '🩶' },
    { name: 'Xanh lam', value: '#1DD3B0', emoji: '💎' },
];

// Coloring book templates
const TEMPLATES = [
    { id: 'flower', name: 'Hoa Cười 🌸', image: '/assets/images/coloring/flower.png' },
    { id: 'bunny', name: 'Thỏ Con 🐰', image: '/assets/images/coloring/bunny.png' },
    { id: 'doraemon', name: 'Doraemon ⚽', image: '/assets/images/coloring/doraemon.png' },
];

const ColoringGame: React.FC<ColoringGameProps> = ({ onGoHome, isSoundOn }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
    const [toolMode, setToolMode] = useState<'fill' | 'brush' | 'eraser'>('fill');
    const [brushSize, setBrushSize] = useState(20);
    const [isDrawing, setIsDrawing] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const originalImageRef = useRef<HTMLImageElement | null>(null);
    const imageDataRef = useRef<ImageData | null>(null);

    const currentTemplate = TEMPLATES[selectedTemplate];

    // Load image when template changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        contextRef.current = ctx;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            imageDataRef.current = ctx.getImageData(0, 0, width, height);
            originalImageRef.current = img;
        };

        img.onerror = () => {
            canvas.width = 600;
            canvas.height = 600;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 600, 600);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.font = '24px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText('Tranh tô màu đang được tải...', 300, 300);

            imageDataRef.current = ctx.getImageData(0, 0, 600, 600);
        };

        img.src = currentTemplate.image;
    }, [selectedTemplate]);

    // Flood fill algorithm
    const floodFill = (x: number, y: number, fillColor: string) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const temp = document.createElement('canvas');
        const tempCtx = temp.getContext('2d');
        if (!tempCtx) return;
        tempCtx.fillStyle = fillColor;
        tempCtx.fillRect(0, 0, 1, 1);
        const fillRgb = tempCtx.getImageData(0, 0, 1, 1).data;

        const startPos = (y * canvas.width + x) * 4;
        const startR = pixels[startPos];
        const startG = pixels[startPos + 1];
        const startB = pixels[startPos + 2];

        if (startR < 50 && startG < 50 && startB < 50) return;
        if (startR === fillRgb[0] && startG === fillRgb[1] && startB === fillRgb[2]) return;

        const pixelStack: [number, number][] = [[x, y]];
        const width = canvas.width;
        const height = canvas.height;

        const colorMatch = (pos: number): boolean => {
            const r = pixels[pos];
            const g = pixels[pos + 1];
            const b = pixels[pos + 2];

            if (r < 50 && g < 50 && b < 50) return false;

            return Math.abs(r - startR) < 30 &&
                Math.abs(g - startG) < 30 &&
                Math.abs(b - startB) < 30;
        };

        while (pixelStack.length > 0) {
            const [px, py] = pixelStack.pop()!;
            let currentPos = (py * width + px) * 4;

            while (py >= 0 && colorMatch(currentPos)) {
                currentPos -= width * 4;
            }
            currentPos += width * 4;
            let ppy = Math.floor(currentPos / 4 / width);

            let reachLeft = false;
            let reachRight = false;

            while (ppy < height && colorMatch(currentPos)) {
                pixels[currentPos] = fillRgb[0];
                pixels[currentPos + 1] = fillRgb[1];
                pixels[currentPos + 2] = fillRgb[2];
                pixels[currentPos + 3] = 255;

                const ppx = (currentPos / 4) % width;

                if (ppx > 0) {
                    const leftPos = currentPos - 4;
                    if (colorMatch(leftPos)) {
                        if (!reachLeft) {
                            pixelStack.push([ppx - 1, ppy]);
                            reachLeft = true;
                        }
                    } else {
                        reachLeft = false;
                    }
                }

                if (ppx < width - 1) {
                    const rightPos = currentPos + 4;
                    if (colorMatch(rightPos)) {
                        if (!reachRight) {
                            pixelStack.push([ppx + 1, ppy]);
                            reachRight = true;
                        }
                    } else {
                        reachRight = false;
                    }
                }

                currentPos += width * 4;
                ppy++;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = Math.floor((clientX - rect.left) * scaleX);
        const y = Math.floor((clientY - rect.top) * scaleY);
        return { x, y };
    };

    const draw = (x: number, y: number) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = toolMode === 'eraser' ? '#FFFFFF' : selectedColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (toolMode === 'fill') {
            const coords = getCoordinates(e);
            if (!coords) return;
            floodFill(coords.x, coords.y, selectedColor);
            if (isSoundOn) playSound('click', isSoundOn);
            return;
        }

        const ctx = contextRef.current;
        if (!ctx) return;

        setIsDrawing(true);
        const coords = getCoordinates(e);
        if (!coords) return;

        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || toolMode === 'fill') return;
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;
        draw(coords.x, coords.y);
    };

    const handleCanvasMouseUp = () => {
        setIsDrawing(false);
        const ctx = contextRef.current;
        if (ctx) ctx.beginPath();
    };

    const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (toolMode === 'fill') {
            const coords = getCoordinates(e);
            if (!coords) return;
            floodFill(coords.x, coords.y, selectedColor);
            if (isSoundOn) playSound('click', isSoundOn);
            return;
        }

        const ctx = contextRef.current;
        if (!ctx) return;

        setIsDrawing(true);
        const coords = getCoordinates(e);
        if (!coords) return;

        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };

    const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || toolMode === 'fill') return;
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;
        draw(coords.x, coords.y);
    };

    const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        setIsDrawing(false);
        const ctx = contextRef.current;
        if (ctx) ctx.beginPath();
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const img = originalImageRef.current;

        if (!canvas || !ctx || !img) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (isSoundOn) {
            playSound('click', isSoundOn);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-3 md:p-4 bg-white/90 backdrop-blur shadow-lg z-10">
                <button
                    onClick={onGoHome}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-2xl shadow-lg transition-all hover:scale-110 active:scale-95"
                >
                    <HomeIcon className="w-6 h-6" />
                </button>

                <h1 className="text-2xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                    🎨 Họa Sĩ Tí Hon
                </h1>

                <button
                    onClick={handleClear}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-3 rounded-2xl font-bold shadow-lg transition-all hover:scale-110 active:scale-95 text-sm md:text-base"
                >
                    🔄 Làm Lại
                </button>
            </div>

            {/* Template Selector */}
            <div className="flex gap-2 p-3 overflow-x-auto bg-gradient-to-r from-purple-200/80 to-pink-200/80 backdrop-blur">
                {TEMPLATES.map((template, idx) => (
                    <button
                        key={template.id}
                        onClick={() => {
                            setSelectedTemplate(idx);
                            if (isSoundOn) playSound('click', isSoundOn);
                        }}
                        className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all text-lg ${selectedTemplate === idx
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 shadow-2xl ring-4 ring-white'
                            : 'bg-white text-purple-600 hover:bg-purple-50 shadow-md hover:scale-105'
                            }`}
                    >
                        {template.name}
                    </button>
                ))}
            </div>

            {/* Main Content - Optimized for iPad Landscape */}
            <div className="flex-1 flex flex-row gap-4 p-4 overflow-hidden">
                {/* Canvas - Takes most of the space */}
                <div className="flex-1 flex items-center justify-center bg-white rounded-3xl shadow-2xl p-6 overflow-hidden border-4 border-purple-200">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        onTouchStart={handleCanvasTouchStart}
                        onTouchMove={handleCanvasTouchMove}
                        onTouchEnd={handleCanvasTouchEnd}
                        className="max-w-full max-h-full cursor-crosshair shadow-xl rounded-2xl"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>

                {/* Sidebar - Always visible on iPad landscape */}
                <div className="w-72 xl:w-80 flex flex-col gap-4 flex-shrink-0">
                    {/* Tools */}
                    <div className="bg-white rounded-3xl shadow-2xl p-4 border-4 border-purple-200">
                        <h3 className="text-2xl font-black text-purple-600 mb-3 text-center">🛠️ Công Cụ</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => {
                                    setToolMode('fill');
                                    if (isSoundOn) playSound('click', isSoundOn);
                                }}
                                className={`flex flex-col items-center gap-1 py-3 rounded-2xl font-bold transition-all ${toolMode === 'fill'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl scale-105 ring-4 ring-purple-300'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md'
                                    }`}
                            >
                                <span className="text-3xl">🪣</span>
                                <span className="text-xs">Đổ Màu</span>
                            </button>
                            <button
                                onClick={() => {
                                    setToolMode('brush');
                                    if (isSoundOn) playSound('click', isSoundOn);
                                }}
                                className={`flex flex-col items-center gap-1 py-3 rounded-2xl font-bold transition-all ${toolMode === 'brush'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl scale-105 ring-4 ring-purple-300'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md'
                                    }`}
                            >
                                <span className="text-3xl">🖌️</span>
                                <span className="text-xs">Cọ Vẽ</span>
                            </button>
                            <button
                                onClick={() => {
                                    setToolMode('eraser');
                                    if (isSoundOn) playSound('click', isSoundOn);
                                }}
                                className={`flex flex-col items-center gap-1 py-3 rounded-2xl font-bold transition-all ${toolMode === 'eraser'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl scale-105 ring-4 ring-purple-300'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md'
                                    }`}
                            >
                                <span className="text-3xl">🧹</span>
                                <span className="text-xs">Tẩy</span>
                            </button>
                        </div>
                        {toolMode === 'brush' && (
                            <div className="mt-3">
                                <label className="text-sm font-bold text-purple-600 block mb-2">Kích thước cọ: {brushSize}px</label>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        accentColor: '#9D4EDD'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Color Palette */}
                    <div className="flex-1 bg-white rounded-3xl shadow-2xl p-4 overflow-y-auto border-4 border-purple-200">
                        <h3 className="text-2xl font-black text-purple-600 mb-3 text-center sticky top-0 bg-white z-10 pb-2">
                            🎨 Bảng Màu
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => {
                                        setSelectedColor(color.value);
                                        setToolMode('brush'); // Auto switch to brush when selecting color
                                        if (isSoundOn) playSound('click', isSoundOn);
                                    }}
                                    className={`relative aspect-square rounded-2xl transition-all flex flex-col items-center justify-center gap-1 ${selectedColor === color.value && (toolMode === 'brush' || toolMode === 'fill')
                                        ? 'scale-110 ring-6 ring-purple-500 shadow-2xl z-10'
                                        : 'hover:scale-105 shadow-lg hover:shadow-xl'
                                        }`}
                                    style={{
                                        backgroundColor: color.value,
                                        border: color.value === '#FFFFFF' ? '3px solid #E5E7EB' : 'none'
                                    }}
                                    title={color.name}
                                >
                                    <span className="text-2xl drop-shadow">{color.emoji}</span>
                                    {selectedColor === color.value && (toolMode === 'brush' || toolMode === 'fill') && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-xl">✓</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Selection Display */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-4 text-white border-4 border-white">
                        <p className="text-lg font-bold text-center mb-3">
                            {toolMode === 'eraser' ? '🧹 Đang Dùng Tẩy' : toolMode === 'fill' ? '🪣 Đang Đổ Màu' : '🖌️ Đang Vẽ'}
                        </p>
                        {toolMode !== 'eraser' && (
                            <div
                                className="w-20 h-20 mx-auto rounded-2xl shadow-2xl border-4 border-white"
                                style={{ backgroundColor: selectedColor }}
                            />
                        )}
                        {toolMode === 'eraser' && (
                            <div className="text-6xl text-center">🧹</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColoringGame;
