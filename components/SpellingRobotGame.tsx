import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateSpellingRobotProblemSet } from '../services/geminiService';
import { getInteractiveSpellingAudioSequence } from '../services/feedbackService';
import type { SpellingRobotProblem } from '../types';
import { HomeIcon, StarIcon, SpeakerIcon } from './icons';
import { playSound, speak, playAudioSequence } from '../services/audioService';
import { getVowelWithTone } from '../utils/textUtils';
import Confetti from './Confetti';

// --- Types & Interfaces ---
interface SpellingRobotGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}
type GamePhase = 'selection' | 'assembling' | 'finished';
type AssemblyStep = 'onset' | 'rime' | 'tone';

interface UserSelections {
    onset: string | null;
    rime: string | null;
    tone: string | null;
}

// --- Helper Functions & Data ---
const toneMap: Record<string, string> = {
    'sắc': '´', 'huyền': '`', 'hỏi': '̉', 'ngã': '̃', 'nặng': '.', 'ngang': ''
};

// --- Main Component ---
const SpellingRobotGame: React.FC<SpellingRobotGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [gamePhase, setGamePhase] = useState<GamePhase>('selection');
    const [problemSet, setProblemSet] = useState<SpellingRobotProblem[]>([]);
    const [currentProblem, setCurrentProblem] = useState<SpellingRobotProblem | null>(null);
    const [assemblyStep, setAssemblyStep] = useState<AssemblyStep>('onset');
    const [userSelections, setUserSelections] = useState<UserSelections>({ onset: null, rime: null, tone: null });
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);


    const loadNewProblemSet = useCallback(async () => {
        setIsLoading(true);
        setGamePhase('selection');
        setCurrentProblem(null);
        setUserSelections({ onset: null, rime: null, tone: null });
        setAssemblyStep('onset');
        try {
            const problems = await generateSpellingRobotProblemSet(3);
            setProblemSet(problems);
        } catch (error) {
            console.error("Failed to fetch problem set:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNewProblemSet();
    }, [loadNewProblemSet]);

    const handleSelectProblem = (problem: SpellingRobotProblem) => {
        playSound('click', isSoundOn);
        setCurrentProblem(problem);
        setGamePhase('assembling');
        playAudioSequence([`Bây giờ mình ráp tiếng ${problem.targetWord} nhé`], isSoundOn);
    };
    
    const handleChoice = async (choice: string) => {
        if (!currentProblem || feedback || isSpeaking) return;
        playSound('click', isSoundOn);

        const correctChoice = currentProblem.syllable[assemblyStep];
        
        if (choice === correctChoice) {
            setIsSpeaking(true);
            const newSelections = { ...userSelections, [assemblyStep]: choice };
            setUserSelections(newSelections);
            onCorrectAnswer();

            const interactiveSequence = getInteractiveSpellingAudioSequence(assemblyStep, { syllable: newSelections, targetWord: currentProblem.targetWord });
            await playAudioSequence(interactiveSequence, isSoundOn);
            

            if (assemblyStep === 'onset') {
                setAssemblyStep('rime');
                 setIsSpeaking(false);
            } else if (assemblyStep === 'rime') {
                setAssemblyStep('tone');
                 setIsSpeaking(false);
            } else if (assemblyStep === 'tone') {
                // Final step is complete
                setGamePhase('finished');
                setScore(s => s + 1);
                setTimeout(() => {
                    loadNewProblemSet();
                    setIsSpeaking(false); // Reset for next round
                }, 3000); // Shorter delay now, just for celebration
            }
        } else {
            playSound('incorrect', isSoundOn);
            setFeedback(`Chưa đúng rồi! Thử lại nhé.`);
            playAudioSequence(['Chưa đúng', 'Con thử lại nhé'], isSoundOn);
            setTimeout(() => setFeedback(null), 2000);
        }
    };
    
    const displayedWord = useMemo(() => {
        if (!currentProblem) return '';
        const { onset, rime, tone } = userSelections;
        if (!onset) return `_ ${currentProblem.syllable.rime} ${toneMap[currentProblem.syllable.tone]}`;
        if (!rime) return `${onset} _ ${toneMap[currentProblem.syllable.tone]}`;
        const rimeWithTone = getVowelWithTone(rime, currentProblem.syllable.tone);
        if (!tone) return `${onset}${rimeWithTone}`;
        
        return currentProblem.targetWord;

    }, [currentProblem, userSelections]);


    const renderSelectionScreen = () => (
        <div className="flex flex-col items-center">
            <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-8 mt-12">Học Đánh Vần</h2>
            <p className="text-3xl md:text-4xl text-pink-500 mb-8 font-semibold">Con hãy chọn một hình nhé!</p>
            {isLoading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problemSet.map(p => (
                        <button key={p.id} onClick={() => handleSelectProblem(p)} className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                            <img src={p.imageUrl} alt={p.targetWord} className="w-56 h-56 object-contain rounded-lg" />
                            <p className="mt-4 text-4xl font-bold text-purple-800">{p.targetWord}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
    
    const renderAssemblingScreen = () => {
        if (!currentProblem) return null;

        let choices: string[] = [];
        let instruction = '';
        if (assemblyStep === 'onset') {
            choices = currentProblem.choices.onset;
            instruction = 'Chọn Âm Đầu';
        } else if (assemblyStep === 'rime') {
            choices = currentProblem.choices.rime;
            instruction = 'Chọn Vần';
        } else {
            choices = currentProblem.choices.tone;
            instruction = 'Chọn Thanh';
        }

        return (
            <div className="flex flex-col items-center">
                 <h2 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-1 mt-12">Học Đánh Vần</h2>
                <div className="absolute top-4 right-4 flex items-center bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow-md">
                    <StarIcon className="w-8 h-8 mr-2" />
                    <span className="text-4xl">{score}</span>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
                    <div className="flex flex-col items-center">
                        <img src={currentProblem.imageUrl} alt={currentProblem.targetWord} className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-2xl shadow-lg" />
                        <div className="mt-4 p-4 bg-white rounded-xl shadow-inner min-w-[200px] text-center">
                             <p className="text-8xl font-bold text-purple-800 tracking-widest">{displayedWord}</p>
                        </div>
                    </div>
                    <div className="space-y-6 flex flex-col items-center">
                        {['onset', 'rime', 'tone'].map(step => (
                            <div key={step} className={`w-80 p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${assemblyStep === step ? 'bg-yellow-300 shadow-lg' : 'bg-gray-200'}`}>
                                <p className="font-bold text-2xl text-purple-700 w-28 capitalize">{step === 'onset' ? 'Âm đầu' : step === 'rime' ? 'Vần' : 'Thanh'}</p>
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-gray-800 shadow-inner">
                                   {userSelections[step as AssemblyStep] ? (step === 'tone' ? toneMap[userSelections.tone!] : userSelections[step as AssemblyStep]) : '?'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-12 w-full flex flex-col items-center">
                    <h3 className="text-4xl font-bold text-pink-500 mb-6">{instruction}</h3>
                    <div className="flex gap-6">
                        {choices.map(choice => (
                            <button 
                                key={choice} 
                                onClick={() => handleChoice(choice)}
                                disabled={!!feedback || isSpeaking}
                                className="w-32 h-32 bg-sky-400 text-white font-bold text-6xl rounded-2xl shadow-lg transform hover:scale-110 transition-transform disabled:opacity-50"
                            >
                                {assemblyStep === 'tone' ? toneMap[choice] || ' ' : choice}
                            </button>
                        ))}
                    </div>
                     {feedback && <p className="mt-4 text-2xl font-bold text-red-500">{feedback}</p>}
                </div>

            </div>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4">
            <div className="w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors">
                    <HomeIcon className="w-12 h-12" />
                </button>
                {gamePhase === 'selection' && renderSelectionScreen()}
                {gamePhase === 'assembling' && renderAssemblingScreen()}
                {gamePhase === 'finished' && (
                    <div className="text-center py-20">
                        <Confetti />
                         <p className="text-8xl mb-4 animate-bounce">🎉</p>
                        <h2 className="text-7xl font-bold text-green-600">Con giỏi quá!</h2>
                        <p className="text-4xl mt-2 text-purple-700">Đã ráp xong tiếng <span className="font-bold">{currentProblem?.targetWord}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpellingRobotGame;