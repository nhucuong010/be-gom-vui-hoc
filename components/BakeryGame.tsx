
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateBakeryProblem } from '../services/geminiService';
import type { BakeryProblem } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import { playFeedback } from '../services/feedbackService';
import { formatQuestionForDisplay } from '../services/feedbackService';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import Confetti from './Confetti';
import ReadAloudButton from './ReadAloudButton';

// --- Interfaces ---
interface BakeryGameProps {
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

const CoinReward: React.FC = () => (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 animate-float-up-fade flex flex-col items-center pointer-events-none">
        <span className="text-6xl filter drop-shadow-lg">💰</span>
        <span className="text-4xl font-black text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">+1 Xu</span>
    </div>
);

const GameTypeButton: React.FC<{ title: string; onClick: () => void; imageUrl: string }> = ({ title, onClick, imageUrl }) => (
    <button
        onClick={onClick}
        className="bg-white p-4 md:p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center gap-4 focus:outline-none focus:ring-4 focus:ring-pink-400/50 border-2 border-pink-100"
    >
        <img src={imageUrl} alt={title} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
        <span className="text-2xl md:text-3xl font-bold text-pink-600">{title}</span>
    </button>
);


// --- Main Game Component ---
const BakeryGame: React.FC<BakeryGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [operationType, setOperationType] = useState<'add' | 'subtract' | null>(null);
  const [problem, setProblem] = useState<BakeryProblem | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, message: string } | null>(null);
  const [isSummary, setIsSummary] = useState(false);
  
  // Animation States
  const [customerState, setCustomerState] = useState<'entering' | 'waiting' | 'leaving'>('entering');
  const [showCoinAnim, setShowCoinAnim] = useState(false);

  const level = Math.floor(score / 5) + 1;

  const generateOptions = useCallback((p: BakeryProblem) => {
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
    setCustomerState('entering'); 
    
    try {
      const newProblem = await generateBakeryProblem(level, operationType);
      // Simulate "Entering" delay
      setTimeout(() => {
          setProblem(newProblem);
          setOptions(generateOptions(newProblem));
          setCustomerState('waiting');
          playDynamicSentence(newProblem.question, 'vi', isSoundOn);
      }, 600);
      
    } catch (error) {
      console.error("Failed to fetch bakery problem:", error);
    } finally {
      setIsLoading(false);
    }
  }, [level, operationType, generateOptions, isSoundOn]);

  useEffect(() => {
    if (operationType && !isSummary) {
        fetchNewProblem();
    }
  }, [operationType, isSummary, fetchNewProblem]);

  const handleSelectOperation = (type: 'add' | 'subtract') => {
      playSound('click', isSoundOn);
      setOperationType(type);
      setScore(0);
      setCoins(0);
      setIsSummary(false);
  };

  const handleEndShift = () => {
      playSound('click', isSoundOn);
      setIsSummary(true);
      playSound('win', isSoundOn);
      playDynamicSentence("Hôm nay tiệm bánh thật đông khách! Con giỏi quá!", 'vi', isSoundOn);
  }

  const handleAnswer = async (selected: number) => {
    if (feedback || !problem || customerState !== 'waiting') return;
    playSound('click', isSoundOn);

    const isCorrect = selected === problem.answer;
    
    if (isCorrect) {
      const feedbackMessage = await playFeedback(isCorrect, isSoundOn);
      setFeedback({ isCorrect, message: feedbackMessage });
      onCorrectAnswer();
      setScore(s => s + 1);
      
      // Reward Sequence
      setShowCoinAnim(true);
      setCoins(c => c + 1);
      playSound('correct', isSoundOn);

      setTimeout(() => {
        setCustomerState('leaving'); 
        setShowCoinAnim(false);
      }, 1200);

      setTimeout(() => {
        setFeedback(null);
        if (score > 0 && score % 5 === 0) {
             // Optional: trigger summary every 5 correct answers for a mini-celebration?
             // For now, keeping it continuous until user decides to quit or switch modes.
             fetchNewProblem();
        } else {
             fetchNewProblem();
        }
      }, 2200);
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
            <div className="w-full bg-pink-50 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 relative border-4 border-white">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-pink-500 hover:text-pink-600 transition-colors">
                    <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
                </button>
                <div className="flex flex-col items-center mb-8 mt-10">
                    <span className="text-6xl mb-2">🧁</span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-pink-600" style={{ textShadow: '2px 2px 0 #fff' }}>Tiệm Bánh Bé Gốm</h2>
                </div>
                <p className="text-center text-xl sm:text-2xl text-purple-700 mb-8 sm:mb-12 font-semibold bg-white/50 py-2 px-6 rounded-full">Hôm nay con muốn làm gì?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 max-w-xl mx-auto">
                    <GameTypeButton title="Làm thêm bánh" onClick={() => handleSelectOperation('add')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-plus.png" />
                    <GameTypeButton title="Bán bớt bánh" onClick={() => handleSelectOperation('subtract')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-minus.png" />
                </div>
            </div>
        </div>
    );
  }

  if (isSummary) {
      return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
            <div className="w-full bg-gradient-to-b from-yellow-100 to-orange-100 rounded-3xl shadow-2xl p-8 relative text-center border-8 border-white">
                 <Confetti />
                 <h2 className="text-5xl sm:text-6xl font-black text-orange-500 mb-8 drop-shadow-md">Hết Ca Làm Việc!</h2>
                 
                 <div className="bg-white/60 p-8 rounded-3xl shadow-inner mb-8 flex flex-col items-center">
                    <p className="text-2xl text-gray-600 font-bold mb-2">Hôm nay tiệm bánh bán được:</p>
                    <div className="flex items-center gap-4 animate-bounce-slow">
                        <span className="text-7xl sm:text-8xl">💰</span>
                        <span className="text-7xl sm:text-9xl font-black text-yellow-500 drop-shadow-lg">{coins}</span>
                        <span className="text-4xl sm:text-6xl font-bold text-orange-400 self-end mb-2">Xu</span>
                    </div>
                 </div>

                 <div className="flex gap-6 justify-center">
                    <button onClick={() => { playSound('click', isSoundOn); setOperationType(null); setIsSummary(false); }} className="bg-pink-500 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:scale-105 transition-transform">
                        Về Menu
                    </button>
                    <button onClick={() => { playSound('click', isSoundOn); setIsSummary(false); setScore(0); setCoins(0); }} className="bg-green-500 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:scale-105 transition-transform">
                        Làm ca tiếp
                    </button>
                 </div>
            </div>
        </div>
      )
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center p-2 sm:p-4">
      <div className="w-full bg-pink-100/90 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden border-4 border-white min-h-[85vh] flex flex-col">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 z-20">
            <button onClick={() => { playSound('click', isSoundOn); handleEndShift(); }} className="text-pink-600 hover:text-pink-700 transition-colors bg-white p-2 rounded-full shadow-sm flex items-center gap-2 font-bold px-4">
                <ArrowLeftIcon className="w-6 h-6" />
                <span className="hidden sm:inline">Nghỉ tay</span>
            </button>
            <h2 className="text-2xl sm:text-4xl font-black text-pink-500 uppercase tracking-wider bg-white/80 px-6 py-2 rounded-full shadow-sm">Tiệm Bánh</h2>
            <div className="flex items-center bg-yellow-400 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-full shadow-md border-2 border-white transform hover:scale-110 transition-transform">
                <span className="text-2xl mr-2">💰</span>
                <span className="text-2xl sm:text-3xl">{coins}</span>
            </div>
        </div>
        
        {isLoading && !problem && (
             <div className="flex-grow flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
                <p className="mt-4 text-purple-600 font-semibold text-xl animate-pulse">Đang dọn quầy hàng...</p>
            </div>
        )}
        
        {problem && (
          <div className="flex flex-col items-center flex-grow justify-between">
            
            {/* --- Scene Container --- */}
            <div className="relative w-full flex-grow flex items-end justify-center mb-4 min-h-[300px]">
                {/* Background Decor - The Counter */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#d4a373] rounded-t-[3rem] border-t-8 border-[#bc8a5f] shadow-inner z-0"></div> 

                {/* Left: Gốm (Shopkeeper) */}
                <div className="absolute left-[5%] bottom-[10%] z-10 flex flex-col items-center">
                    <div className="bg-white px-3 py-1 rounded-xl shadow-md mb-2 animate-bounce-slow border border-pink-200">
                        <p className="text-pink-600 font-bold text-sm whitespace-nowrap">Xin chào!</p>
                    </div>
                    <img src="https://be-gom-vui-hoc.vercel.app/assets/images/gom-sac.png" alt="Bé Gốm" className="w-32 sm:w-48 object-contain drop-shadow-xl" />
                </div>

                {/* Center: The Calculation (On the Counter) */}
                <div className="relative z-20 bg-white/95 p-4 rounded-3xl shadow-xl border-4 border-pink-300 mb-[5%] transform hover:scale-105 transition-transform duration-300">
                     <div className="flex items-center justify-center gap-4">
                         {/* Initial Items */}
                         <div className="flex flex-wrap gap-1 max-w-[120px] justify-center">
                            {Array.from({ length: problem.initialAmount }).map((_, i) => (
                                <img key={`init-${i}`} src={problem.item.imageUrl} className={`w-8 h-8 sm:w-10 sm:h-10 object-contain ${problem.operation === 'subtract' && i < problem.changeAmount ? 'opacity-40 grayscale' : ''}`} />
                            ))}
                         </div>
                         {/* Operator */}
                         <span className="text-5xl sm:text-6xl font-black text-pink-500">{problem.operation === 'add' ? '+' : '-'}</span>
                         {/* Change Items */}
                         <div className="flex flex-wrap gap-1 max-w-[120px] justify-center">
                            {Array.from({ length: problem.changeAmount }).map((_, i) => (
                                <img key={`change-${i}`} src={problem.item.imageUrl} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                            ))}
                         </div>
                     </div>
                </div>

                {/* Right: Customer (Dynamic) */}
                <div className={`absolute right-[5%] bottom-[5%] z-10 flex flex-col items-center transition-all duration-700 ease-in-out
                    ${customerState === 'entering' ? 'translate-x-[200%] opacity-0' : ''}
                    ${customerState === 'waiting' ? 'translate-x-0 opacity-100' : ''}
                    ${customerState === 'leaving' ? 'translate-x-[200%] opacity-0' : ''}
                `}>
                     {/* Customer Speech Bubble */}
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-lg mb-2 border-2 border-purple-200 max-w-[180px] text-center animate-pop-in">
                        <p className="text-purple-800 font-bold text-xs sm:text-sm leading-tight">
                            {customerState === 'waiting' ? `Cho mình ${problem.changeAmount} ${problem.item.name} nhé!` : 'Cảm ơn!'}
                        </p>
                         <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                    </div>
                    <img src={problem.customerImageUrl} alt={problem.customerName} className="w-36 sm:w-52 object-contain drop-shadow-2xl" />
                </div>
                
                {/* Coin Animation */}
                {showCoinAnim && <CoinReward />}
            </div>

            {/* --- Question Box --- */}
            <div className="w-full max-w-3xl bg-white p-4 rounded-2xl shadow-md border-2 border-pink-200 mb-6 flex items-center justify-between gap-4 z-20">
                <p className="text-lg sm:text-xl text-center text-gray-700 font-semibold flex-grow">
                    {displayQuestion}
                </p>
                 <ReadAloudButton text={problem.question} lang="vi" isSoundOn={isSoundOn} />
            </div>

            {/* --- Answer Buttons --- */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl z-20 pb-4">
                {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="bg-sky-400 hover:bg-sky-500 text-white font-bold text-4xl sm:text-6xl py-4 sm:py-6 rounded-3xl shadow-[0_6px_0_rgb(14,116,144)] hover:shadow-[0_4px_0_rgb(14,116,144)] active:shadow-none active:translate-y-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-sky-600"
                    disabled={!!feedback || customerState !== 'waiting'}
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
        @keyframes float-up-fade {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -200%) scale(1.5); opacity: 1; }
            100% { transform: translate(-50%, -300%) scale(1); opacity: 0; }
        }
        .animate-float-up-fade { animation: float-up-fade 1.2s ease-out forwards; }

        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
        
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

export default BakeryGame;
