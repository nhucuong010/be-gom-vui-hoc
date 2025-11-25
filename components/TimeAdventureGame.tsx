
import React, { useState, useEffect, useCallback } from 'react';
import { timeAdventureQuestions } from '../data/timeAdventureData';
import type { TimeAdventureQuestion } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import ReadAloudButton from './ReadAloudButton';

interface TimeAdventureGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

const TimeAdventureGame: React.FC<TimeAdventureGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    // Shuffle questions on mount
    const [shuffledQuestions, setShuffledQuestions] = useState<TimeAdventureQuestion[]>([]);

    useEffect(() => {
        setShuffledQuestions([...timeAdventureQuestions].sort(() => 0.5 - Math.random()));
    }, []);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    useEffect(() => {
        if (currentQuestion && !isFinished) {
            // Play question audio with a slight delay to allow transition
            const timer = setTimeout(() => {
                playDynamicSentence(currentQuestion.questionText, 'vi', isSoundOn, 'time_adventure');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentQuestion, isFinished, isSoundOn]);

    const handleAnswer = (isCorrect: boolean) => {
        if (feedback) return;
        playSound('click', isSoundOn);

        if (isCorrect) {
            setFeedback({ isCorrect: true, message: "Đúng rồi!" });
            playSound('correct', isSoundOn);
            setScore(s => s + 1);
            onCorrectAnswer();

            setTimeout(() => {
                setFeedback(null);
                if (currentQuestionIndex < shuffledQuestions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    setIsFinished(true);
                    playSound('win', isSoundOn);
                }
            }, 1500);
        } else {
            setFeedback({ isCorrect: false, message: "Thử lại nhé!" });
            playSound('incorrect', isSoundOn);
            playDynamicSentence("Chưa đúng rồi! Thử lại nhé!", 'vi', isSoundOn);
            setTimeout(() => {
                setFeedback(null);
            }, 1500);
        }
    };

    const handleRestart = () => {
        playSound('click', isSoundOn);
        setShuffledQuestions([...timeAdventureQuestions].sort(() => 0.5 - Math.random()));
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsFinished(false);
    };

    if (shuffledQuestions.length === 0) return <div className="text-center p-10">Đang tải...</div>;

    if (isFinished) {
        return (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
                <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative text-center border-4 border-teal-300">
                    <Confetti />
                    <h2 className="text-5xl font-bold text-teal-600 mb-6">Hoàn Thành Xuất Sắc!</h2>
                    <p className="text-2xl text-purple-700 mb-8">Bé Gốm đã khám phá hết các mùa và buổi rồi!</p>
                    <div className="flex justify-center gap-6">
                        <button onClick={onGoHome} className="bg-gray-400 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:bg-gray-500">Về Nhà</button>
                        <button onClick={handleRestart} className="bg-teal-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:bg-teal-600 animate-pulse">Chơi Lại</button>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden">
            <div className="w-full max-w-6xl bg-teal-50/90 backdrop-blur-sm rounded-[2rem] shadow-2xl p-4 relative flex flex-col items-center border-4 border-teal-200 max-h-full overflow-y-auto">

                {/* Header */}
                <div className="w-full flex justify-between items-center mb-2 flex-shrink-0">
                    <button onClick={() => { stopAllSounds(); onGoHome(); }} className="bg-white p-2 md:p-3 rounded-full shadow-md text-teal-600 hover:text-teal-800 transition-colors">
                        <HomeIcon className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <div className="flex items-center bg-yellow-400 text-white px-4 py-1 md:px-6 md:py-2 rounded-full shadow-md">
                        <StarIcon className="w-6 h-6 md:w-8 md:h-8 mr-2" />
                        <span className="text-2xl md:text-3xl font-bold">{score}</span>
                    </div>
                </div>

                {/* Question Image - Flexible height */}
                <div className="relative w-full max-w-md aspect-square max-h-[30vh] bg-white rounded-3xl shadow-lg overflow-hidden mb-4 border-4 border-white flex-shrink-0">
                    <img src={currentQuestion.imageUrl} alt="Question Scene" className="w-full h-full object-cover" />
                </div>

                {/* Question Text */}
                <div className="flex items-center justify-center gap-3 mb-4 bg-white/60 px-4 py-2 rounded-2xl shadow-sm flex-shrink-0">
                    <h2 className="text-xl md:text-3xl font-bold text-teal-800 text-center">{currentQuestion.questionText}</h2>
                    <ReadAloudButton text={currentQuestion.questionText} lang="vi" isSoundOn={isSoundOn} game="time_adventure" />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl overflow-y-auto p-1">
                    {currentQuestion.options.map((option, idx) => (
                        <div
                            key={idx}
                            role="button"
                            onClick={() => !feedback && handleAnswer(option.isCorrect)}
                            className={`flex flex-col items-center justify-center bg-white p-3 md:p-4 rounded-2xl shadow-md transform transition-all hover:scale-105 hover:shadow-xl active:scale-95 border-b-8 ${feedback ? 'cursor-not-allowed opacity-80' : 'cursor-pointer border-teal-200'}`}
                        >
                            {option.imageUrl && (
                                <img src={option.imageUrl} alt={option.text} className="w-16 h-16 md:w-20 md:h-20 object-contain mb-2" />
                            )}

                            {/* Vietnamese Text + Read Aloud Button */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg md:text-xl font-bold text-gray-800">{option.text}</span>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ReadAloudButton
                                        text={option.text}
                                        lang="vi"
                                        isSoundOn={isSoundOn}
                                        game="time_adventure"
                                        className="w-6 h-6 text-teal-500"
                                    />
                                </div>
                            </div>

                            {/* English & IPA Display */}
                            {option.english && (
                                <div className="flex flex-col items-center border-t border-teal-100 pt-2 w-full mt-1">
                                    <span className="text-base font-semibold text-pink-500">{option.english}</span>
                                    {option.ipa && <span className="text-xs text-gray-500 font-serif italic">[{option.ipa}]</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {feedback && feedback.isCorrect && <CorrectAnswerPopup message={feedback.message} />}
                {feedback && !feedback.isCorrect && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-red-500 text-white p-8 rounded-3xl shadow-2xl text-4xl font-bold animate-bounce">
                            {feedback.message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeAdventureGame;
