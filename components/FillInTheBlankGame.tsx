import React, { useState, useEffect, useCallback } from 'react';
import { generateFillInTheBlankProblem } from '../services/geminiService';
import type { FillInTheBlankProblem } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, speak } from '../services/audioService';
import { playFeedback } from '../services/feedbackService';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import Confetti from './Confetti';
import ReadAloudButton from './ReadAloudButton';

// Interface
interface FillInTheBlankGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

// Incorrect Feedback Popup
const IncorrectFeedbackPopup: React.FC<{ message: string; }> = ({ message }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20`}>
        <div className={`text-center p-8 sm:p-12 rounded-3xl shadow-2xl bg-red-400`}>
            <p className="text-4xl sm:text-5xl font-bold text-white">{message}</p>
        </div>
    </div>
);

// Main Component
const FillInTheBlankGame: React.FC<FillInTheBlankGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [problem, setProblem] = useState<FillInTheBlankProblem | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [revealedLetter, setRevealedLetter] = useState<string | null>(null); // NEW: State to hold the revealed letter
  
  const level = Math.floor(score / 5) + 1;
  
  const instructionText = problem ? `Con ơi, thiếu chữ nào để được từ ${problem.word}?` : '';

  const fetchNewProblem = useCallback(async () => {
    setIsLoading(true);
    setProblem(null);
    setRevealedLetter(null); // RESET: revealed letter for the new problem
    try {
      const newProblem = await generateFillInTheBlankProblem(level);
      setProblem(newProblem);
      const newInstruction = `Con ơi, thiếu chữ nào để được từ ${newProblem.word}?`;
      // Automatically play the instruction sound for the new problem using pre-generated files
      setTimeout(() => speak(newInstruction, 'vi', isSoundOn), 500);
    } catch (error) {
      console.error("Failed to fetch problem:", error);
      setFeedback({ message: "Lỗi rồi!", isCorrect: false });
    } finally {
      setIsLoading(false);
    }
  }, [level, isSoundOn]);

  useEffect(() => {
    fetchNewProblem();
  }, [fetchNewProblem]);

  const handleAnswer = async (selectedLetter: string) => {
    if (feedback || !problem) return;
    playSound('click', isSoundOn);

    if (selectedLetter === problem.correctLetter) {
      setRevealedLetter(selectedLetter); // REVEAL: Set the letter to be shown in the blank
      const feedbackMessage = await playFeedback(true, isSoundOn);
      // Play the full word sound again as a reward
      speak(problem.word, 'vi', isSoundOn);
      setFeedback({ message: feedbackMessage, isCorrect: true });
      setScore(s => s + 1);
      onCorrectAnswer();
      setTimeout(() => {
        setFeedback(null);
        fetchNewProblem();
      }, 2000);
    } else {
      const feedbackMessage = await playFeedback(false, isSoundOn);
      setFeedback({ message: feedbackMessage, isCorrect: false });
      setTimeout(() => setFeedback(null), 1500);
    }
  };
  

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
      {/* ADD: Style for the pop-in animation */}
      <style>{`
          @keyframes pop-in {
              0% { transform: scale(0.5); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in {
              animation: pop-in 0.3s ease-out forwards;
          }
      `}</style>
      <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 relative">
        <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-full shadow-md">
          <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" />
          <span className="text-2xl sm:text-3xl">{score}</span>
        </div>
        <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors">
          <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
        </button>

        <h2 className="text-4xl sm:text-5xl font-bold text-center text-purple-700 mb-2 mt-12">Bé Điền Chữ</h2>
        <p className="text-center text-xl sm:text-2xl text-pink-500 mb-4 font-semibold">Cấp độ {level}</p>

        {isLoading && <div className="text-center p-16"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto"></div><p className="mt-4 text-purple-600">Đang tìm chữ mới...</p></div>}

        {!isLoading && problem && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="relative w-full max-w-sm aspect-square bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                <img src={problem.imageUrl} alt={problem.word} className="w-full h-full object-contain" />
                <div 
                    className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-3 rounded-full"
                    aria-label="Phát âm từ"
                >
                    <ReadAloudButton text={problem.word} isSoundOn={isSoundOn} lang="vi" />
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-2">
                 <p className="text-lg md:text-xl text-center text-purple-600 font-semibold">{instructionText}</p>
                 <ReadAloudButton text={instructionText} isSoundOn={isSoundOn} lang="vi" />
            </div>
            
            {/* UPDATED: Rendering logic for the word/blank */}
            <div className="flex items-center justify-center flex-wrap gap-2 h-20 md:h-24">
              {problem.word.split('').map((char, index) => {
                if (char === ' ') {
                  return <div key={index} className="w-4 md:w-6"></div>;
                }

                const isHiddenChar = index === problem.hiddenIndex;
                const letterToShow = isHiddenChar ? (revealedLetter || '_') : char;
                
                let containerClasses = 'w-14 h-14 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-4xl md:text-6xl font-bold transition-all duration-300';
                
                if (isHiddenChar) {
                  if (revealedLetter) {
                    containerClasses += ' bg-green-200 border-2 border-solid border-green-400 text-purple-700 animate-pop-in';
                  } else {
                    containerClasses += ' bg-pink-100 border-2 border-dashed border-pink-300 text-pink-400';
                  }
                } else {
                  containerClasses += ' bg-transparent text-gray-800';
                }

                return (
                  <div key={index} className={containerClasses}>
                    {letterToShow}
                  </div>
                );
              })}
            </div>
             
            <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-md sm:max-w-lg">
              {problem.options.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold text-4xl md:text-6xl p-6 md:p-8 rounded-2xl shadow-lg transform transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
                  disabled={!!feedback}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {feedback && feedback.isCorrect && (
          <>
              <CorrectAnswerPopup message={feedback.message} />
              <Confetti />
          </>
      )}
      {feedback && !feedback.isCorrect && (
          <IncorrectFeedbackPopup message={feedback.message} />
      )}
    </div>
  );
};

export default FillInTheBlankGame;