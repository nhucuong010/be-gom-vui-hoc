import React, { useState, useEffect, useCallback } from 'react';
import { generateSpellingWord } from '../services/geminiService';
import type { SpellingWord } from '../types';
import { HomeIcon, StarIcon, SpeakerIcon } from './icons';
import { playSound, speak } from '../services/audioService';
import { playFeedback } from '../services/feedbackService';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import Confetti from './Confetti';
import ReadAloudButton from './ReadAloudButton';

interface SpellingGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

const IncorrectFeedbackPopup: React.FC<{ message: string; }> = ({ message }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20`}>
        <div className={`text-center p-8 sm:p-12 rounded-3xl shadow-2xl bg-red-400`}>
            <p className="text-4xl sm:text-5xl font-bold text-white">{message}</p>
        </div>
    </div>
);

const SpellingGame: React.FC<SpellingGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [wordData, setWordData] = useState<SpellingWord | null>(null);
  const [userGuess, setUserGuess] = useState<string[]>([]);
  const [letterOptions, setLetterOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  
  const level = Math.floor(score / 5) + 1;

  const generateLetters = (word: string) => {
    const wordLetters = word.toUpperCase().replace(/\s/g, '').split('');
    const alphabet = 'AĂÂBCDĐEÊGHIJKLMNOPQRSUTƯVXY'; // Bảng chữ cái tiếng Việt
    const distractors = new Set<string>();
    while (distractors.size < 4) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!wordLetters.includes(randomLetter)) {
        distractors.add(randomLetter);
      }
    }
    return [...wordLetters, ...distractors].sort(() => Math.random() - 0.5);
  };

  const loadWord = useCallback(async () => {
    setIsLoading(true);
    setUserGuess([]);
    setIncorrectAttempts(0);
    setWordData(null);
    setFeedback(null); // Reset feedback state when loading a new word
    try {
      const newWordData = await generateSpellingWord(level);
      setWordData(newWordData);
      setLetterOptions(generateLetters(newWordData.word));

      // Tự động phát âm khi từ mới xuất hiện
      setTimeout(() => speak(newWordData.word, 'vi', isSoundOn), 500);

    } catch (error) {
      console.error("Failed to fetch spelling word:", error);
      setFeedback({ message: "Lỗi rồi!", isCorrect: false });
    } finally {
        setIsLoading(false);
    }
  }, [level, isSoundOn]);

  useEffect(() => {
    loadWord();
  }, [loadWord]);
  
  const handleLetterClick = (letter: string) => {
    if (!wordData || userGuess.length >= wordData.word.replace(/\s/g, '').length || feedback) return;
    playSound('click', isSoundOn);
    setUserGuess(prev => [...prev, letter]);
  };

  const handleClear = () => {
    playSound('click', isSoundOn);
    setUserGuess([]);
  }

  useEffect(() => {
    // This effect should only run when the user has completed their guess.
    if (!wordData || feedback || userGuess.length !== wordData.word.replace(/\s/g, '').length) {
      return;
    }

    const processAnswer = async () => {
      const guessStr = userGuess.join('');
      const isCorrect = guessStr === wordData.word.replace(/\s/g, '');

      if (isCorrect) {
        // --- Correct Answer Flow ---
        
        // 1. Set UI state for feedback. Use a consistent message.
        const feedbackMessage = "Con giỏi quá!";
        setFeedback({ message: feedbackMessage, isCorrect: true });
        setScore(s => s + 1);
        onCorrectAnswer();

        // 2. Play audio sequence. The `await` ensures a smooth, non-overlapping flow.
        playSound('correct', isSoundOn); // A quick, non-blocking sound effect for immediate feedback.
        await speak(feedbackMessage, 'vi', isSoundOn); // Speak the praise.
        await speak(wordData.word, 'vi', isSoundOn); // Speak the word itself.

        // 3. Wait for an additional moment so the user can see the feedback screen.
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 4. Load the next word.
        loadWord();

      } else {
        // --- Incorrect Answer Flow ---
        const feedbackMessage = await playFeedback(false, isSoundOn);
        setFeedback({ message: feedbackMessage, isCorrect: false });
        setIncorrectAttempts(prev => prev + 1);

        // Wait for 1.5s before clearing the feedback and guess.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setFeedback(null);
        setUserGuess([]);
      }
    };

    processAnswer();

  }, [userGuess, wordData, feedback, onCorrectAnswer, isSoundOn, loadWord]);

  useEffect(() => {
    // After 3 incorrect attempts, show the answer and move on.
    if (incorrectAttempts >= 3 && wordData && !feedback) {
        const showAnswerAndProceed = async () => {
            setFeedback({ message: `Đáp án là: ${wordData.word}`, isCorrect: false });
            await speak(`Đáp án là ${wordData.word}`, 'vi', isSoundOn);
            
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            loadWord(); 
        };
        showAnswerAndProceed();
    }
  }, [incorrectAttempts, wordData, loadWord, feedback, isSoundOn]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
      <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 relative">
        <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-full shadow-md">
          <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" />
          <span className="text-2xl sm:text-3xl">{score}</span>
        </div>
        <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors">
          <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
        </button>

        <h2 className="text-4xl sm:text-5xl font-bold text-center text-purple-700 mb-2 mt-12">Bé Ghép Chữ</h2>
        <p className="text-center text-xl sm:text-2xl text-pink-500 mb-4 font-semibold">Cấp độ {level}</p>
        
        {isLoading && <div className="text-center p-16"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto"></div><p className="mt-4 text-purple-600">Đang tìm chữ mới...</p></div>}
        
        {!isLoading && wordData && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="relative w-full max-w-sm aspect-square bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                <img src={wordData.imageUrl} alt={wordData.word} className="w-full h-full object-contain" />
                <div 
                    className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-3 rounded-full"
                    aria-label="Phát âm"
                >
                    <ReadAloudButton text={wordData.word} isSoundOn={isSoundOn} lang="vi" />
                </div>
            </div>
            
            <div className="flex items-center justify-center flex-wrap gap-2 h-20 md:h-24">
              {wordData.word.split('').map((char, index) => 
                char === ' ' ? <div key={index} className="w-6 md:w-8"></div> : (
                <div key={index} className="w-14 h-14 md:w-20 md:h-20 bg-pink-100 border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center text-4xl md:text-6xl font-bold text-purple-700">
                  {userGuess[wordData.word.substring(0, index).replace(/\s/g, '').length] || ''}
                </div>
              ))}
            </div>
             
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3">
              {letterOptions.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleLetterClick(letter)}
                  className="w-14 h-14 md:w-16 md:h-16 bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold text-3xl md:text-4xl rounded-xl shadow-md transform transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
                  disabled={!!feedback || userGuess.length >= wordData.word.replace(/\s/g, '').length}
                >
                  {letter}
                </button>
              ))}
            </div>
            <button onClick={handleClear} disabled={!!feedback || userGuess.length === 0} className="mt-2 bg-red-400 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-500 disabled:opacity-50 text-xl">Làm lại</button>
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

export default SpellingGame;