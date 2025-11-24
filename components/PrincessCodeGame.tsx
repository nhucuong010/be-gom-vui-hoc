import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generatePrincessCodeProblem } from '../services/geminiService';
import { numberCharacters } from '../data/princessCodeData';
import type { PrincessCodeProblem, NumberCharacter, StoryStep, StoryChoice } from '../types';
import { HomeIcon, StarIcon, BookOpenIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';

// --- Interfaces ---
interface PrincessCodeGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}
type GamePhase = 'home' | 'level_select' | 'learn' | 'intro' | 'story' | 'review' | 'decode' | 'win';

// --- Helper Component for Highlighting ---
const HighlightedStory: React.FC<{ text: string, keywords: string[] }> = ({ text, keywords }) => {
    if (!keywords.length) return <>{text}</>;
    // Create a regex that is case-insensitive
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                // Check if the part is one of the keywords (case-insensitive)
                keywords.some(kw => kw.toLowerCase() === part.toLowerCase()) ? (
                    <span key={i} className="font-bold text-pink-500">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};


// --- Main Component ---
const PrincessCodeGame: React.FC<PrincessCodeGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [phase, setPhase] = useState<GamePhase>('home');
    const [problem, setProblem] = useState<PrincessCodeProblem | null>(null);
    const [problemCharacters, setProblemCharacters] = useState<NumberCharacter[]>([]);
    const [storyStepIndex, setStoryStepIndex] = useState(0);
    const [userStory, setUserStory] = useState<string[]>([]);
    const [decodeStepIndex, setDecodeStepIndex] = useState(0);
    const [decodeChoices, setDecodeChoices] = useState<NumberCharacter[]>([]);
    const [enteredCode, setEnteredCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const startNewLevel = useCallback(async (selectedLevel: number) => {
        setIsLoading(true);
        setPhase('intro');
        setUserStory([]);
        setEnteredCode('');
        setStoryStepIndex(0);
        setDecodeStepIndex(0);
        try {
            const newProblem = await generatePrincessCodeProblem(selectedLevel);
            setProblem(newProblem);
            const chars = newProblem.code.split('').map(digit => 
                numberCharacters.find(nc => nc.digit === parseInt(digit))!
            );
            setProblemCharacters(chars);
        } catch (error) {
            console.error("Failed to start new level:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleStoryChoice = (choice: StoryChoice) => {
        playSound('click', isSoundOn);
        const newStory = [...userStory, choice.storySegment];
        setUserStory(newStory);
        if (storyStepIndex < problem!.storySteps.length - 1) {
            setStoryStepIndex(prev => prev + 1);
        } else {
            setPhase('review');
        }
    };
    
    const setupDecodeStep = useCallback(() => {
        if (!problem) return;
        const correctCharacter = problemCharacters[decodeStepIndex];
        const distractors = numberCharacters
            .filter(nc => nc.digit !== correctCharacter.digit)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        const choices = [correctCharacter, ...distractors].sort(() => 0.5 - Math.random());
        setDecodeChoices(choices);
    }, [problem, problemCharacters, decodeStepIndex]);
    
    // Auto-play audio for different phases/steps
    useEffect(() => {
        if (phase === 'intro' && problem) {
            const text = `Kho báu hôm nay có mật mã ${problem.code.length} số. Các bạn số này sẽ giúp chúng ta nhớ nhé:`;
            playDynamicSentence(text, 'vi', isSoundOn);
        }
    }, [phase, problem, isSoundOn]);

    useEffect(() => {
        if (phase === 'story' && problem) {
            const step = problem.storySteps[storyStepIndex];
            playDynamicSentence(step.question, 'vi', isSoundOn);
        }
    }, [phase, storyStepIndex, problem, isSoundOn]);

    useEffect(() => {
        if (phase === 'decode') {
            const question = `Nhân vật thứ ${decodeStepIndex + 1} trong câu chuyện là ai?`;
            playDynamicSentence(question, 'vi', isSoundOn);
            setupDecodeStep();
        }
    }, [phase, decodeStepIndex, setupDecodeStep, isSoundOn]);


    const handleDecodeChoice = (choice: NumberCharacter) => {
        playSound('click', isSoundOn);
        const correctCharacter = problemCharacters[decodeStepIndex];
        if (choice.digit === correctCharacter.digit) {
            playSound('correct', isSoundOn);
            onCorrectAnswer();
            const newCode = enteredCode + choice.digit;
            setEnteredCode(newCode);

            if (decodeStepIndex < problemCharacters.length - 1) {
                setDecodeStepIndex(prev => prev + 1);
            } else {
                setPhase('win');
                playSound('win', isSoundOn);
            }
        } else {
            playSound('incorrect', isSoundOn);
            // NEW: Add a helpful hint
            const hint = `Chưa đúng rồi. Con nhớ lại xem, ${correctCharacter.description} nhé.`;
            playDynamicSentence(hint, 'vi', isSoundOn);
        }
    };
    
    const fullStory = useMemo(() => userStory.join(' '), [userStory]);

    // --- Render Functions for Each Phase ---

    const renderHomeScreen = () => (
        <div className="text-center">
            <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-4 mt-12">Mật Mã Công Chúa</h2>
            <p className="text-3xl text-pink-500 mb-12">Bé hãy giúp công chúa nhớ mật mã để mở kho báu nhé!</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <button onClick={() => { playSound('click', isSoundOn); setPhase('level_select'); }} className="w-80 bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">
                    🔓 Chọn Màn Chơi
                </button>
                <button onClick={() => { playSound('click', isSoundOn); setPhase('learn'); }} className="w-80 bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">
                    📚 Làm quen số
                </button>
            </div>
        </div>
    );

    const renderLevelSelectScreen = () => (
        <div className="text-center">
            <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-4 mt-12">Chọn Màn Chơi</h2>
            <p className="text-3xl text-pink-500 mb-12">Con muốn thử thách với mật mã mấy số nào?</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <button onClick={() => { playSound('click', isSoundOn); startNewLevel(1); }} className="w-80 bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">
                    Màn 1 (3 số)
                </button>
                <button onClick={() => { playSound('click', isSoundOn); startNewLevel(2); }} className="w-80 bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">
                    Màn 2 (4 số)
                </button>
            </div>
             <button onClick={() => { playSound('click', isSoundOn); stopAllSounds(); setPhase('home'); }} className="mt-12 bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full text-2xl shadow-md hover:bg-gray-300">Quay lại</button>
        </div>
    );
    
    const renderLearnScreen = () => (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-center text-purple-700 mb-8">Làm quen với các bạn số</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {numberCharacters.map(char => (
                    <div key={char.digit} className="bg-white p-4 rounded-2xl shadow-md text-center transform hover:-translate-y-1 transition-transform">
                        <div className="w-full h-32 bg-white rounded-3xl shadow-inner p-2">
                             <img src={char.imageUrl} alt={char.name} className="w-full h-full object-contain"/>
                        </div>
                        <p className="text-6xl font-bold text-gray-800 mt-2">{char.digit}</p>
                        <p className="text-xl font-semibold text-pink-500">{char.name}</p>
                    </div>
                ))}
            </div>
            <button onClick={() => { playSound('click', isSoundOn); stopAllSounds(); setPhase('home'); }} className="mt-8 mx-auto block bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full text-2xl shadow-md hover:bg-gray-300">Quay lại</button>
        </div>
    );

    const renderIntroScreen = () => (
        <div className="text-center">
            <h2 className="text-5xl font-bold text-purple-700 mb-4">Nhiệm vụ của bé!</h2>
            <p className="text-2xl text-pink-500 mb-8">Kho báu hôm nay có mật mã {problem?.code.length} số. Các bạn số này sẽ giúp chúng ta nhớ nhé:</p>
            <div className="flex justify-center items-center gap-4 md:gap-8 my-8">
                {problemCharacters.map((char, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 animate-fade-in-down" style={{animationDelay: `${index * 150}ms`}}>
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl shadow-lg p-2">
                           <img src={char.imageUrl} alt={char.name} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-2xl font-bold text-purple-800">{char.name}</p>
                    </div>
                ))}
            </div>
            <button onClick={() => setPhase('story')} className="bg-green-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg transform hover:scale-105 transition-transform">
                Bắt đầu kể chuyện!
            </button>
        </div>
    );
    
    const renderStoryScreen = () => {
        if (!problem) return null;
        const step = problem.storySteps[storyStepIndex];
        const stepCharacters = step.characterIndices.map(i => problemCharacters[i]);
        return (
            <div className="text-center">
                <div className="flex justify-center items-center gap-4 md:gap-8 mb-6">
                    {stepCharacters.map(char => (
                         <div key={char.digit} className="flex flex-col items-center gap-2">
                            <div className="w-32 h-32 bg-white rounded-3xl shadow-lg p-2">
                                <img src={char.imageUrl} alt={char.name} className="w-full h-full object-contain" />
                            </div>
                         </div>
                    ))}
                </div>
                <h2 className="text-4xl font-bold text-purple-700 mb-8">{step.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {step.choices.map((choice, index) => (
                        <button key={index} onClick={() => handleStoryChoice(choice)} className="bg-white p-6 rounded-2xl shadow-lg text-2xl text-gray-700 font-semibold text-center h-40 flex items-center justify-center transform hover:bg-yellow-100 hover:shadow-xl transition-all">
                            {choice.text}
                        </button>
                    ))}
                </div>
            </div>
        );
    };
    
    const renderReviewScreen = () => (
         <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold text-purple-700 mb-6">Câu chuyện của chúng ta là...</h2>
            <div className="bg-white/70 p-8 rounded-2xl shadow-inner mb-8">
                <p className="text-3xl text-gray-800 leading-relaxed">
                     <HighlightedStory text={fullStory} keywords={problemCharacters.map(c => c.name)} />
                </p>
            </div>
            <div className="flex justify-center gap-6">
                 <button onClick={() => { playSound('click', isSoundOn); playDynamicSentence(fullStory, 'vi', isSoundOn); }} className="bg-sky-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform">🔊 Nghe lại</button>
                 <button onClick={() => { playSound('click', isSoundOn); setPhase('decode'); }} className="bg-pink-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform">🔑 Mở kho báu!</button>
            </div>
         </div>
    );

    const renderDecodeScreen = () => {
        if (!problem) return null;
        
        return (
             <div className="text-center">
                <div className="mb-8 p-4 bg-white/50 rounded-2xl shadow-inner">
                    <div className="flex justify-center items-center gap-4 h-24">
                        {problem.code.split('').map((digit, index) => (
                            <div key={index} className="w-20 h-24 bg-purple-200 border-4 border-dashed border-purple-400 rounded-lg flex items-center justify-center text-6xl font-bold text-purple-800">
                                {enteredCode[index] || ''}
                            </div>
                        ))}
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-purple-700 mb-8">{`Nhân vật thứ ${decodeStepIndex + 1} trong câu chuyện là ai?`}</h2>
                <div className="flex justify-center items-center gap-8">
                    {decodeChoices.map(char => (
                         <button key={char.digit} onClick={() => handleDecodeChoice(char)} className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-lg transform hover:scale-110 hover:shadow-xl transition-all active:scale-95">
                            <img src={char.imageUrl} alt={char.name} className="w-32 h-32 object-contain" />
                            <p className="text-xl font-semibold text-pink-500">{char.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        )
    };
    
    const renderWinScreen = () => (
        <div className="text-center">
            <Confetti />
            <style>{`
                @keyframes win-bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-30px); }
                    60% { transform: translateY(-15px); }
                }
                .animate-win-bounce {
                    animation: win-bounce 1s ease;
                }
                @keyframes sparkle-anim {
                    0% { transform: scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .sparkle {
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    background-color: yellow;
                    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                    animation: sparkle-anim 0.8s ease-out forwards;
                }
            `}</style>
            <h2 className="text-7xl font-bold text-yellow-500 drop-shadow-lg mb-4">Mở được kho báu rồi!</h2>
            <p className="text-4xl text-purple-700 mb-8">Mật mã chính xác là <span className="font-bold tracking-widest">{problem?.code}</span></p>
            <div className="relative w-96 h-96 mx-auto">
                 <img src="https://be-gom-vui-hoc.vercel.app/assets/images/treasure_chest_open.png" alt="Kho báu mở" className="w-full h-full object-contain animate-win-bounce" />
                 {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="sparkle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 1}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>
            <button onClick={() => { setPhase('level_select'); }} className="mt-8 bg-green-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg transform hover:scale-105 transition-transform">Chơi màn tiếp theo!</button>
        </div>
    );

    const renderContent = () => {
        switch(phase) {
            case 'home': return renderHomeScreen();
            case 'level_select': return renderLevelSelectScreen();
            case 'learn': return renderLearnScreen();
            case 'intro': return isLoading ? <div className="text-center text-2xl">Đang nghĩ mật mã...</div> : renderIntroScreen();
            case 'story': return renderStoryScreen();
            case 'review': return renderReviewScreen();
            case 'decode': return renderDecodeScreen();
            case 'win': return renderWinScreen();
            default: return <div>Lỗi...</div>;
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4">
             <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative min-h-[70vh] flex items-center justify-center">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
                    <HomeIcon className="w-12 h-12" />
                </button>
                 {renderContent()}
            </div>
        </div>
    );
};

export default PrincessCodeGame;