
// FIX: Correctly import React, useState, and useEffect from the 'react' package. This resolves errors about them being undefined.
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
import ResourceGenerator from './components/ResourceGenerator';
import StickerBook from './components/StickerBook';
import StickerUnlockedPopup from './components/StickerUnlockedPopup';
import RewardProgress from './components/RewardProgress';
import CartoonPlayer from './components/CartoonPlayer';
import type { GameState, Sticker } from './types';
import { imagePrompts } from './data/imagePrompts';
import { preloadSounds, playSound, stopAllSounds } from './services/audioService';
import { SpeakerOnIcon, SpeakerOffIcon } from './components/icons';


// --- Cấu hình hệ thống khen thưởng ---
const STICKER_REWARD_THRESHOLD = 10; // Cần 10 câu đúng để có sticker
const BIG_REWARD_THRESHOLD = 20; // Cần 20 câu đúng để xem hoạt hình
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// Tạo danh sách sticker từ imagePrompts, chỉ lấy những mục có category là 'Sticker'
const allStickers: Sticker[] = imagePrompts
    .filter(prompt => prompt.game === 'sticker')
    .map(prompt => ({
        id: prompt.filename,
        name: prompt.word,
        imageUrl: `${ASSET_BASE_URL}/assets/images/${prompt.filename}`
    }));

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('home');
    const [correctAnswersForSticker, setCorrectAnswersForSticker] = useState(0);
    const [correctAnswersForBigReward, setCorrectAnswersForBigReward] = useState(0);
    const [showCartoon, setShowCartoon] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    
    const [unlockedStickers, setUnlockedStickers] = useState<Sticker[]>(() => {
        try {
            const savedStickers = localStorage.getItem('unlockedStickers');
            return savedStickers ? JSON.parse(savedStickers) : [];
        } catch (error) {
          console.error("Failed to parse unlocked sticker");            return [];
        }
    });

    const [lastUnlockedSticker, setLastUnlockedSticker] = useState<Sticker | null>(null);

    useEffect(() => {
        preloadSounds();
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('unlockedStickers', JSON.stringify(unlockedStickers));
        } catch (error) {
          console.error("Failed to save unlocked stickers");        }
    }, [unlockedStickers]);

    const handleCorrectAnswer = () => {
        const newStickerCount = correctAnswersForSticker + 1;
        const newBigRewardCount = correctAnswersForBigReward + 1;

        setCorrectAnswersForSticker(newStickerCount);
        setCorrectAnswersForBigReward(newBigRewardCount);

        // --- Logic thưởng Sticker ---
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
            // If turning sound OFF, stop all currently playing sounds.
            stopAllSounds();
        }
    };

  const renderGame = () => {
    const gameProps = {
      onGoHome: () => {
        playSound('click', isSoundOn);
        stopAllSounds(); // Dừng tất cả âm thanh đang phát
        setGameState('home');
      },
      onCorrectAnswer: handleCorrectAnswer,
      isSoundOn: isSoundOn,
    };

    switch (gameState) {
      case 'math':
        return <MathGame {...gameProps} />;
      case 'spelling':
        return <SpellingGame {...gameProps} />;
      case 'memory':
        return <MemoryGame {...gameProps} />;
      case 'english':
        return <EnglishGame {...gameProps} />;
      case 'english_story':
        return <EnglishStoryGame {...gameProps} />;
      case 'dice':
        return <DiceGame {...gameProps} />;
      case 'fill_in_the_blank':
        return <FillInTheBlankGame {...gameProps} />;
      case 'feeding':
        return <FeedingGame {...gameProps} />;
      case 'spelling_robot':
        return <SpellingRobotGame {...gameProps} />;
      case 'bakery':
        return <BakeryGame {...gameProps} />;
      case 'princess_code':
        return <PrincessCodeGame {...gameProps} />;
      case 'restaurant':
        return <RestaurantGame {...gameProps} />;
      case 'street_food':
        return <StreetFoodGame {...gameProps} />;
      case 'bunny_rescue':
        return <BunnyRescueGame {...gameProps} />;
      case 'garden_memory':
        return <GardenMemoryGame {...gameProps} />;
      case 'capybara_rescue':
        return <CapybaraRescueGame {...gameProps} />;
      case 'resource_generator':
        return <ResourceGenerator onGoHome={gameProps.onGoHome} isSoundOn={isSoundOn} />;
      case 'sticker_book':
        return <StickerBook 
            unlockedStickers={unlockedStickers}
            allStickerNames={allStickers.map(s => ({ id: s.id, name: s.name }))}
            onGoHome={gameProps.onGoHome}
        />;
      case 'home':
      default:
        return <HomeScreen onSelectGame={(game) => setGameState(game)} isSoundOn={isSoundOn} />;
    }
  };

  const showRewardProgress = !['home', 'sticker_book', 'resource_generator'].includes(gameState);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex flex-col items-center justify-start font-sans p-4 sm:p-6 md:py-8 md:px-4 gap-4 overflow-y-auto">
      {showRewardProgress && (
          <RewardProgress current={correctAnswersForBigReward} goal={BIG_REWARD_THRESHOLD} />
      )}
      <div className="relative w-full flex flex-col items-center">
        {renderGame()}
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
        className="fixed bottom-6 right-6 bg-white p-4 rounded-full shadow-lg z-50 transform transition-transform hover:scale-110"
        aria-label={isSoundOn ? "Tắt âm thanh" : "Bật âm thanh"}
      >
        {isSoundOn 
            ? <SpeakerOnIcon className="w-10 h-10 text-purple-600" /> 
            : <SpeakerOffIcon className="w-10 h-10 text-gray-500" />
        }
      </button>
    </main>
  );
};

export default App;
