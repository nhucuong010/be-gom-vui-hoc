import React from 'react';
import { FilmIcon } from './icons';

interface RewardProgressProps {
    current: number;
    goal: number;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ current, goal }) => {
    const progressPercentage = (current / goal) * 100;

    return (
        <div className="w-full max-w-md mx-auto p-1.5 bg-white/70 backdrop-blur-sm rounded-full shadow-lg">
            <div className="flex items-center justify-between gap-2">
                <div className="flex-shrink-0 p-2 bg-purple-200 rounded-full">
                    <FilmIcon className="w-8 h-8 sm:w-9 sm:h-9 text-purple-600" />
                </div>
                <div className="w-full bg-purple-200 rounded-full h-4 sm:h-5 overflow-hidden shadow-inner">
                    <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-300 ease-out text-center text-white font-bold flex items-center justify-end px-2 text-xs"
                        style={{ width: `${progressPercentage}%` }}
                    >
                       {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
                    </div>
                </div>
                <div className="flex-shrink-0 pr-2">
                    <span className="font-bold text-purple-700 text-base sm:text-lg">
                        {current}/{goal}
                    </span>
                </div>
            </div>
             <p className="text-center text-xs sm:text-sm text-purple-800 mt-1 font-bold">✨ Thưởng Phim Hoạt Hình ✨</p>
        </div>
    );
};

export default RewardProgress;