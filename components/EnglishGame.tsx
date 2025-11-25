
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { englishLessons } from '../data/englishLessons';
import { generateImageFromText } from '../services/imageService';
import { imagePrompts } from '../data/imagePrompts';
import type { EnglishLesson, VocabularyItem } from '../types';
import { HomeIcon } from './icons';
import { playSound, speak, stopAllSounds } from '../services/audioService';
import ReadAloudButton from './ReadAloudButton';

interface EnglishGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

interface CardData extends VocabularyItem {
    // Audio is handled by the centralized service now
}

const EnglishGame: React.FC<EnglishGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [selectedLesson, setSelectedLesson] = useState<EnglishLesson | null>(null);
    const [lessonData, setLessonData] = useState<CardData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);

    // Xáo trộn thứ tự bài học mỗi khi vào game để tạo sự mới mẻ
    const shuffledLessons = useMemo(() =>
        [...englishLessons].sort(() => Math.random() - 0.5),
        []);

    const handleSelectLesson = useCallback(async (lesson: EnglishLesson) => {
        playSound('click', isSoundOn);
        setSelectedLesson(lesson);
        setIsLoading(true);
        // Directly use the vocabulary data with static URLs, no dynamic generation.
        setLessonData(lesson.vocabulary);
        setCurrentCard(0);
        setIsLoading(false);
    }, [isSoundOn]);

    const handleNextCard = () => {
        playSound('click', isSoundOn);
        onCorrectAnswer();
        const nextCard = currentCard + 1;
        if (nextCard < lessonData.length) {
            setCurrentCard(nextCard);
        } else {
            setSelectedLesson(null);
        }
    };

    const handlePrevCard = () => {
        playSound('click', isSoundOn);
        if (currentCard > 0) {
            setCurrentCard(currentCard - 1);
        }
    };

    // Helper function to determine if audio should come from 'english' folder
    // UPDATED: Always use 'english' folder for EnglishGame as all assets are being migrated there.
    const getAudioLocation = (text: string, lessonNum: number): 'english' | undefined => {
        return 'english';
    };

    if (!selectedLesson) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-6xl bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-6 relative max-h-full overflow-y-auto flex flex-col">
                    <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
                        <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
                    </button>
                    <h2 className="text-4xl md:text-6xl font-bold text-center text-purple-700 mb-8 mt-8 flex-shrink-0">Bé Học Tiếng Anh</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto p-2">
                        {shuffledLessons.map(lesson => (
                            <button
                                key={lesson.lesson}
                                onClick={() => handleSelectLesson(lesson)}
                                className="bg-white p-4 rounded-3xl shadow-lg hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out flex flex-col items-center justify-start text-purple-800 focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                            >
                                <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden shadow-inner">
                                    {lesson.vocabulary[0] && (
                                        <img src={lesson.vocabulary[0].imageUrl} alt={lesson.title} className="w-full h-full object-contain p-4" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-semibold text-pink-500">Bài {lesson.lesson}</p>
                                    <h3 className="text-3xl font-bold mt-1 leading-tight">{lesson.title}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center p-16 bg-white bg-opacity-80 rounded-3xl shadow-xl">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-xl text-purple-600 font-semibold">Đang chuẩn bị bài học cho bé...</p>
            </div>
        );
    }

    if (!isLoading && lessonData.length === 0) {
        return (
            <div className="w-full max-w-xl mx-auto">
                <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative text-center">
                    <h2 className="text-3xl font-bold text-red-600 mb-4">Lỗi Tải Bài Học</h2>
                    <p className="text-lg text-gray-700 mb-6">Rất tiếc, đã có lỗi xảy ra khi chuẩn bị bài học. <br />Bé hãy thử lại sau nhé.</p>
                    <button
                        onClick={() => { playSound('click', isSoundOn); setSelectedLesson(null); }}
                        className="bg-purple-500 text-white font-bold px-8 py-3 rounded-full text-xl shadow-lg hover:bg-purple-600 transition-colors"
                    >
                        Chọn bài khác
                    </button>
                </div>
            </div>
        );
    }


    const card = lessonData[currentCard];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
            <div className="w-full max-w-2xl bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 relative flex flex-col max-h-full overflow-y-auto">
                <button onClick={() => { playSound('click', isSoundOn); stopAllSounds(); setSelectedLesson(null); }} className="absolute top-2 left-2 sm:top-4 sm:left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 sm:w-12 sm:h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </button>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-purple-700 mb-2 mt-8 sm:mt-10 flex-shrink-0">{selectedLesson.title}</h2>

                <div className="flex-shrink-1 aspect-square w-full max-h-[40vh] bg-gray-100 rounded-2xl overflow-hidden shadow-inner my-2 sm:my-4 flex items-center justify-center mx-auto">
                    <img src={card.imageUrl} alt={card.word} className="w-full h-full object-contain" />
                </div>

                <div className="text-center flex-shrink-0">
                    <div className="flex items-center justify-center gap-4">
                        <h3 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 capitalize">{card.word}</h3>
                        <ReadAloudButton
                            text={card.word}
                            isSoundOn={isSoundOn}
                            lang="en"
                            game={getAudioLocation(card.word, selectedLesson.lesson)}
                        />
                    </div>
                    <p className="text-2xl sm:text-3xl text-pink-500 font-semibold mb-2">{card.vietnamese}</p>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-xl sm:text-2xl text-gray-600">{card.sentence}</p>
                        <ReadAloudButton
                            text={card.sentence}
                            isSoundOn={isSoundOn}
                            lang="en"
                            game={getAudioLocation(card.sentence, selectedLesson.lesson)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 sm:mt-6 flex-shrink-0">
                    <button onClick={handlePrevCard} disabled={currentCard === 0} className="px-6 py-3 sm:px-8 sm:py-4 bg-gray-300 rounded-lg font-bold text-gray-600 disabled:opacity-50 text-lg sm:text-xl">
                        Trước
                    </button>
                    <span className="font-semibold text-purple-700 text-lg sm:text-xl">{currentCard + 1} / {lessonData.length}</span>
                    <button onClick={handleNextCard} className="px-6 py-3 sm:px-8 sm:py-4 bg-green-400 rounded-lg font-bold text-white hover:bg-green-500 text-lg sm:text-xl">
                        {currentCard === lessonData.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EnglishGame;
