import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon } from './icons';
import { playSound } from '../services/audioService';

interface ColoringGameProps {
    onGoHome: () => void;
    isSoundOn: boolean;
}

const COLORS = [
    { name: 'Đỏ', value: '#FF0000' },
    { name: 'Cam', value: '#FFA500' },
    { name: 'Vàng', value: '#FFD700' },
    { name: 'Xanh lá', value: '#00FF00' },
    { name: 'Xanh dương', value: '#0000FF' },
    { name: 'Tím', value: '#800080' },
    { name: 'Hồng', value: '#FFC0CB' },
    { name: 'Nâu', value: '#8B4513' },
    { name: 'Đen', value: '#000000' },
    { name: 'Xám', value: '#808080' },
    { name: 'Xanh lam', value: '#00CED1' },
    { name: 'Vàng Chanh', value: '#FFFF00' },
];

// Coloring book templates
const TEMPLATES = [
    { id: 'flower', name: 'Hoa Cười 🌸', image: '/assets/images/coloring/flower.png' },
    // Bạn có thể thêm nhiều tranh tô màu khác vào đây
    // Ví dụ: { id: 'cat', name: 'Mèo Con 🐱', image: '/assets/images/coloring/cat.png' },
];

const ColoringGame: React.FC<ColoringGameProps> = ({ onGoHome, isSoundOn }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
    const [isEraser, setIsEraser] = useState(false);
    const [brushSize, setBrushSize] = useState(20);

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
            // Set canvas size to match image
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

            // Draw image
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            // Save original image data
            imageDataRef.current = ctx.getImageData(0, 0, width, height);
            originalImageRef.current = img;
        };

        img.onerror = () => {
            // If image fails to load, create a simple placeholder
            canvas.width = 600;
            canvas.height = 600;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 600, 600);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.font = '24px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText('Tranh tô màu sẽ được thêm sau', 300, 300);

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

        // Convert fill color to RGB
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

        // Don't fill if clicking on black outlines (tolerance for anti-aliasing)
        if (startR < 50 && startG < 50 && startB < 50) return;

        // Don't fill if already the same color
        if (startR === fillRgb[0] && startG === fillRgb[1] && startB === fillRgb[2]) return;

        const pixelStack: [number, number][] = [[x, y]];
        const width = canvas.width;
        const height = canvas.height;

        const colorMatch = (pos: number): boolean => {
            const r = pixels[pos];
            const g = pixels[pos + 1];
            const b = pixels[pos + 2];

            // Check if it's black (outline) - don't fill outlines
            if (r < 50 && g < 50 && b < 50) return false;

            // Check if it matches the starting color (with tolerance)
            return Math.abs(r - startR) < 30 &&
                Math.abs(g - startG) < 30 &&
                Math.abs(b - startB) < 30;
        };

        while (pixelStack.length > 0) {
            const [px, py] = pixelStack.pop()!;
            let currentPos = (py * width + px) * 4;

            // Move up to find the top of this column
            while (py >= 0 && colorMatch(currentPos)) {
                currentPos -= width * 4;
            }
            currentPos += width * 4;
            let ppy = Math.floor(currentPos / 4 / width);

            let reachLeft = false;
            let reachRight = false;

            while (ppy < height && colorMatch(currentPos)) {
                // Color this pixel
                pixels[currentPos] = fillRgb[0];
                pixels[currentPos + 1] = fillRgb[1];
                pixels[currentPos + 2] = fillRgb[2];
                pixels[currentPos + 3] = 255;

                const ppx = (currentPos / 4) % width;

                // Check left
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

                // Check right
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

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        if (isEraser) {
            floodFill(x, y, '#FFFFFF');
        } else {
            floodFill(x, y, selectedColor);
        }

        if (isSoundOn) {
            playSound('click', isSoundOn);
        }
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
        <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur shadow-md z-10">
                <button
                    onClick={onGoHome}
                    className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                    <HomeIcon className="w-6 h-6" />
                </button>

                <h1 className="text-2xl md:text-4xl font-black text-purple-600 drop-shadow">
                    🎨 Họa Sĩ Tí Hon
                </h1>

                <button
                    onClick={handleClear}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-110"
                >
                    Làm Lại
                </button>
            </div>

            {/* Template Selector */}
            <div className="flex gap-2 p-4 overflow-x-auto bg-white/60 backdrop-blur">
                {TEMPLATES.map((template, idx) => (
                    <button
                        key={template.id}
                        onClick={() => {
                            setSelectedTemplate(idx);
                            if (isSoundOn) playSound('click', isSoundOn);
                        }}
                        className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${selectedTemplate === idx
                            ? 'bg-purple-500 text-white scale-110 shadow-lg'
                            : 'bg-white text-purple-600 hover:bg-purple-100'
                            }`}
                    >
                        {template.name}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
                {/* Canvas */}
                <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-2xl p-4 overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="max-w-full max-h-full cursor-crosshair shadow-lg"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>

                {/* Color Palette & Tools */}
                <div className="md:w-64 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-4">
                    {/* Tools */}
                    <div>
                        <h3 className="text-lg font-bold text-purple-600 mb-2">Công Cụ</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setIsEraser(false);
                                    if (isSoundOn) playSound('click', isSoundOn);
                                }}
                                className={`flex-1 py-2 rounded-lg font-bold transition-all ${!isEraser
                                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                🖌️ Cọ
                            </button>
                            <button
                                onClick={() => {
                                    setIsEraser(true);
                                    if (isSoundOn) playSound('click', isSoundOn);
                                }}
                                className={`flex-1 py-2 rounded-lg font-bold transition-all ${isEraser
                                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                🧹Tẩy
                            </button>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div className="flex-1 overflow-y-auto">
                        <h3 className="text-lg font-bold text-purple-600 mb-2">Bảng Màu</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => {
                                        setSelectedColor(color.value);
                                        setIsEraser(false);
                                        if (isSoundOn) playSound('click', isSoundOn);
                                    }}
                                    className={`aspect-square rounded-xl transition-all ${selectedColor === color.value && !isEraser
                                        ? 'scale-110 ring-4 ring-purple-500 shadow-lg'
                                        : 'hover:scale-105 shadow'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Current Color */}
                    <div className="p-3 bg-purple-100 rounded-xl text-center">
                        <p className="text-sm font-bold text-purple-700 mb-2">
                            {isEraser ? 'Đang dùng Tẩy' : 'Màu đang chọn:'}
                        </p>
                        {!isEraser && (
                            <div
                                className="w-16 h-16 mx-auto rounded-full shadow-lg border-4 border-white"
                                style={{ backgroundColor: selectedColor }}
                            />
                        )}
                        {isEraser && (
                            <div className="text-4xl">🧹</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColoringGame;
