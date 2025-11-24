import React, { useState, useEffect, useCallback } from 'react';
import { HomeIcon } from './icons';
import { gardenMemoryScenes } from '../data/gardenMemoryData';
import type { GardenMemoryScene, GardenQuestion } from '../types';
import { playSound, playDynamicSentence } from '../services/audioService';
import { playFeedback } from '../services/feedbackService';
import Confetti from './Confetti';

interface GardenMemoryGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

type GamePhase = 'intro' | 'observing' | 'answering' | 'round_finished';

const OBSERVATION_TIME = 15; // 15 seconds

const GardenMemoryGame: React.FC<GardenMemoryGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentScene, setCurrentScene] = useState<GardenMemoryScene | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(OBSERVATION_TIME);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showHintImage, setShowHintImage] = useState(false);

  const startNewRound = useCallback(() => {
    const randomScene = gardenMemoryScenes[Math.floor(Math.random() * gardenMemoryScenes.length)];
    setCurrentScene(randomScene);
    setQuestionIndex(0);
    setTimer(OBSERVATION_TIME);
    setFeedback(null);
    setShowHintImage(false);
    setPhase('observing');
    playDynamicSentence(randomScene.intro_sentence, 'vi', isSoundOn, 'garden_memory');
  }, [isSoundOn]);

  useEffect(() => {
    if (phase === 'observing') {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer(t => t - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setPhase('answering');
      }
    }
  }, [phase, timer]);

  const handleAnswer = async (selectedOption: string | number) => {
    if (!currentScene || feedback) return;
    playSound('click', isSoundOn);

    const isCorrect = selectedOption === currentScene.questions[questionIndex].answer;
    const feedbackMessage = await playFeedback(isCorrect, isSoundOn);
    setFeedback({ isCorrect, message: feedbackMessage });

    if (isCorrect) {
      onCorrectAnswer();
      setTimeout(() => {
        setFeedback(null);
        if (questionIndex >= currentScene.questions.length - 1) {
          setPhase('round_finished');
          playSound('win', isSoundOn);
        } else {
          setQuestionIndex(prev => prev + 1);
        }
      }, 1500);
    } else {
      setShowHintImage(true);
      playDynamicSentence('Hãy xem lại nhé!', 'vi', isSoundOn, 'garden_memory');
      setTimeout(() => {
        setFeedback(null);
        setShowHintImage(false);
      }, 2500);
    }
  };

  const renderIntro = () => (
    <div className="text-center">
      <h2 className="text-5xl font-bold text-purple-700 mb-4">Bé Ghi Nhớ</h2>
      <p className="text-2xl text-pink-500 mb-8">Con hãy nhìn thật kỹ bức tranh và ghi nhớ các chi tiết nhé!</p>
      <button
        onClick={() => {
          playSound('click', isSoundOn);
          startNewRound();
        }}
        className="bg-green-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg transform hover:scale-105 transition-transform"
      >
        Bắt đầu!
      </button>
    </div>
  );

  const renderObserving = () => (
    <div className="flex flex-col items-center">
      <div className="absolute top-4 right-4 bg-white/80 text-purple-700 font-bold text-5xl rounded-full w-20 h-20 flex items-center justify-center shadow-md z-10">
        {timer}
      </div>
      <h2 className="text-4xl font-bold text-purple-700 mb-4">Hãy ghi nhớ!</h2>
      {currentScene && (
        <img
          src={currentScene.imageUrl}
          alt="Bối cảnh ghi nhớ"
          className="w-full max-w-3xl aspect-square object-cover rounded-2xl shadow-lg"
        />
      )}
    </div>
  );

  const renderAnswering = () => {
    if (!currentScene) return null;
    const currentQuestion = currentScene.questions[questionIndex];

    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full max-w-5xl aspect-video rounded-2xl shadow-lg overflow-hidden mb-6">
            <img
                src={currentScene.imageUrl}
                alt="Bối cảnh"
                className="w-full h-full object-cover"
            />
            {!showHintImage && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center transition-opacity duration-300">
                    <p className="text-5xl text-purple-500 font-bold">???</p>
                </div>
            )}
            {showHintImage && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300">
                    <p className="text-white text-4xl font-bold bg-black/50 p-4 rounded-lg">Hãy xem lại nhé!</p>
                </div>
            )}
        </div>

        <h3 className="text-4xl font-bold text-purple-700 mb-6 text-center">{currentQuestion.questionText}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={!!feedback}
              className={`py-6 px-4 rounded-2xl text-4xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60
                ${feedback && option === currentQuestion.answer ? 'bg-green-400 text-white animate-pulse' : ''}
                ${feedback && !feedback.isCorrect && option !== currentQuestion.answer ? 'bg-gray-300' : ''}
                ${!feedback ? 'bg-sky-400 text-white' : ''}
              `}
            >
              {option}
            </button>
          ))}
        </div>
         {feedback && (
            <p className={`mt-4 text-3xl font-bold ${feedback.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {feedback.message}
            </p>
        )}
      </div>
    );
  };
  
  const renderRoundFinished = () => (
     <div className="text-center">
        <Confetti />
        <h2 className="text-6xl font-bold text-yellow-500 drop-shadow-lg mb-4">Con giỏi quá!</h2>
        <p className="text-3xl text-purple-700 mb-8">Bé đã nhớ đúng hết tất cả rồi!</p>
         <button onClick={() => { playSound('click', isSoundOn); startNewRound(); }} className="mt-8 bg-green-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg transform hover:scale-105 transition-transform">
            Chơi lại
        </button>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4">
      <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative min-h-[70vh] flex items-center justify-center">
        <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
          <HomeIcon className="w-12 h-12" />
        </button>
        {phase === 'intro' && renderIntro()}
        {phase === 'observing' && renderObserving()}
        {phase === 'answering' && renderAnswering()}
        {phase === 'round_finished' && renderRoundFinished()}
      </div>
    </div>
  );
};

export default GardenMemoryGame;