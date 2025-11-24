
import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import MathGame from './components/MathGame';
import SpellingGame from './components/SpellingGame';
import MemoryGame from './components/MemoryGame';
import EnglishGame from './components/EnglishGame';
import EnglishStoryGame from './components/EnglishStoryGame';
import DiceGame from './components/DiceGame';
import FillInTheBlankGame from './components/FillInTheBlankGame';
import FeedingGame from './components/FeedingGame';
import SpellingRobotGame from './components/SpellingRobotGame';
import BakeryGame from './components/BakeryGame';
import PrincessCodeGame from './components/PrincessCodeGame';
import RestaurantGame from './components/RestaurantGame';
import StreetFoodGame from './components/StreetFoodGame';
import BunnyRescueGame from './components/BunnyRescueGame';
import GardenMemoryGame from './components/GardenMemoryGame';
import CapybaraRescueGame from './components/CapybaraRescueGame';
import TimeAdventureGame from './components/TimeAdventureGame';
import OnlineShoppingGame from './components/OnlineShoppingGame';
import WeatherExplorerGame from './components/WeatherExplorerGame';
import SupermarketGame from './components/SupermarketGame';
import CatchGame from './components/CatchGame';
import PianoGame from './components/PianoGame';
import ResourceGenerator from './components/ResourceGenerator';
import StickerUnlockedPopup from './components/StickerUnlockedPopup';
import RewardProgress from './components/RewardProgress';
import CartoonPlayer from './components/CartoonPlayer';
import type { GameState, Sticker } from './types';
import { imagePrompts } from './data/imagePrompts';
import { preloadSounds, playSound, stopAllSounds } from './services/audioService';

import { SpeakerOnIcon, SpeakerOffIcon } from './components/icons';
import { useWakeLock } from './hooks/useWakeLock';
import IOSInstallPrompt from './components/IOSInstallPrompt';

// Import data sources for sticker aggregation
import { supermarketItems } from './data/supermarketData';
import { scienceItems } from './data/weatherGameData';
import { restaurantMenuItems, restaurantCustomers } from './data/restaurantData';
import { MENU as streetFoodMenu } from './data/streetFoodData';

// --- Cấu hình hệ thống khen thưởng ---
const STICKER_REWARD_THRESHOLD = 10; // Cần 10 câu đúng để có sticker
const BIG_REWARD_THRESHOLD = 20; // Cần 20 câu đúng để xem hoạt hình
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// List of new English vocabulary files that should be in the /english/ folder
const newEnglishAssets = new Set([
    'acorn.png', 'alien.png', 'ambulance.png', 'angry.png', 'ant.png', 'artist.png', 'astronaut.png', 'aunt.png',
    'baby.png', 'backpack.png', 'badminton.png', 'bag.png', 'ball_pit.png', 'balloon_toy.png', 'basketball_ball.png',
    'bathtub.png', 'bear.png', 'bee.png', 'bench.png', 'bike.png', 'binoculars.png', 'black.png', 'blocks.png',
    'book.png', 'bored.png', 'bread.png', 'bus.png', 'chicken.png', 'circle.png', 'coat.png', 'cold.png',
    'computer.png', 'cookie.png', 'cousin.png', 'cow.png', 'crayon.png', 'crocodile.png', 'dance.png', 'diamond.png',
    'dinosaur.png', 'donkey.png', 'dress.png', 'drink.png', 'drum.png', 'ears.png', 'egg.png', 'eight.png',
    'elephant.png', 'eleven.png', 'english_bed.png', 'english_bird.png', 'english_blanket.png',
    'english_bookshelf.png', 'english_butterfly.png', 'english_campfire.png', 'english_castle.png',
    'english_caterpillar.png', 'english_chef.png', 'english_clock.png', 'english_cloud.png', 'english_comet.png',
    'english_compass.png', 'english_crown.png', 'english_cushion.png', 'english_doctor.png', 'english_dolphin.png',
    'english_dragon.png', 'english_dragonfly.png', 'english_drum_music.png', 'english_ducky.png', 'english_earth.png',
    'english_fairy.png', 'english_farmer.png', 'english_firefighter.png', 'english_firefly.png',
    'english_flashlight.png', 'english_flower.png', 'english_flute.png', 'english_forest.png',
    'english_gold_medal.png', 'english_grass.png', 'english_grasshopper.png', 'english_guitar.png', 'english_leaf.png',
    'english_moon.png', 'english_octopus.png', 'eraser.png', 'family.png', 'fifteen.png', 'fire_truck.png',
    'foggy.png', 'fourteen.png', 'giraffe.png', 'gloves.png', 'glue.png', 'goat.png', 'gold.png', 'grape.png',
    'gray.png', 'hair.png', 'hands.png', 'happy.png', 'heart.png', 'helicopter.png', 'hippo.png', 'hot.png',
    'hungry.png', 'icecream.png', 'jacket.png', 'swimming_goggles.png'
]);

const getImagePath = (filename: string, game: string): string => {
    if (game === 'writing') return `${ASSET_BASE_URL}/assets/images/chucai/${filename}`;
    if (game === 'weather_explorer') return `${ASSET_BASE_URL}/assets/images/khampha/${filename}`;
    if (game === 'time_adventure') return `${ASSET_BASE_URL}/assets/images/thoitiet/${filename}`;
    if (game === 'online_shopping') return `${ASSET_BASE_URL}/assets/images/muasam/${filename}`;
    if (game === 'english' && newEnglishAssets.has(filename)) return `${ASSET_BASE_URL}/assets/images/english/${filename}`;
    return `${ASSET_BASE_URL}/assets/images/${filename}`;
};

// --- AGGREGATE ALL STICKERS FROM ALL GAMES ---
const generateAllStickers = (): Sticker[] => {
    const stickerMap = new Map<string, Sticker>();

    // 1. From Image Prompts (Core Assets)
    imagePrompts.forEach(prompt => {
        if (!['cover', 'memory_math'].includes(prompt.game)) {
            stickerMap.set(prompt.filename, {
                id: prompt.filename,
                name: prompt.word,
                imageUrl: getImagePath(prompt.filename, prompt.game)
            });
        }
    });

    // 2. From Supermarket Data
    supermarketItems.forEach(item => {
        if (!stickerMap.has(item.id)) {
            stickerMap.set(item.id, { id: item.id, name: item.name, imageUrl: item.imageUrl });
        }
    });

    // 3. From Weather/Science Data
    scienceItems.forEach(item => {
        if (!stickerMap.has(item.id)) {
            stickerMap.set(item.id, { id: item.id, name: item.name, imageUrl: item.imageUrl });
        }
    });

    // 4. From Restaurant Data
    restaurantMenuItems.forEach(item => {
        if (!stickerMap.has(item.id)) {
            stickerMap.set(item.id, { id: item.id, name: item.name, imageUrl: item.imageUrl });
        }
    });
    restaurantCustomers.forEach(item => {
        if (!stickerMap.has(item.id)) {
            stickerMap.set(item.id, { id: item.id, name: item.name, imageUrl: item.imageUrl });
        }
    });

    // 5. From Street Food Data (Items & Steps)
    Object.values(streetFoodMenu).forEach(item => {
        // Add finished product
        const finishedStep = item.steps[item.steps.length - 1];
        if (finishedStep && !stickerMap.has(item.id)) {
            stickerMap.set(item.id, { id: item.id, name: item.name, imageUrl: finishedStep.imageUrl });
        }
    });

    return Array.from(stickerMap.values());
};

const allStickers = generateAllStickers();


const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('home');
    const [correctAnswersForSticker, setCorrectAnswersForSticker] = useState(0);
    const [correctAnswersForBigReward, setCorrectAnswersForBigReward] = useState(0);
    const [showCartoon, setShowCartoon] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);

    // Vẫn giữ logic unlock cho tính năng thưởng, nhưng StickerBook sẽ hiển thị tất cả
    const [unlockedStickers, setUnlockedStickers] = useState<Sticker[]>(() => {
        try {
            const savedStickersJson = localStorage.getItem('unlockedStickers');
            return savedStickersJson ? JSON.parse(savedStickersJson) : [];
        } catch (error) {
            return [];
        }
    });

    const [lastUnlockedSticker, setLastUnlockedSticker] = useState<Sticker | null>(null);

    useEffect(() => {
        preloadSounds();
    }, []);

    useWakeLock();

    useEffect(() => {
        try {
            localStorage.setItem('unlockedStickers', JSON.stringify(unlockedStickers));
        } catch (error) {
            console.error("Failed to save unlocked stickers");
        }
    }, [unlockedStickers]);

    const handleCorrectAnswer = () => {
        const newStickerCount = correctAnswersForSticker + 1;
        const newBigRewardCount = correctAnswersForBigReward + 1;

        setCorrectAnswersForSticker(newStickerCount);
        setCorrectAnswersForBigReward(newBigRewardCount);

        // --- Logic thưởng Sticker (Vẫn giữ để tạo niềm vui bất ngờ) ---
        if (newStickerCount >= STICKER_REWARD_THRESHOLD) {
            setCorrectAnswersForSticker(0); // Reset counter

            const remainingStickers = allStickers.filter(
                s => !unlockedStickers.find(us => us.id === s.id)
            );

            if (remainingStickers.length > 0) {
                const randomSticker = remainingStickers[Math.floor(Math.random() * remainingStickers.length)];
                setUnlockedStickers(prev => [...prev, randomSticker]);
                setLastUnlockedSticker(randomSticker);
            }
        }

        // --- Logic thưởng lớn (Hoạt hình) ---
        if (newBigRewardCount >= BIG_REWARD_THRESHOLD) {
            setShowCartoon(true);
            setCorrectAnswersForBigReward(0);
        }
    };

    const toggleSound = () => {
        const newSoundState = !isSoundOn;
        setIsSoundOn(newSoundState);
        if (!newSoundState) {
            stopAllSounds();
        }
    };

    const renderGame = () => {
        const gameProps = {
            onGoHome: () => {
                playSound('click', isSoundOn);
                stopAllSounds();
                setGameState('home');
            },
            onCorrectAnswer: handleCorrectAnswer,
            isSoundOn: isSoundOn,
        };

        switch (gameState) {
            case 'math': return <MathGame {...gameProps} />;
            case 'spelling': return <SpellingGame {...gameProps} />;
            case 'memory': return <MemoryGame {...gameProps} />;
            case 'english': return <EnglishGame {...gameProps} />;
            case 'english_story': return <EnglishStoryGame {...gameProps} />;
            case 'dice': return <DiceGame {...gameProps} />;
            case 'fill_in_the_blank': return <FillInTheBlankGame {...gameProps} />;
            case 'feeding': return <FeedingGame {...gameProps} />;
            case 'spelling_robot': return <SpellingRobotGame {...gameProps} />;
            case 'bakery': return <BakeryGame {...gameProps} />;
            case 'princess_code': return <PrincessCodeGame {...gameProps} />;
            case 'restaurant': return <RestaurantGame {...gameProps} />;
            case 'street_food': return <StreetFoodGame {...gameProps} />;
            case 'bunny_rescue': return <BunnyRescueGame {...gameProps} />;
            case 'garden_memory': return <GardenMemoryGame {...gameProps} />;
            case 'capybara_rescue': return <CapybaraRescueGame {...gameProps} />;
            case 'time_adventure': return <TimeAdventureGame {...gameProps} />;
            case 'online_shopping': return <OnlineShoppingGame {...gameProps} />;
            case 'weather_explorer': return <WeatherExplorerGame {...gameProps} />;
            case 'supermarket': return <SupermarketGame {...gameProps} />;
            case 'catch_game': return <CatchGame {...gameProps} />;
            case 'piano': return <PianoGame onGoHome={gameProps.onGoHome} isSoundOn={isSoundOn} />;
            case 'resource_generator':
                return <ResourceGenerator onGoHome={gameProps.onGoHome} isSoundOn={isSoundOn} />;
            case 'home':
            default:
                return <HomeScreen onSelectGame={(game) => setGameState(game)} isSoundOn={isSoundOn} />;
        }
    };

    const showRewardProgress = !['home', 'resource_generator'].includes(gameState);

    return (
        <main className="fixed inset-0 h-[100dvh] w-full bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 font-sans select-none">
            <div className="w-full h-full overflow-y-auto pt-safe flex flex-col items-center justify-start p-4 sm:p-6 md:py-8 md:px-4 gap-4">
                {showRewardProgress && (
                    <RewardProgress current={correctAnswersForBigReward} goal={BIG_REWARD_THRESHOLD} />
                )}
                <div className="relative w-full flex flex-col items-center flex-grow">
                    {renderGame()}
                </div>
            </div>

            {lastUnlockedSticker && (
                <StickerUnlockedPopup
                    sticker={lastUnlockedSticker}
                    onClose={() => {
                        playSound('click', isSoundOn);
                        setLastUnlockedSticker(null);
                    }}
                    isSoundOn={isSoundOn}
                />
            )}
            {showCartoon && (
                <CartoonPlayer
                    onClose={() => {
                        playSound('click', isSoundOn);
                        setShowCartoon(false);
                    }}
                    isSoundOn={isSoundOn}
                />
            )}
            <button
                onClick={toggleSound}
                className="fixed bottom-6 right-6 bg-white p-4 rounded-full shadow-lg z-50 transform transition-transform hover:scale-110 active:scale-95"
                aria-label={isSoundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            >
                {isSoundOn
                    ? <SpeakerOnIcon className="w-10 h-10 text-purple-600" />
                    : <SpeakerOffIcon className="w-10 h-10 text-gray-500" />
                }
            </button>
            <IOSInstallPrompt />
        </main>
    );
};

export default App;