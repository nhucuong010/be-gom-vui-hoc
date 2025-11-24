
import React from 'react';
import type { GameState } from '../types';
import { WrenchScrewdriverIcon } from './icons';
import { playSound } from '../services/audioService';

interface HomeScreenProps {
  onSelectGame: (game: GameState) => void;
  isSoundOn: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectGame, isSoundOn }) => {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-pink-500 mb-4 text-center leading-none" style={{ fontFamily: "'Nunito', sans-serif" }}>
        Bé Gốm Vui Học
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl text-purple-600 mb-8 sm:mb-12 text-center">Cùng chọn trò chơi nào con yêu!</p>

      {/* Main Game Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {/* NEW & FEATURED */}
        <GameButton
          title="Hứng Chữ Số"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/chucai/img_num_5.png"
          onClick={() => onSelectGame('catch_game')}
          isSoundOn={isSoundOn}
          isNew
        />
        <GameButton
          title="Bé Khám Phá"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/weather_explorer_cover.png"
          onClick={() => onSelectGame('weather_explorer')}
          isSoundOn={isSoundOn}
          isNew
        />
        <GameButton
          title="Mua Sắm Online"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/online_shopping_cover.png"
          onClick={() => onSelectGame('online_shopping')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Khám Phá Thời Gian"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/time_adventure_cover.png"
          onClick={() => onSelectGame('time_adventure')}
          isSoundOn={isSoundOn}
        />

        {/* MATH & LOGIC */}
        <GameButton
          title="Giải Cứu Bóng Bay"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/capybara_rescue_cover.png"
          onClick={() => onSelectGame('capybara_rescue')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Đường Cứu Bạn Thỏ"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/bunny_rescue_cover.png"
          onClick={() => onSelectGame('bunny_rescue')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Bé Học Toán"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/math_game_cover.png"
          onClick={() => onSelectGame('math')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Tung Xúc Xắc"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/dice_game_cover.jpeg"
          onClick={() => onSelectGame('dice')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Bé Làm Nhạc Sĩ"
          imageUrl="/assets/images/covers/piano_game_cover.png"
          onClick={() => onSelectGame('piano')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Họa Sĩ Tí Hon"
          imageUrl="/assets/images/covers/coloring_game_cover.png"
          onClick={() => onSelectGame('coloring')}
          isSoundOn={isSoundOn}
          isNew
        />

        {/* ROLE PLAY & MEMORY */}
        <GameButton
          title="Khu Vườn Gốm"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/garden_memory_cover.png"
          onClick={() => onSelectGame('garden_memory')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Nhà Hàng Gốm"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/restaurant_game_cover.jpeg"
          onClick={() => onSelectGame('restaurant')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Quầy Streetfood"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/street_food_cover.jpeg"
          onClick={() => onSelectGame('street_food')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Tiệm Bánh Gốm"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/bakery_game_cover.png"
          onClick={() => onSelectGame('bakery')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Cho Thú Ăn"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/feeding_game_cover.png"
          onClick={() => onSelectGame('feeding')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Lật Thẻ Trí Nhớ"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/memory_game_cover.png"
          onClick={() => onSelectGame('memory')}
          isSoundOn={isSoundOn}
        />

        {/* LANGUAGE & STORY */}
        <GameButton
          title="Mật Mã Công Chúa"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/princess_code_cover.jpeg"
          onClick={() => onSelectGame('princess_code')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Học Đánh Vần"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/spelling_robot_cover.png"
          onClick={() => onSelectGame('spelling_robot')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Bé Ghép Chữ"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/spelling_game_cover.png"
          onClick={() => onSelectGame('spelling')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Bé Điền Chữ"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/fill_blank_game_cover.png"
          onClick={() => onSelectGame('fill_in_the_blank')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Gia Đình Gốm"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/english_story_cover.png"
          onClick={() => onSelectGame('english_story')}
          isSoundOn={isSoundOn}
        />
        <GameButton
          title="Bé Học Tiếng Anh"
          imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/covers/english_game_cover.png"
          onClick={() => onSelectGame('english')}
          isSoundOn={isSoundOn}
        />

      </div>

      {/* Resource Generator Button */}
      <div className="w-full max-w-md mt-12 sm:mt-16 pb-8">
        <button
          onClick={() => {
            playSound('click', isSoundOn);
            onSelectGame('resource_generator');
          }}
          className="w-full flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm text-purple-800 font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-white transition-colors"
        >
          <WrenchScrewdriverIcon className="w-8 h-8" />
          <span className="text-xl sm:text-2xl">Quản lý Tài nguyên</span>
        </button>
      </div>
    </div>
  );
};

interface GameButtonProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
  className?: string;
  isSoundOn: boolean;
  isNew?: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({ title, imageUrl, onClick, isSoundOn, className = '', isNew }) => (
  <button
    onClick={() => {
      playSound('click', isSoundOn);
      onClick();
    }}
    className={`bg-white text-purple-800 rounded-3xl shadow-lg p-2 flex flex-col items-center justify-end transform hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white/50 w-full aspect-square relative overflow-hidden group ${className}`}
  >
    <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

    {isNew && (
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-md z-10">
        MỚI
      </div>
    )}

    <span className="relative text-xl sm:text-2xl md:text-3xl font-black text-white text-center drop-shadow-lg leading-tight p-2 w-full break-words">{title}</span>
  </button>
);

export default HomeScreen;