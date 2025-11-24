
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateFeedingProblem } from '../services/geminiService';
import type { FeedingProblem } from '../types';
import { HomeIcon, StarIcon, HeartIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import { playFeedback } from '../services/feedbackService';
import { formatQuestionForDisplay } from '../services/feedbackService';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import Confetti from './Confetti';
import ReadAloudButton from './ReadAloudButton';

// --- Interfaces ---
interface FeedingGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

// --- Helper Components ---
const IncorrectFeedbackPopup: React.FC<{ message: string; }> = ({ message }) => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20`}>
        <div className={`text-center p-8 sm:p-12 rounded-3xl shadow-2xl bg-red-400`}>
            <p className="text-4xl sm:text-5xl font-bold text-white">{message}</p>
        </div>
    </div>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const GameTypeButton: React.FC<{ title: string; onClick: () => void; imageUrl: string }> = ({ title, onClick, imageUrl }) => (
    <button
        onClick={onClick}
        className="bg-white p-4 md:p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center gap-4 focus:outline-none focus:ring-4 focus:ring-pink-400/50"
    >
        <img src={imageUrl} alt={title} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
        <span className="text-2xl md:text-3xl font-bold text-purple-700">{title}</span>
    </button>
);

const FloatingHearts: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden z-20">
        {Array.from({ length: 6 }).map((_, i) => (
            <div
                key={i}
                className="absolute animate-float-heart text-pink-500"
                style={{
                    left: `${50 + (Math.random() * 40 - 20)}%`,
                    top: `${40 + (Math.random() * 20)}%`,
                    animationDelay: `${i * 0.2}s`,
                    fontSize: `${2 + Math.random() * 2}rem`
                }}
            >
                ❤️
            </div>
        ))}
    </div>
);


// --- Main Game Component ---
const FeedingGame: React.FC<FeedingGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [operationType, setOperationType] = useState<'add' | 'subtract' | null>(null);
  const [problem, setProblem] = useState<FeedingProblem | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);
  const [animalState, setAnimalState] = useState<'hungry' | 'eating' | 'happy'>('hungry');
  
  const level = Math.floor(score / 5) + 1;

  const generateOptions = useCallback((p: FeedingProblem) => {
    const opts = new Set<number>();
    opts.add(p.answer);
    while (opts.size < 3) {
      const randomOffset = Math.floor(Math.random() * 5) - 2;
      let randomAnswer = p.answer + randomOffset;
      if (randomAnswer < 0) randomAnswer = 0;
      if (randomAnswer !== p.answer) {
        opts.add(randomAnswer);
      }
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }, []);

  const fetchNewProblem = useCallback(async () => {
    if (!operationType) return;
    setIsLoading(true);
    setProblem(null);
    setAnimalState('hungry'); // Reset emotion
    try {
      const newProblem = await generateFeedingProblem(level, operationType);
      setProblem(newProblem);
      setOptions(generateOptions(newProblem));
      setTimeout(() => playDynamicSentence(newProblem.question, 'vi', isSoundOn), 700);
    } catch (error) {
      console.error("Failed to fetch feeding problem:", error);
    } finally {
      setIsLoading(false);
    }
  }, [level, operationType, generateOptions, isSoundOn]);

  useEffect(() => {
    if(operationType) {
        fetchNewProblem();
    }
  }, [operationType, fetchNewProblem]);

  const handleSelectOperation = (type: 'add' | 'subtract') => {
      playSound('click', isSoundOn);
      setOperationType(type);
  };

  const handleAnswer = async (selected: number) => {
    if (feedback || !problem) return;
    playSound('click', isSoundOn);

    const isCorrect = selected === problem.answer;
    
    if (isCorrect) {
      setAnimalState('eating'); // Start eating animation
      const feedbackMessage = await playFeedback(isCorrect, isSoundOn);
      setFeedback({ isCorrect, message: feedbackMessage });
      
      onCorrectAnswer();
      setScore(s => s + 1);

      // Celebration phase
      setTimeout(() => {
        setAnimalState('happy');
        playSound('win', isSoundOn);
        playDynamicSentence(`Cảm ơn Gốm! Tớ no rồi!`, 'vi', isSoundOn);
      }, 500);

      setTimeout(() => {
        setFeedback(null);
        fetchNewProblem();
      }, 3000); // Longer delay to enjoy the happy animation
    } else {
      const feedbackMessage = await playFeedback(isCorrect, isSoundOn);
      setFeedback({ isCorrect, message: feedbackMessage });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const displayQuestion = useMemo(() => problem ? formatQuestionForDisplay(problem.question) : '', [problem]);
  
  if (!operationType) {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
            <div className="w-full bg-green-50 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 relative">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors">
                    <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
                </button>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-green-600 mb-2 mt-12" style={{ textShadow: '2px 2px 0 #fff' }}>Cho Thú Ăn</h2>
                <p className="text-center text-xl sm:text-2xl text-pink-500 mb-8 sm:mb-12 font-semibold">Con muốn chơi bài toán thêm hay bớt?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 max-w-xl mx-auto">
                    <GameTypeButton title="Bài toán Thêm" onClick={() => handleSelectOperation('add')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-plus.png" />
                    <GameTypeButton title="Bài toán Bớt" onClick={() => handleSelectOperation('subtract')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-minus.png" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center p-2 sm:p-4">
      <div className="w-full bg-green-50 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
        <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-full shadow-md z-10">
          <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" />
          <span className="text-2xl sm:text-3xl">{score}</span>
        </div>
        <button onClick={() => { playSound('click', isSoundOn); stopAllSounds(); setOperationType(null); }} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
            <ArrowLeftIcon className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-green-600 mb-4 mt-12 sm:mt-2" style={{ textShadow: '2px 2px 0 #fff' }}>Bé Cho Thú Ăn</h2>
        
        {isLoading && <div className="text-center p-16 min-h-[400px] flex flex-col justify-center items-center"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div><p className="mt-4 text-purple-600 font-semibold text-xl">Đang gọi bạn thú...</p></div>}
        
        {problem && (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative bg-white p-4 rounded-2xl shadow-lg border-2 border-green-200 w-full max-w-3xl">
                <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 font-semibold leading-relaxed pr-8">
                    {displayQuestion}
                </p>
                <div className="absolute top-1 right-1">
                    <ReadAloudButton text={problem.question} lang="vi" isSoundOn={isSoundOn} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-end justify-center w-full gap-4 lg:gap-12 mt-4 relative">
                {/* --- Gốm (Người cho ăn) --- */}
                <div className="flex flex-col items-center flex-shrink-0 relative z-10">
                  {animalState === 'happy' && <div className="absolute -top-8 right-0 text-4xl animate-bounce">❤️</div>}
                  <img src="https://be-gom-vui-hoc.vercel.app/assets/images/gom-sac.png" alt="Bé Gốm" className="w-40 sm:w-52 object-contain drop-shadow-lg" />
                  <p className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-bold mt-2 text-sm">Bé Gốm tốt bụng</p>
                </div>
                
                {/* --- Visual Calculation (The Food) --- */}
                <div className="flex flex-col items-center justify-center gap-2 mb-4 w-full max-w-xs">
                     {/* Bong bóng suy nghĩ của thú */}
                    {animalState === 'hungry' && (
                         <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200 animate-pulse mb-2">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500 text-xs font-bold">Mình đói quá...</span>
                                <img src={problem.foodImageUrl} className="w-6 h-6 object-contain" />
                            </div>
                        </div>
                    )}
                     {animalState === 'happy' && (
                         <div className="bg-white p-2 rounded-xl shadow-md border-2 border-pink-300 animate-pop-in mb-2">
                            <span className="text-pink-500 font-bold">Cảm ơn bé Gốm!</span>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 sm:gap-4 p-3 bg-green-200/50 rounded-2xl shadow-inner w-full">
                        <div className="flex flex-wrap gap-1 items-center justify-center flex-1">
                            {Array.from({ length: problem.initialAmount }).map((_, i) => (
                            <img key={`initial-${i}`} src={problem.foodImageUrl} alt={problem.food} className={`w-8 h-8 sm:w-10 sm:h-10 object-contain transition-opacity duration-500 ${problem.operation === 'subtract' && i < problem.changeAmount ? 'opacity-30 grayscale' : 'opacity-100'}`} />
                            ))}
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-green-600">
                            {problem.operation === 'add' ? '+' : '-'}
                        </div>
                        <div className="flex flex-wrap gap-1 items-center justify-center flex-1">
                            {Array.from({ length: problem.changeAmount }).map((_, i) => (
                            <img key={`change-${i}`} src={problem.foodImageUrl} alt={problem.food} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Con vật --- */}
                <div className={`flex flex-col items-center flex-shrink-0 relative transition-transform duration-500 ${animalState === 'happy' ? 'scale-110' : 'scale-100'}`}>
                    {animalState === 'happy' && <FloatingHearts />}
                    <img 
                        src={problem.animalImageUrl} 
                        alt={problem.animal} 
                        className={`w-40 sm:w-52 object-contain drop-shadow-lg 
                            ${animalState === 'hungry' ? 'animate-bounce-slow' : ''}
                            ${animalState === 'eating' ? 'animate-bounce-rapid' : ''}
                            ${animalState === 'happy' ? 'animate-bounce-happy' : ''}
                        `} 
                    />
                     <p className="text-lg sm:text-xl font-bold text-purple-700 bg-white/70 px-4 py-1 rounded-full shadow-md mt-2">Bạn {problem.animal}</p>
                </div>
            </div>

            {/* --- Answer Buttons --- */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 w-full max-w-lg">
                {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="bg-sky-400 hover:bg-sky-500 text-white font-bold text-4xl sm:text-6xl py-4 sm:py-6 rounded-3xl shadow-[0_6px_0_rgb(14,116,144)] hover:shadow-[0_4px_0_rgb(14,116,144)] active:shadow-none active:translate-y-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!!feedback}
                >
                    {opt}
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

      <style>{`
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }

        @keyframes bounce-rapid {
             0%, 100% { transform: scale(1); }
             50% { transform: scale(1.05); }
        }
        .animate-bounce-rapid { animation: bounce-rapid 0.3s infinite; }

        @keyframes bounce-happy {
            0%, 100% { transform: translateY(0) scale(1); }
            20% { transform: translateY(-20px) scale(1.1) rotate(-5deg); }
            40% { transform: translateY(0) scale(1) rotate(5deg); }
            60% { transform: translateY(-10px) scale(1.05) rotate(-5deg); }
        }
        .animate-bounce-happy { animation: bounce-happy 1s ease-in-out infinite; }

        @keyframes float-heart {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
        }
        .animate-float-heart { animation: float-heart 1.5s ease-out forwards; }
        
        @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default FeedingGame;
