import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateMathProblem } from '../services/geminiService';
import type { MathProblem } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { playSound, stopAllSounds } from '../services/audioService';
import { playFeedback, playEquationSpeech, getEquationText } from '../services/feedbackService';
import Confetti from './Confetti';
import CorrectAnswerPopup from './CorrectAnswerPopup';
import ReadAloudButton from './ReadAloudButton';

const EquationVisualizer: React.FC<{ problem: MathProblem; revealedAnswer?: number | string | null }> = ({ problem, revealedAnswer }) => {
  const ASSET_PATH = 'https://be-gom-vui-hoc.vercel.app/assets/images';
  const iconMap: Record<string, string> = {
    '0': 'number-0.png', '1': 'number-1.png', '2': 'number-2.png',
    '3': 'number-3.png', '4': 'number-4.png', '5': 'number-5.png',
    '6': 'number-6.png', '7': 'number-7.png', '8': 'number-8.png',
    '9': 'number-9.png',
    '+': 'operator-plus.png', '-': 'operator-minus.png',
    '=': 'operator-equals.png', '?': 'operator-question.png',
    '_': 'operator-question.png',
    '<': 'operator-less.png', '>': 'operator-greater.png',
  };

  let partsToRender: string[];
  let answerPartIndex: number = -1;

  if (problem.type === 'calculation') {
    const problemParts = problem.problem.split(' ');
    const answerPart = revealedAnswer !== null ? String(revealedAnswer) : '?';
    partsToRender = [...problemParts, '=', answerPart];
    answerPartIndex = 4; // Index of the answer part
  } else { // comparison
    const problemParts = problem.problem.split(' ');
    const operatorPart = revealedAnswer !== null ? String(revealedAnswer) : '_';
    partsToRender = [problemParts[0], operatorPart, problemParts[2]];
    answerPartIndex = 1; // Index of the operator part
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {partsToRender.map((part, partIndex) => (
        <div
          key={partIndex}
          className={`flex gap-x-1 ${revealedAnswer !== null && partIndex === answerPartIndex ? 'animate-pop-in' : ''}`}
        >
          {part.split('').map((char, charIndex) => {
            const iconFile = iconMap[char];
            if (!iconFile) return null;
            return (
              <img
                key={`${partIndex}-${charIndex}`}
                src={`${ASSET_PATH}/${iconFile}`}
                alt={char}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const VisualCalculation: React.FC<{ problem: MathProblem }> = ({ problem }) => {
  const starIconUrl = 'https://be-gom-vui-hoc.vercel.app/assets/images/ngoi-sao-vang.png';
  const parts = problem.problem.split(' ');
  if (parts.length !== 3 || problem.type !== 'calculation') return null;

  const num1 = parseInt(parts[0], 10);
  const operator = parts[1];
  const num2 = parseInt(parts[2], 10);

  if (isNaN(num1) || isNaN(num2)) return null;

  const IconGrid: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex flex-wrap justify-center items-center gap-2 p-3 bg-purple-100/50 rounded-lg min-w-[140px] min-h-[80px] w-full shadow-inner">
      {Array.from({ length: count }).map((_, i) => (
        <img key={i} src={starIconUrl} alt="star" className="w-8 h-8 sm:w-10 sm:h-10" />
      ))}
    </div>
  );

  const OperatorIcon: React.FC<{ op: string }> = ({ op }) => {
    const iconUrl = op === '+' ? 'https://be-gom-vui-hoc.vercel.app/assets/images/operator-plus.png' : 'https://be-gom-vui-hoc.vercel.app/assets/images/operator-minus.png';
    return <img src={iconUrl} alt={op} className="w-12 h-12 sm:w-16 sm:h-16 mx-2 sm:mx-4 object-contain self-center" />;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center my-4 sm:my-6 gap-2 w-full max-w-lg mx-auto">
      <IconGrid count={num1} />
      <OperatorIcon op={operator} />
      <IconGrid count={num2} />
    </div>
  );
};


interface MathGameProps {
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


const MathGame: React.FC<MathGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [gameType, setGameType] = useState<'addition' | 'subtraction' | 'comparison' | null>(null);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [options, setOptions] = useState<(number | string)[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<number | string | null>(null);

  const level = Math.floor(score / 5) + 1;

  const generateOptions = useCallback((p: MathProblem) => {
    if (p.type === 'comparison') {
      return ['<', '>', '='].sort(() => Math.random() - 0.5);
    }
    const answer = p.answer as number;
    const opts = new Set<number>();
    opts.add(answer);
    while (opts.size < 3) {
      const randomOffset = Math.floor(Math.random() * 5) - 2;
      let randomAnswer = answer + randomOffset;
      if (randomAnswer < 0) randomAnswer = 0;
      if (randomAnswer !== answer) {
        opts.add(randomAnswer);
      }
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  }, []);

  const fetchNewProblem = useCallback(async (type: 'addition' | 'subtraction' | 'comparison') => {
    setIsLoading(true);
    setProblem(null);
    setRevealedAnswer(null);
    try {
      const newProblem = await generateMathProblem(level, type);
      setProblem(newProblem);
      setOptions(generateOptions(newProblem));
    } catch (error) {
      console.error("Failed to fetch math problem:", error);
      setFeedback({ message: "Lỗi rồi!", isCorrect: false });
    } finally {
      setIsLoading(false);
    }
  }, [level, generateOptions]);

  const handleSelectType = (type: 'addition' | 'subtraction' | 'comparison') => {
    playSound('click', isSoundOn);
    setGameType(type);
    fetchNewProblem(type);
  };

  const handleAnswer = async (selected: number | string) => {
    if (feedback || !problem || !gameType) return;

    playSound('click', isSoundOn);

    if (selected === problem.answer) {
      setRevealedAnswer(problem.answer);
      const feedbackMessage = await playFeedback(true, isSoundOn);
      playEquationSpeech(problem.problem, problem.answer, problem.type, isSoundOn);
      setFeedback({ message: feedbackMessage, isCorrect: true });
      setScore(s => s + 1);
      onCorrectAnswer();
      setTimeout(() => {
        setFeedback(null);
        fetchNewProblem(gameType);
      }, 2000);
    } else {
      const feedbackMessage = await playFeedback(false, isSoundOn);
      setFeedback({ message: feedbackMessage, isCorrect: false });
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  const questionText = useMemo(() => problem ? getEquationText(problem.problem, problem.answer, problem.type, true) : '', [problem]);

  if (!gameType) {
    return (
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-4xl bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-6 relative flex flex-col items-center max-h-full overflow-y-auto">
          <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors">
            <HomeIcon className="w-10 h-10 md:w-12 md:h-12" />
          </button>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-purple-700 mb-2 mt-8 md:mt-4">Bé Học Toán</h2>
          <p className="text-center text-lg sm:text-xl md:text-2xl text-pink-500 mb-6 font-semibold">Con muốn học dạng toán nào?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <GameTypeButton title="Phép Cộng" onClick={() => handleSelectType('addition')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-plus.png" />
            <GameTypeButton title="Phép Trừ" onClick={() => handleSelectType('subtraction')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-minus.png" />
            <GameTypeButton title="So Sánh" onClick={() => handleSelectType('comparison')} imageUrl="https://be-gom-vui-hoc.vercel.app/assets/images/operator-greater.png" />
          </div>
        </div>
      </div>
    );
    );
  }

return (
  <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
    <style>{`
          @keyframes pop-in {
              0% { transform: scale(0.5); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in {
              animation: pop-in 0.3s ease-out forwards;
          }
      `}</style>
    <div className="w-full max-w-5xl bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-4 relative flex flex-col max-h-full overflow-y-auto">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center bg-yellow-400 text-white font-bold py-1 px-3 rounded-full shadow-md z-10">
        <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-1 sm:mr-2" />
        <span className="text-2xl sm:text-3xl">{score}</span>
      </div>
      <button onClick={() => { playSound('click', isSoundOn); stopAllSounds(); setGameType(null); }} className="absolute top-2 left-2 sm:top-4 sm:left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
        <ArrowLeftIcon className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-purple-700 mb-1 mt-8 sm:mt-10">Bé Học Toán</h2>
      <p className="text-center text-lg sm:text-xl text-pink-500 mb-2 sm:mb-4 font-semibold">Cấp độ {level}</p>

      {isLoading && !problem && <div className="text-center p-16"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto"></div><p className="mt-4 text-purple-600">Đang tải câu hỏi...</p></div>}

      {problem && (
        <div className="text-center transition-opacity duration-500 flex flex-col flex-grow justify-center">
          <div className="mb-2 sm:mb-4 min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center p-2 bg-purple-50 rounded-xl shadow-inner">
            <EquationVisualizer problem={problem} revealedAnswer={revealedAnswer} />
          </div>

          {problem.type === 'calculation' && <VisualCalculation problem={problem} />}

          <div className="flex items-center justify-center gap-4 mb-2 sm:mb-4">
            <ReadAloudButton text={questionText} lang="vi" isSoundOn={isSoundOn} />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {options.map(opt => (
              <button
                key={String(opt)}
                onClick={() => handleAnswer(opt)}
                className="bg-sky-400 hover:bg-sky-500 text-white font-bold text-3xl sm:text-4xl md:text-6xl py-4 sm:py-6 md:py-8 rounded-2xl shadow-lg transform transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
                disabled={!!feedback}
              >
                {String(opt)}
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

export default MathGame;