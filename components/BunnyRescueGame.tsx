
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { bunnyRescueLevels } from '../data/bunnyRescueData';
import type { BunnyRescueLevel, BunnyRescueStep } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';

// --- Interfaces & Types ---
interface BunnyRescueGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}
type GamePhase = 'operation_select' | 'playing' | 'help' | 'level_complete';
type OperationType = 'add' | 'subtract' | 'mixed';
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets/images';

// --- Constants & Scenarios ---
// Tọa độ cho nhân vật và các bước đi (theo %)
// Bối cảnh: Chảy chéo từ góc dưới-trái (bờ xuất phát) lên góc trên-phải (bờ đích)
const START_POS = { top: 80, left: 10 };
const END_POS = { top: 20, left: 90 }; // Vị trí của Thỏ bên bờ phải

// Tọa độ các bước (Zigzag nhẹ)
const PATH_COORDS = [
    { top: 70, left: 25 },
    { top: 60, left: 40 },
    { top: 50, left: 55 },
    { top: 40, left: 70 },
    { top: 30, left: 85 }, // Bước cuối gần bờ phải
];

interface SceneConfig {
    id: string;
    bg: string;
    item: string;
    player: string; // Gốm image
    friendWait: string;
    friendHappy: string;
    victoryImage: string;
    themeColor: string;
    friendName: string;
    movementType: 'jump' | 'row'; // 'jump' for land/lilypad, 'row' for boat
}

const SCENES: Record<string, SceneConfig> = {
    river: {
        id: 'river',
        bg: 'br_bg_river.png',
        item: 'br_item_lilypad.png',
        player: 'br_gom_jump.png',
        friendWait: 'br_bunny_wait.png',
        friendHappy: 'br_bunny_happy.png',
        victoryImage: 'br_gom_hug_bunny.png',
        themeColor: 'text-blue-600',
        friendName: 'Thỏ Bông',
        movementType: 'jump'
    },
    forest: {
        id: 'forest',
        bg: 'br_bg_forest.png',
        item: 'br_item_mushroom.png',
        player: 'br_gom_jump.png',
        friendWait: 'br_bunny_wait.png',
        friendHappy: 'br_bunny_happy.png',
        victoryImage: 'br_gom_hug_bunny.png',
        themeColor: 'text-green-600',
        friendName: 'Thỏ Bông',
        movementType: 'jump'
    },
    island: {
        id: 'island',
        bg: 'br_bg_island.png',
        item: 'br_item_rock.png',
        player: 'br_gom_row.png',
        friendWait: 'br_labunu_wait.png',
        friendHappy: 'br_labunu_happy.png',
        victoryImage: 'br_gom_hug_labunu.png',
        themeColor: 'text-teal-600',
        friendName: 'Labunu',
        movementType: 'row'
    },
    candy: {
        id: 'candy',
        bg: 'br_bg_candy.png',
        item: 'br_item_cookie.png',
        player: 'br_gom_jump.png',
        friendWait: 'br_teddy_wait.png',
        friendHappy: 'br_teddy_happy.png',
        victoryImage: 'br_gom_hug_teddy.png',
        themeColor: 'text-pink-600',
        friendName: 'Gấu Bông',
        movementType: 'jump'
    },
    snow: {
        id: 'snow',
        bg: 'br_bg_snow.png',
        item: 'br_item_ice.png',
        player: 'br_gom_jump.png',
        friendWait: 'br_penguin_wait.png',
        friendHappy: 'br_penguin_happy.png',
        victoryImage: 'br_gom_hug_penguin.png',
        themeColor: 'text-cyan-600',
        friendName: 'Cánh Cụt',
        movementType: 'jump'
    }
};


// --- Helper Components ---

const SpeechBubble: React.FC<{ text: string; position: 'left' | 'right' }> = ({ text, position }) => (
    <div className={`absolute z-20 bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-gray-200 animate-pop-in
        ${position === 'left' ? 'left-0 -top-16 rounded-bl-none' : 'right-0 -top-16 rounded-br-none'}
    `}>
        <p className="text-lg font-bold text-gray-800 whitespace-nowrap">{text}</p>
        <div className={`absolute bottom-[-8px] w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white 
            ${position === 'left' ? 'left-4' : 'right-4'}
        `}></div>
    </div>
);

const VisualHelp: React.FC<{
    problem: BunnyRescueStep;
    onClose: () => void;
    isSoundOn: boolean;
}> = ({ problem, onClose, isSoundOn }) => {
    const { operation, num1, num2 } = problem;

    useEffect(() => {
        playDynamicSentence(`Mình cùng đếm lại nhé!`, 'vi', isSoundOn, 'bunny_rescue');
    }, [isSoundOn]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md m-4 text-center transform scale-100 animate-pop-in">
                <h3 className="text-3xl font-bold text-purple-700 mb-4">Gợi ý cho bé</h3>
                <div className="flex flex-col items-center gap-6 p-6 bg-purple-50 rounded-2xl border-2 border-purple-100">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {Array.from({ length: num1 }).map((_, i) => (
                            <img
                                key={`num1-${i}`}
                                src={`${ASSET_BASE_URL}/${operation === 'subtract' && i >= num1 - num2 ? 'br_dot_crossed.png' : 'br_dot_blue.png'}`}
                                alt="dot"
                                className="w-10 h-10 drop-shadow-sm"
                            />
                        ))}
                    </div>
                    {operation === 'add' && (
                        <>
                            <span className="text-4xl font-black text-purple-400">+</span>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {Array.from({ length: num2 }).map((_, i) => (
                                    <img key={`num2-${i}`} src={`${ASSET_BASE_URL}/br_dot_red.png`} alt="dot" className="w-10 h-10 drop-shadow-sm" />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <p className="text-4xl font-bold text-purple-800 my-6 tracking-wider">{problem.problem} = ?</p>
                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold py-4 rounded-xl text-2xl shadow-lg hover:scale-105 transition-transform"
                >
                    Đã hiểu rồi!
                </button>
            </div>
        </div>
    );
};

const GameTypeButton: React.FC<{ title: string; onClick: () => void; imageUrl: string }> = ({ title, onClick, imageUrl }) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center gap-4 group border-4 border-transparent hover:border-purple-200"
    >
        <div className="w-32 h-32 relative">
            <div className="absolute inset-0 bg-purple-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-contain z-10" />
        </div>
        <span className="text-2xl md:text-3xl font-bold text-purple-700 group-hover:text-pink-600 transition-colors">{title}</span>
    </button>
);

// --- Main Component ---
const BunnyRescueGame: React.FC<BunnyRescueGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [phase, setPhase] = useState<GamePhase>('operation_select');
    const [currentLevelData, setCurrentLevelData] = useState<BunnyRescueLevel | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [gomPosition, setGomPosition] = useState(START_POS);
    const [isMoving, setIsMoving] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [pathVisible, setPathVisible] = useState<boolean[]>([false, false, false, false, false]);
    const [ripples, setRipples] = useState<number | null>(null);
    const [currentScene, setCurrentScene] = useState(SCENES.river);

    // Randomize scene on mount or reset
    useEffect(() => {
        if (phase === 'operation_select') {
            const sceneKeys = Object.keys(SCENES);
            const randomKey = sceneKeys[Math.floor(Math.random() * sceneKeys.length)];
            setCurrentScene(SCENES[randomKey]);
        }
    }, [phase]);

    const startLevel = useCallback((opType: OperationType) => {
        setFeedback(null);
        setPathVisible([false, false, false, false, false]);
        setGomPosition(START_POS);
        setCurrentStepIndex(0);
        setRipples(null);

        const allProblems = bunnyRescueLevels.flatMap(l => l.steps);
        let filteredProblems = opType === 'mixed' ? allProblems : allProblems.filter(p => p.operation === opType);

        const levelProblems = filteredProblems.sort(() => 0.5 - Math.random()).slice(0, 5);
        setCurrentLevelData({ level: 1, steps: levelProblems });

        setPhase('playing');
        // Updated intro with dynamic friend name
        const introText = `Bạn ${currentScene.friendName} đang đợi ở cuối đường. Gốm ơi cứu tớ với!`;
        playDynamicSentence(introText, 'vi', isSoundOn, 'bunny_rescue');
    }, [isSoundOn, currentScene]);

    const handleAnswer = (answer: number) => {
        if (feedback || isMoving || !currentLevelData) return;

        playSound('click', isSoundOn);
        const correct = answer === currentLevelData.steps[currentStepIndex].answer;

        if (correct) {
            setFeedback('correct');
            onCorrectAnswer();
            playSound('correct', isSoundOn);
            const moveText = currentScene.movementType === 'row' ? "Hay quá! Chèo thêm một đoạn nào." : "Hay quá! Nhảy một bước nào.";
            playDynamicSentence(moveText, 'vi', isSoundOn, 'bunny_rescue');

            // 1. Vật phẩm (Lá sen/Nấm/Đá) nổi lên
            const newPathVisible = [...pathVisible];
            newPathVisible[currentStepIndex] = true;
            setPathVisible(newPathVisible);
            setRipples(currentStepIndex);

            // 2. Gốm di chuyển (nhảy hoặc chèo)
            setTimeout(() => {
                setIsMoving(true);
                if (currentScene.movementType === 'jump') {
                    playSound('jump', isSoundOn);
                } else {
                    // Could add a splashing/rowing sound here
                }

                setGomPosition(PATH_COORDS[currentStepIndex]);

                // 3. Kết thúc di chuyển
                setTimeout(() => {
                    setIsMoving(false);
                    setFeedback(null);

                    if (currentStepIndex >= 4) {
                        setPhase('level_complete');
                        // Move Gom to final position (bunny's side) for the hug
                        setGomPosition(END_POS);
                        playSound('win', isSoundOn);
                        // NEW: Updated victory message sequence
                        const winSequence = async () => {
                            await playDynamicSentence(`Tuyệt vời! Gốm đã cứu được ${currentScene.friendName} rồi.`, 'vi', isSoundOn, 'bunny_rescue');
                            await new Promise(r => setTimeout(r, 500));
                            await playDynamicSentence("Cảm ơn Gốm đã cứu tớ nhé! Bạn thật tốt bụng.", 'vi', isSoundOn, 'bunny_rescue');
                        };
                        winSequence();
                    } else {
                        setCurrentStepIndex(prev => prev + 1);
                    }
                }, 700); // Match animation duration
            }, 400);

        } else {
            setFeedback('incorrect');
            playSound('incorrect', isSoundOn);
            const failText = `Chưa đúng rồi, bạn ${currentScene.friendName} đang đợi, thử lại nhé.`;
            playDynamicSentence(failText, 'vi', isSoundOn, 'bunny_rescue');
            setTimeout(() => {
                setPhase('help');
                setFeedback(null);
            }, 2000);
        }
    };

    // --- Render Logic ---

    if (phase === 'operation_select') {
        return (
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-4 min-h-screen justify-center">
                <div className="w-full bg-white/90 backdrop-blur-md rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden border-4 border-purple-100">
                    <button onClick={onGoHome} className="absolute top-6 left-6 text-purple-400 hover:text-pink-500 transition-colors">
                        <HomeIcon className="w-12 h-12" />
                    </button>

                    <div className="text-center mb-12">
                        <h2 className="text-5xl md:text-6xl font-black text-purple-700 mb-4 tracking-tight">Vượt Sông Cứu Bạn</h2>
                        <p className="text-2xl text-pink-500 font-bold">Gốm ơi, hãy giải toán để tạo lối đi cứu bạn nhé!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <GameTypeButton title="Phép Cộng" onClick={() => startLevel('add')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-plus.png" />
                        <GameTypeButton title="Phép Trừ" onClick={() => startLevel('subtract')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-minus.png" />
                        <GameTypeButton title="Tổng hợp" onClick={() => startLevel('mixed')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-question.png" />
                    </div>
                </div>
            </div>
        );
    }

    const currentProblem = currentLevelData?.steps[currentStepIndex];
    const isWin = phase === 'level_complete';

    // Animation class based on movement type
    const animationClass = currentScene.movementType === 'jump' ? 'animate-jump-arc' : 'animate-row-slide';

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center p-2 md:p-6 h-full justify-start">
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl p-4 md:p-6 relative flex flex-col gap-6 max-h-full overflow-y-auto">
                {/* Header Controls */}
                <div className="flex justify-between items-center px-2">
                    <button onClick={onGoHome} className="text-purple-500 hover:text-pink-500 transition-colors bg-white p-2 rounded-full shadow-sm">
                        <HomeIcon className="w-10 h-10" />
                    </button>
                    <button onClick={() => setPhase('operation_select')} className="bg-purple-100 text-purple-700 font-bold px-6 py-2 rounded-full hover:bg-purple-200 transition-colors">
                        Chọn lại
                    </button>
                </div>

                {/* --- GAME SCENE --- */}
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-cover bg-center rounded-3xl shadow-inner overflow-hidden border-4 border-white"
                    style={{ backgroundImage: `url(${ASSET_BASE_URL}/${currentScene.bg})` }}>

                    {/* Đích đến (Bạn Thỏ/Labunu) - Ẩn khi thắng để hiện hình ôm nhau */}
                    <div className="absolute transition-all duration-500 z-10" style={{ top: `${END_POS.top}%`, left: `${END_POS.left}%`, transform: 'translate(-50%, -50%)' }}>
                        {!isWin && (
                            <div className="relative">
                                <SpeechBubble text="Cứu tớ với!" position="right" />
                                <img
                                    src={`${ASSET_BASE_URL}/${currentScene.friendWait}`}
                                    alt="Friend"
                                    className="w-24 md:w-32 lg:w-40 drop-shadow-md animate-bounce-slow"
                                    style={{ mixBlendMode: 'multiply' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Con đường (Lá sen / Nấm / Đá) */}
                    {PATH_COORDS.map((coord, index) => (
                        <div key={index} className="absolute" style={{ top: `${coord.top}%`, left: `${coord.left}%`, transform: 'translate(-10%, -10%)' }}>
                            {/* Ripple Effect */}
                            {ripples === index && (
                                <div className="absolute inset-0 border-4 border-white/60 rounded-full animate-ripple" />
                            )}
                            <img
                                src={`${ASSET_BASE_URL}/${currentScene.item}`}
                                alt="step"
                                className={`w-24 md:w-36 object-contain transition-all duration-500 ${pathVisible[index] ? 'scale-100 opacity-100 animate-elastic-appear' : 'scale-0 opacity-0'}`}
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </div>
                    ))}

                    {/* Nhân vật chính (Gốm) */}
                    <div
                        className="absolute z-20 transition-all duration-1000 ease-in-out will-change-transform"
                        style={{
                            // Khi thắng: Đưa về chính giữa màn hình (50%, 50%). Khi chơi: Theo tọa độ.
                            top: isWin ? '50%' : `${gomPosition.top}%`,
                            left: isWin ? '50%' : `${gomPosition.left}%`,
                            // Transform:
                            // - Chơi: translate(-60%, -100%) -> Đẩy lên cao và lùi sang trái để đứng lên nấm/lá sen.
                            // - Thắng: translate(-50%, -50%) -> Căn giữa hoàn hảo cho hình to.
                            transform: isWin ? 'translate(-50%, -50%)' : 'translate(-60%, -100%)'
                        }}
                    >
                        <div className={`relative ${isMoving ? animationClass : ''}`}>
                            {phase === 'help' && <SpeechBubble text="Khó quá..." position="left" />}
                            {isWin && <SpeechBubble text="Yeahhh!" position="left" />}
                            <img
                                src={`${ASSET_BASE_URL}/${isWin ? currentScene.victoryImage : (phase === 'help' ? 'br_gom_thinking.png' : currentScene.player)}`}
                                alt="Gốm"
                                // Khi thắng: Ảnh rất to (w-64 md:w-96). Khi chơi: Ảnh vừa.
                                className={`object-contain drop-shadow-xl transition-all duration-1000 ${isWin ? 'w-64 md:w-96' : 'w-28 md:w-36'}`}
                            // Remove mixBlendMode for character to ensure correct colors
                            />
                        </div>
                    </div>
                </div>

                {/* --- CONTROLS --- */}
                {isWin ? (
                    <div className="text-center py-4 animate-fade-in">
                        <Confetti />
                        <h2 className="text-5xl font-black text-green-500 mb-4">THÀNH CÔNG RỒI!</h2>
                        <p className="text-2xl text-gray-600 mb-6">Gốm đã đến nơi cứu bạn {currentScene.friendName}!</p>
                        <button onClick={() => startLevel('mixed')} className="bg-pink-500 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg hover:scale-105 transition-transform animate-pulse">
                            Chơi lại
                        </button>
                    </div>
                ) : (
                    currentProblem && (
                        <div className="flex flex-col items-center justify-center gap-6 pb-4">
                            {/* Question */}
                            <div className="relative">
                                <div className={`absolute -inset-4 bg-gradient-to-r ${currentScene.themeColor === 'text-teal-600' || currentScene.themeColor === 'text-cyan-600' ? 'from-teal-200 to-cyan-200' : 'from-blue-200 to-teal-200'} rounded-full blur opacity-50`}></div>
                                <div className="relative bg-white px-10 py-4 rounded-full shadow-md border-2 border-blue-100">
                                    <p className={`text-5xl md:text-6xl font-black ${currentScene.themeColor}`}>
                                        {currentProblem.problem} = ?
                                    </p>
                                </div>
                            </div>

                            {/* Answer Buttons */}
                            <div className="grid grid-cols-3 gap-6 md:gap-12 mt-2">
                                {currentProblem.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleAnswer(opt)}
                                        disabled={!!feedback || isMoving}
                                        className="group relative w-28 h-28 md:w-36 md:h-36 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform active:scale-90 hover:scale-110"
                                    >
                                        <img
                                            src={`${ASSET_BASE_URL}/${currentScene.item}`}
                                            alt="btn bg"
                                            className="absolute inset-0 w-full h-full object-contain drop-shadow-lg group-hover:drop-shadow-xl transition-all"
                                            style={{ mixBlendMode: 'multiply' }}
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] z-10 pb-2">
                                            {opt}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>

            {phase === 'help' && currentProblem && (
                <VisualHelp
                    problem={currentProblem}
                    onClose={() => { playSound('click', isSoundOn); setPhase('playing'); }}
                    isSoundOn={isSoundOn}
                />
            )}

            <style>{`
                @keyframes jump-arc {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-100px) scale(1.1); }
                    100% { transform: translateY(0) scale(1); }
                }
                .animate-jump-arc {
                    animation: jump-arc 0.7s cubic-bezier(0.45, 0, 0.55, 1);
                }
                
                @keyframes row-slide {
                    0% { transform: translateX(0) scale(1) rotate(0deg); }
                    25% { transform: translateX(10px) rotate(2deg); } /* Row forward */
                    50% { transform: translateX(20px) scale(1.05) rotate(-1deg); } /* Momentum */
                    100% { transform: translateX(0) scale(1) rotate(0deg); }
                }
                .animate-row-slide {
                    animation: row-slide 0.7s ease-in-out;
                }

                @keyframes elastic-appear {
                    0% { transform: translate(-50%, -50%) scale(0); }
                    60% { transform: translate(-50%, -50%) scale(1.2); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
                .animate-elastic-appear {
                    animation: elastic-appear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                
                @keyframes ripple {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .animate-ripple { animation: ripple 0.8s ease-out forwards; }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            `}</style>
        </div>
    );
}

export default BunnyRescueGame;
