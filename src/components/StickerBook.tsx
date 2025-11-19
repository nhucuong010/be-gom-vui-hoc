import React from 'react';
import type { Sticker } from '../types';
import { HomeIcon } from './icons';

interface StickerBookProps {
    unlockedStickers: Sticker[];
    allStickerNames: { id: string; name: string }[];
    onGoHome: () => void;
}

const StickerBook: React.FC<StickerBookProps> = ({ unlockedStickers, allStickerNames, onGoHome }) => {
    // FIX: Explicitly type the Map to ensure correct type inference for its values.
    // This resolves an issue where `sticker` was inferred as `unknown` because the
    // `unlockedStickers` prop, while typed, might receive an `any[]` from `JSON.parse`.
    const unlockedStickerMap: Map<string, Sticker> = new Map(unlockedStickers.map(s => [s.id, s]));

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-4">
            <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
                    <HomeIcon className="w-12 h-12" />
                </button>
                <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-8 mt-12">Sổ Dán Hình Của Bé</h2>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {allStickerNames.map(({id, name}) => {
                        const sticker = unlockedStickerMap.get(id);
                        return (
                            <div key={id} className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl bg-white shadow-md transition-transform hover:scale-105">
                                <div className="w-full h-full flex items-center justify-center">
                                    {sticker ? (
                                        <img src={sticker.imageUrl} alt={sticker.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-6xl text-gray-400">?</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-lg text-center mt-1 text-purple-800 font-semibold h-12 flex items-center">{name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StickerBook;