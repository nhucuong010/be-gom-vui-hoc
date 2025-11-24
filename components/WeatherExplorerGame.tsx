
import React, { useState, useEffect } from 'react';
import { HomeIcon, StarIcon, BookOpenIcon, SpeakerIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import ReadAloudButton from './ReadAloudButton';
import { scienceLevels, scienceItems } from '../data/weatherGameData';

interface WeatherExplorerGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets/images/khampha';

// Định nghĩa các chương
const chapters = [
    { id: 'plants', title: "Bí Mật Cây Cối", startIndex: 0, iconId: 'seed', color: 'from-green-400 to-green-600' },
    { id: 'water', title: "Nước & Vật Lý", startIndex: 6, iconId: 'water_glass', color: 'from-blue-400 to-blue-600' },
    { id: 'animals', title: "Thế Giới Động Vật", startIndex: 12, iconId: 'butterfly', color: 'from-orange-400 to-orange-600' },
    { id: 'sky', title: "Bầu Trời & Trái Đất", startIndex: 18, iconId: 'sun', color: 'from-sky-400 to-indigo-500' },
    { id: 'life', title: "Thời Tiết & Cuộc Sống", startIndex: 23, iconId: 'umbrella', color: 'from-yellow-400 to-yellow-600' },
    { id: 'tools', title: "Vật Lý & Dụng Cụ", startIndex: 30, iconId: 'magnet', color: 'from-gray-400 to-gray-600' },
    { id: 'geo', title: "Địa Lý & Tự Nhiên", startIndex: 35, iconId: 'volcano', color: 'from-red-400 to-red-600' },
    { id: 'body', title: "Cơ Thể & Giác Quan", startIndex: 40, iconId: 'hand', color: 'from-pink-400 to-pink-600' },
    { id: 'society', title: "Xã Hội & An Toàn", startIndex: 45, iconId: 'fire_truck', color: 'from-purple-400 to-purple-600' },
    { id: 'transport', title: "Phương Tiện & Giao Thông", startIndex: 50, iconId: 'car', color: 'from-teal-400 to-teal-600' },
    { id: 'emotion', title: "Cảm Xúc & Ứng Xử", startIndex: 55, iconId: 'face_happy', color: 'from-rose-400 to-rose-600' },
];

const WeatherExplorerGame: React.FC<WeatherExplorerGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [viewState, setViewState] = useState<'chapters' | 'playing' | 'finished'>('chapters');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);
    const [visualState, setVisualState] = useState<'initial' | 'success'>('initial');
    const [options, setOptions] = useState<string[]>([]);
    const [isLevelFinished, setIsLevelFinished] = useState(false);
    const [displayedText, setDisplayedText] = useState<string>("");

    const currentLevel = scienceLevels[currentLevelIndex];

    // Helper to get image URL by ID
    const getImageUrl = (id: string) => {
        const item = scienceItems.find(i => i.id === id);
        return item ? item.imageUrl : '';
    };

    // Initialize Level when currentLevelIndex changes and we are in playing mode
    useEffect(() => {
        if (viewState === 'playing') {
            loadLevel(currentLevelIndex);
        }
    }, [currentLevelIndex, viewState]);

    const handleChapterSelect = (startIndex: number) => {
        playSound('click', isSoundOn);
        setCurrentLevelIndex(startIndex);
        setViewState('playing');
        setScore(0); // Reset score for new session
    };

    const loadLevel = async (index: number) => {
        setVisualState('initial');
        setFeedback(null);
        setIsLevelFinished(false);
        
        const level = scienceLevels[index];
        if (!level) return;

        // --- LOGICAL DISTRACTOR SELECTION ---
        const correctItem = scienceItems.find(i => i.id === level.correctItemId);
        
        let distractors: string[] = [];
        if (correctItem) {
            // 1. Filter items from the SAME category
            const sameCategoryItems = scienceItems.filter(i => 
                i.category === correctItem.category && i.id !== correctItem.id
            );

            // 2. If not enough same-category items, prioritize those, otherwise use random others
            if (sameCategoryItems.length >= 2) {
                distractors = sameCategoryItems
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2)
                    .map(item => item.id);
            } else {
                // Fallback if category is too small
                distractors = scienceItems
                    .filter(item => item.id !== level.correctItemId)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2)
                    .map(item => item.id);
            }
        } else {
             distractors = scienceItems
                .filter(item => item.id !== level.correctItemId)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map(item => item.id);
        }
        
        const newOptions = [level.correctItemId, ...distractors].sort(() => 0.5 - Math.random());
        setOptions(newOptions);

        // Play Audio Sequence & Update Text
        setDisplayedText(level.introAudio);
        await playDynamicSentence(level.introAudio, 'vi', isSoundOn, 'weather_explorer');
        
        await new Promise(r => setTimeout(r, 500));
        
        setDisplayedText(level.questionAudio);
        await playDynamicSentence(level.questionAudio, 'vi', isSoundOn, 'weather_explorer');
    };

    const handleSelection = async (selectedId: string) => {
        if (feedback || isLevelFinished) return;
        playSound('click', isSoundOn);

        if (selectedId === currentLevel.correctItemId) {
            setVisualState('success');
            playSound('correct', isSoundOn);
            setFeedback({ isCorrect: true, message: "Đúng rồi!" });
            onCorrectAnswer();
            setScore(s => s + 1);
            
            // Show and play success audio
            setDisplayedText(currentLevel.successAudio);
            await playDynamicSentence(currentLevel.successAudio, 'vi', isSoundOn, 'weather_explorer');
            
            setTimeout(() => {
                if (currentLevelIndex < scienceLevels.length - 1) {
                    setCurrentLevelIndex(prev => prev + 1);
                } else {
                    setViewState('finished');
                    playSound('win', isSoundOn);
                }
            }, 3000);
        } else {
            playSound('incorrect', isSoundOn);
            setFeedback({ isCorrect: false, message: "Chưa đúng!" });
            
            const failText = "Chưa đúng rồi, bé chọn lại nhé!";
            setDisplayedText(failText);
            playDynamicSentence(failText, 'vi', isSoundOn, 'weather_explorer');
            setTimeout(() => {
                setFeedback(null);
                // Restore question text if user is still on the same level
                if (!isLevelFinished) {
                    setDisplayedText(currentLevel.questionAudio);
                }
            }, 1500);
        }
    };

    const handleRestart = () => {
        playSound('click', isSoundOn);
        setViewState('chapters');
        setScore(0);
    };

    const handleReplayAudio = () => {
        playSound('click', isSoundOn);
        playDynamicSentence(displayedText, 'vi', isSoundOn, 'weather_explorer');
    };

    const getLevelImage = () => {
        const imageId = visualState === 'initial' ? currentLevel.centralImageId : currentLevel.successImageId;
        
        // Exception handling for specific visual states if they aren't generic items
        if (imageId === 'flower_wilted') return `${ASSET_BASE_URL}/we_flower_wilted.png`;
        if (imageId === 'clothes_wet') return `${ASSET_BASE_URL}/we_clothes_wet.png`;
        if (imageId === 'clothes_dry') return `${ASSET_BASE_URL}/we_clothes_dry.png`;
        
        return getImageUrl(imageId);
    };

    // --- RENDER: Chapter Select ---
    if (viewState === 'chapters') {
        return (
            <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 min-h-screen flex flex-col items-center">
                <div className="w-full bg-white/90 backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] shadow-2xl p-4 sm:p-8 relative border-4 border-sky-200">
                    <button onClick={onGoHome} className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white p-2 sm:p-3 rounded-full shadow-lg text-purple-500 hover:scale-110 transition-transform z-10">
                        <HomeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                    
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-center text-purple-800 mb-2 mt-8 sm:mt-4">Bé Khám Phá</h2>
                    <p className="text-center text-lg sm:text-2xl text-gray-600 mb-6 sm:mb-10">Con muốn khám phá chủ đề nào?</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {chapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => handleChapterSelect(chapter.startIndex)}
                                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group bg-gradient-to-br ${chapter.color} text-white text-left`}
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold mb-1 drop-shadow-md">{chapter.title}</h3>
                                        <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Bắt đầu</span>
                                    </div>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-inner shrink-0">
                                        <img src={getImageUrl(chapter.iconId)} alt={chapter.title} className="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: Game Finished ---
    if (viewState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-purple-100 p-4">
                <Confetti />
                <div className="text-8xl sm:text-9xl mb-6 animate-bounce">🎓</div>
                <h2 className="text-4xl sm:text-5xl font-black text-purple-600 mb-4 text-center">Bé Đã Tốt Nghiệp!</h2>
                <p className="text-xl sm:text-2xl text-gray-600 mb-8 text-center max-w-md">Bé đã hoàn thành tất cả bài học. Giỏi quá!</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={onGoHome} className="bg-gray-400 text-white font-bold py-3 sm:py-4 px-8 rounded-full text-lg sm:text-xl shadow-lg">Về Nhà</button>
                    <button onClick={handleRestart} className="bg-green-500 text-white font-bold py-3 sm:py-4 px-8 rounded-full text-lg sm:text-xl shadow-lg hover:scale-105 transition-transform">Chọn Chương Khác</button>
                </div>
            </div>
        );
    }

    if (!currentLevel) return <div>Loading...</div>;

    // --- RENDER: Playing Game ---
    return (
        <div className={`w-full max-w-5xl mx-auto flex flex-col items-center p-2 sm:p-4 h-[100dvh] max-h-[100dvh] transition-colors duration-1000 ${currentLevel.background}`}>
            <div className="w-full bg-white/40 backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] shadow-2xl p-2 sm:p-4 pb-6 relative flex-grow flex flex-col items-center overflow-hidden border-4 sm:border-8 border-white/50">
                {/* Header */}
                <div className="w-full flex justify-between items-center absolute top-4 left-0 px-4 z-50">
                    <button onClick={() => { stopAllSounds(); setViewState('chapters'); }} className="bg-white p-2 sm:p-3 rounded-full shadow-lg text-purple-500 hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-4 sm:pr-6">
                        <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="hidden sm:inline">Menu</span>
                    </button>
                    
                    <div className="flex items-center bg-yellow-400 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full shadow-lg border-2 border-white">
                        <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                        <span className="text-xl sm:text-2xl font-black">{score}</span>
                    </div>
                </div>
                
                {/* Title - Margin top to avoid overlap with header */}
                <div className="mt-14 sm:mt-16 bg-white/80 px-6 sm:px-8 py-1 sm:py-2 rounded-full shadow-sm z-10">
                    <h2 className="text-xl sm:text-3xl font-bold text-purple-800 uppercase">{currentLevel.title}</h2>
                </div>

                {/* Main Visual Area - Flexible growth but constrained */}
                <div className="relative flex-grow w-full flex items-center justify-center mb-2 min-h-0">
                    {/* Visual Effects based on correct item */}
                    {visualState === 'success' && currentLevel.correctItemId === 'rain' && (
                        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                             {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="absolute text-blue-500 text-2xl sm:text-4xl animate-drop" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random()}s` }}>💧</div>
                            ))}
                        </div>
                    )}
                    {visualState === 'success' && currentLevel.correctItemId === 'sun' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                             <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
                        </div>
                    )}

                    <div className={`z-20 relative transition-all duration-500 transform hover:scale-105 flex items-center justify-center w-full h-full`}>
                        <img 
                            src={getLevelImage()} 
                            alt="Scene" 
                            className={`object-contain drop-shadow-2xl transition-all duration-700 ${visualState === 'success' ? 'scale-110' : 'scale-100'}`}
                            style={{ maxHeight: '35vh', maxWidth: '90vw' }} // Reduced max-height to allow room below
                        />
                    </div>
                </div>

                {/* Subtitle Text & Replay Button */}
                <div className="w-full max-w-4xl mb-2 z-20 flex items-center justify-center min-h-[30px] px-2 gap-2">
                    <div className="bg-white/60 rounded-xl px-4 py-2 shadow-sm backdrop-blur-md flex items-center gap-3">
                        <p className="text-sm sm:text-base md:text-lg text-center text-purple-900 font-bold leading-snug">
                            {displayedText}
                        </p>
                        <button 
                            onClick={handleReplayAudio}
                            className="p-1 hover:bg-white rounded-full transition-colors text-pink-500"
                            title="Nghe lại"
                        >
                            <SpeakerIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                    </div>
                </div>

                {/* Selection Area - Fixed height at bottom, moved up */}
                <div className="w-full mb-6 sm:mb-8 z-30 flex-shrink-0">
                    <div className="flex justify-center items-center gap-3 sm:gap-8">
                        {options.map((id) => {
                            const item = scienceItems.find(i => i.id === id);
                            if (!item) return null;
                            return (
                                <button
                                    key={id}
                                    onClick={() => handleSelection(id)}
                                    className="bg-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border-4 border-white hover:border-purple-300 transform hover:scale-110 transition-all active:scale-95 flex flex-col items-center w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48 justify-between group"
                                >
                                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain group-hover:rotate-3 transition-transform" />
                                    <span className="font-bold text-purple-700 text-xs sm:text-base md:text-lg text-center leading-tight">{item.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Popups */}
                {feedback && feedback.isCorrect && (
                    <>
                        <CorrectAnswerPopup message={feedback.message} />
                        <Confetti />
                    </>
                )}
                {feedback && !feedback.isCorrect && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-red-500 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-2xl sm:text-4xl font-bold animate-bounce border-4 border-white text-center max-w-[90%]">
                            {feedback.message}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes drop {
                    0% { transform: translateY(-50px); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(400px); opacity: 0; }
                }
                .animate-drop { animation: drop 0.8s infinite linear; }
            `}</style>
        </div>
    );
};

export default WeatherExplorerGame;
