import React, { useState, useRef } from 'react';
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
    { name: 'Trắng', value: '#FFFFFF' },
    { name: 'Xám', value: '#808080' },
    { name: 'Xanh lam', value: '#00CED1' },
];

// Simple coloring templates as SVG paths
const TEMPLATES = [
    {
        id: 'butterfly',
        name: 'Bướm 🦋',
        viewBox: '0 0 200 200',
        paths: [
            { id: 'wing1', d: 'M100,100 Q80,60 60,80 Q40,100 60,120 Q80,140 100,100 Z', fill: '#FFFFFF' },
            { id: 'wing2', d: 'M100,100 Q120,60 140,80 Q160,100 140,120 Q120,140 100,100 Z', fill: '#FFFFFF' },
            { id: 'wing3', d: 'M100,100 Q80,140 60,160 Q40,180 60,200 Q80,180 100,140 Z', fill: '#FFFFFF' },
            { id: 'wing4', d: 'M100,100 Q120,140 140,160 Q160,180 140,200 Q120,180 100,140 Z', fill: '#FFFFFF' },
            { id: 'body', d: 'M95,50 L105,50 L105,200 L95,200 Z', fill: '#FFFFFF' },
            { id: 'head', d: 'M100,40 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', fill: '#FFFFFF' },
        ]
    },
    {
        id: 'flower',
        name: 'Hoa 🌸',
        viewBox: '0 0 200 200',
        paths: [
            { id: 'petal1', d: 'M100,100 Q90,70 100,50 Q110,70 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal2', d: 'M100,100 Q130,90 150,100 Q130,110 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal3', d: 'M100,100 Q110,130 100,150 Q90,130 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal4', d: 'M100,100 Q70,110 50,100 Q70,90 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal5', d: 'M100,100 Q120,80 130,70 Q115,85 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal6', d: 'M100,100 Q120,120 130,130 Q115,115 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal7', d: 'M100,100 Q80,120 70,130 Q85,115 100,100 Z', fill: '#FFFFFF' },
            { id: 'petal8', d: 'M100,100 Q80,80 70,70 Q85,85 100,100 Z', fill: '#FFFFFF' },
            { id: 'center', d: 'M100,100 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', fill: '#FFFFFF' },
            { id: 'stem', d: 'M95,100 L105,100 L105,180 L95,180 Z', fill: '#FFFFFF' },
        ]
    },
    {
        id: 'fish',
        name: 'Cá 🐟',
        viewBox: '0 0 200 200',
        paths: [
            { id: 'body', d: 'M50,100 Q80,70 120,70 Q150,70 160,100 Q150,130 120,130 Q80,130 50,100 Z', fill: '#FFFFFF' },
            { id: 'tail', d: 'M160,100 L180,80 L190,100 L180,120 Z', fill: '#FFFFFF' },
            { id: 'fin_top', d: 'M100,70 L110,50 L120,70 Z', fill: '#FFFFFF' },
            { id: 'fin_bottom', d: 'M100,130 L110,150 L120,130 Z', fill: '#FFFFFF' },
            { id: 'eye', d: 'M130,90 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', fill: '#FFFFFF' },
        ]
    },
    {
        id: 'house',
        name: 'Nhà 🏠',
        viewBox: '0 0 200 200',
        paths: [
            { id: 'roof', d: 'M50,100 L100,50 L150,100 Z', fill: '#FFFFFF' },
            { id: 'wall', d: 'M60,100 L140,100 L140,170 L60,170 Z', fill: '#FFFFFF' },
            { id: 'door', d: 'M85,130 L115,130 L115,170 L85,170 Z', fill: '#FFFFFF' },
            { id: 'window1', d: 'M70,110 L90,110 L90,130 L70,130 Z', fill: '#FFFFFF' },
            { id: 'window2', d: 'M110,110 L130,110 L130,130 L110,130 Z', fill: '#FFFFFF' },
            { id: 'chimney', d: 'M120,60 L135,60 L135,85 L120,85 Z', fill: '#FFFFFF' },
        ]
    },
    {
        id: 'tree',
        name: 'Cây 🌳',
        viewBox: '0 0 200 200',
        paths: [
            { id: 'trunk', d: 'M85,120 L115,120 L115,180 L85,180 Z', fill: '#FFFFFF' },
            { id: 'leaves1', d: 'M100,40 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0', fill: '#FFFFFF' },
            { id: 'leaves2', d: 'M70,80 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0', fill: '#FFFFFF' },
            { id: 'leaves3', d: 'M130,80 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0', fill: '#FFFFFF' },
        ]
    },
    {
        id: 'car',
        name: 'Xe 🚗',
        viewBox: '0 0 200 200',
        paths: [
            { id: 'body', d: 'M40,120 L160,120 L160,150 L40,150 Z', fill: '#FFFFFF' },
            { id: 'roof', d: 'M60,90 L140,90 L150,120 L50,120 Z', fill: '#FFFFFF' },
            { id: 'window1', d: 'M65,95 L95,95 L100,115 L70,115 Z', fill: '#FFFFFF' },
            { id: 'window2', d: 'M105,95 L135,95 L130,115 L100,115 Z', fill: '#FFFFFF' },
            { id: 'wheel1', d: 'M60,150 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', fill: '#FFFFFF' },
            { id: 'wheel2', d: 'M140,150 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', fill: '#FFFFFF' },
        ]
    },
];

const ColoringGame: React.FC<ColoringGameProps> = ({ onGoHome, isSoundOn }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
    const [coloredPaths, setColoredPaths] = useState<Record<string, string>>({});
    const svgRef = useRef<SVGSVGElement>(null);

    const currentTemplate = TEMPLATES[selectedTemplate];

    const handlePathClick = (pathId: string) => {
        setColoredPaths(prev => ({
            ...prev,
            [pathId]: selectedColor
        }));
        if (isSoundOn) {
            playSound('click');
        }
    };

    const handleClear = () => {
        setColoredPaths({});
        if (isSoundOn) {
            playSound('click');
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
                    Xóa Hết
                </button>
            </div>

            {/* Template Selector */}
            <div className="flex gap-2 p-4 overflow-x-auto bg-white/60 backdrop-blur">
                {TEMPLATES.map((template, idx) => (
                    <button
                        key={template.id}
                        onClick={() => {
                            setSelectedTemplate(idx);
                            setColoredPaths({});
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
                    <svg
                        ref={svgRef}
                        viewBox={currentTemplate.viewBox}
                        className="w-full h-full max-w-2xl max-h-[600px]"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                    >
                        {currentTemplate.paths.map((path) => (
                            <path
                                key={path.id}
                                d={path.d}
                                fill={coloredPaths[path.id] || path.fill}
                                stroke="#000000"
                                strokeWidth="2"
                                onClick={() => handlePathClick(path.id)}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </svg>
                </div>

                {/* Color Palette */}
                <div className="md:w-48 bg-white rounded-2xl shadow-2xl p-4">
                    <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">Bảng Màu</h3>
                    <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
                        {COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => {
                                    setSelectedColor(color.value);
                                    if (isSoundOn) playSound('click', isSoundOn);
                                }}
                                className={`w-full aspect-square rounded-xl transition-all ${selectedColor === color.value
                                    ? 'scale-110 ring-4 ring-purple-500 shadow-lg'
                                    : 'hover:scale-105 shadow'
                                    }`}
                                style={{
                                    backgroundColor: color.value,
                                    border: color.value === '#FFFFFF' ? '2px solid #ccc' : 'none'
                                }}
                                title={color.name}
                            />
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-purple-100 rounded-xl text-center">
                        <p className="text-sm font-bold text-purple-700">Màu đang chọn:</p>
                        <div
                            className="w-16 h-16 mx-auto mt-2 rounded-full shadow-lg border-4 border-white"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColoringGame;
