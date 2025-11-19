import React, { useState, useMemo } from 'react';
import { HomeIcon, SpeakerIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import ReadAloudButton from './ReadAloudButton';
import Confetti from './Confetti';
import type { VocabularyItem } from '../types';
import { familyVocab, singlePersonActions, pairActions, characterActionMap, getStorySentences } from '../data/englishStoryData';


// --- Interfaces & Data ---
interface EnglishStoryGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

type GameMode = 'single' | 'pair' | 'two_separate';
type SubPhase = 'mode_select' | 'build_char1' | 'build_action1' | 'build_char2' | 'build_action2' | 'story_view' | 'build_action';

const EnglishStoryGame: React.FC<EnglishStoryGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [mode, setMode] = useState<GameMode | null>(null);
    const [subPhase, setSubPhase] = useState<SubPhase>('mode_select');
    const [selectedChar1, setSelectedChar1] = useState<VocabularyItem | null>(null);
    const [selectedChar2, setSelectedChar2] = useState<VocabularyItem | null>(null);
    const [selectedAction, setSelectedAction] = useState<VocabularyItem | null>(null);
    const [selectedAction2, setSelectedAction2] = useState<VocabularyItem | null>(null);
    const [transitioningId, setTransitioningId] = useState<string | null>(null);

    const resetStory = () => {
        setMode(null);
        setSelectedChar1(null);
        setSelectedChar2(null);
        setSelectedAction(null);
        setSelectedAction2(null);
        setTransitioningId(null);
    };

    const handleGoToMenu = () => {
        playSound('click', isSoundOn);
        stopAllSounds();
        resetStory();
        setSubPhase('mode_select');
    };

    const storySentences = useMemo(() => {
       return getStorySentences(mode, selectedChar1, selectedChar2, selectedAction, selectedAction2);
    }, [mode, selectedChar1, selectedChar2, selectedAction, selectedAction2]);

    const renderGrid = <T extends { id?: string; vietnamese: string; imageUrl: string }>(
        items: readonly T[],
        onSelect: (item: T) => void,
        instruction: string
    ) => (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
            <h2 className="text-4xl font-bold text-purple-700 mb-6 text-center">{instruction}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(item => {
                    const isSelected = transitioningId === item.id;
                    return (
                        <button
                            key={item.id ?? item.vietnamese}
                            onClick={() => onSelect(item)}
                            disabled={!!transitioningId}
                            className={`p-4 rounded-2xl shadow-md transform hover:scale-105 transition-all text-center ${isSelected ? 'bg-yellow-300 ring-4 ring-yellow-500' : 'bg-white'} disabled:cursor-wait`}
                        >
                            <img src={item.imageUrl} alt={item.vietnamese} className="w-full h-40 object-contain rounded-lg" />
                            <p className="mt-2 text-2xl font-bold text-purple-800 h-16 flex items-center justify-center">{item.vietnamese}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (subPhase) {
            case 'mode_select':
                return (
                    <div className="text-center">
                        <h1 className="text-6xl md:text-7xl font-bold text-center text-purple-700 mb-4 mt-12">Gia Đình Gốm</h1>
                        <p className="text-3xl text-pink-500 mb-12">Con muốn kể chuyện về mấy người?</p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                            <button onClick={() => { playSound('click', isSoundOn); setMode('single'); setSubPhase('build_char1'); }} className="w-80 bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">Một người</button>
                            <button onClick={() => { playSound('click', isSoundOn); setMode('pair'); setSubPhase('build_char1'); }} className="w-80 bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">Hai người (cùng làm)</button>
                            <button onClick={() => { playSound('click', isSoundOn); setMode('two_separate'); setSubPhase('build_char1'); }} className="w-80 bg-gradient-to-br from-teal-400 to-green-500 text-white font-bold py-6 px-10 rounded-2xl shadow-lg text-4xl transform hover:scale-105 transition-transform">Hai người (khác nhau)</button>
                        </div>
                    </div>
                );
            case 'build_char1':
                return renderGrid(familyVocab, (item) => {
                    if (transitioningId) return;
                    playSound('click', isSoundOn);
                    setTransitioningId(item.id!);
                    setSelectedChar1(item);
                    setTimeout(() => {
                        let nextPhase: SubPhase = 'build_char2';
                        if (mode === 'single') nextPhase = 'build_action';
                        if (mode === 'two_separate') nextPhase = 'build_action1';
                        setSubPhase(nextPhase);
                        setTransitioningId(null);
                    }, 800);
                }, "Đầu tiên, con chọn nhân vật thứ nhất nhé!");
            
            case 'build_action1':
                const actions1 = characterActionMap[selectedChar1?.id || '']?.map(id => singlePersonActions[id]).filter(Boolean) || [];
                return renderGrid(actions1, (item) => {
                    if (transitioningId) return;
                    playSound('click', isSoundOn);
                    setTransitioningId(item.id!);
                    setSelectedAction(item);
                     setTimeout(() => {
                        setSubPhase('build_char2');
                        setTransitioningId(null);
                    }, 800);
                }, `${selectedChar1?.vietnamese} đang làm gì?`);

            case 'build_char2':
                const availableChars = familyVocab.filter(c => c.id !== selectedChar1?.id);
                const instruction = mode === 'pair' ? `Tuyệt! Ai sẽ chơi cùng ${selectedChar1?.vietnamese}?` : `Tiếp theo, chọn nhân vật thứ hai!`;
                return renderGrid(availableChars, (item) => {
                    if (transitioningId) return;
                    playSound('click', isSoundOn);
                    setTransitioningId(item.id!);
                    setSelectedChar2(item);
                    setTimeout(() => {
                        setSubPhase(mode === 'pair' ? 'build_action' : 'build_action2');
                        setTransitioningId(null);
                    }, 800);
                }, instruction);
            
            case 'build_action2':
                const actions2 = characterActionMap[selectedChar2?.id || '']?.map(id => singlePersonActions[id]).filter(Boolean) || [];
                return renderGrid(actions2, (item) => {
                     if (transitioningId) return;
                    playSound('click', isSoundOn);
                    setTransitioningId(item.id!);
                    setSelectedAction2(item);
                     setTimeout(() => {
                        setSubPhase('story_view');
                        setTransitioningId(null);
                        playSound('win', isSoundOn);
                        onCorrectAnswer();
                    }, 800);
                }, `Còn ${selectedChar2?.vietnamese} đang làm gì?`);

            case 'build_action':
                let availableActions: VocabularyItem[];
                let actionInstruction = '';
                if (mode === 'single' && selectedChar1) {
                    const actionIds = characterActionMap[selectedChar1.id || ''] || [];
                    availableActions = actionIds.map(id => singlePersonActions[id]).filter(Boolean);
                    actionInstruction = `Tuyệt! ${selectedChar1?.vietnamese} đang làm gì thế con?`;
                } else {
                    availableActions = Object.values(pairActions);
                    actionInstruction = `Hai người đang làm gì cùng nhau?`;
                }
                return renderGrid(availableActions, (item) => {
                    if (transitioningId) return;
                    playSound('click', isSoundOn);
                    setTransitioningId(item.id!);
                    setSelectedAction(item);
                    setTimeout(() => {
                        setSubPhase('story_view');
                        setTransitioningId(null);
                        playSound('win', isSoundOn);
                        onCorrectAnswer();
                    }, 800);
                }, actionInstruction);
            case 'story_view':
                const playAll = async () => {
                    for (const sentence of storySentences) {
                        await playDynamicSentence(sentence, 'en', isSoundOn, 'english_story');
                    }
                }
                return (
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
                        <Confetti />
                        <h2 className="text-5xl font-bold text-purple-700 mb-6">Câu chuyện của bé!</h2>
                        {mode === 'two_separate' && selectedAction && selectedAction2 && (
                             <div className="flex justify-center gap-4 mb-4">
                                <img src={selectedAction.imageUrl} className="w-64 h-64 object-contain rounded-lg bg-white p-2 shadow-md" />
                                <img src={selectedAction2.imageUrl} className="w-64 h-64 object-contain rounded-lg bg-white p-2 shadow-md" />
                             </div>
                        )}
                        <div className="w-full bg-white/70 p-6 rounded-2xl shadow-inner space-y-4">
                            {storySentences.map((sentence, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                                    <p className="text-3xl font-semibold text-gray-800 flex-grow">{sentence}</p>
                                    <ReadAloudButton text={sentence} lang="en" isSoundOn={isSoundOn} game="english_story" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-6 mt-8">
                            <button onClick={playAll} className="bg-sky-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform flex items-center gap-3">
                                <SpeakerIcon className="w-8 h-8" /> Nghe lại
                            </button>
                            <button onClick={handleGoToMenu} className="bg-yellow-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform">
                                Tạo chuyện mới
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center p-4">
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
            <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative min-h-[70vh]">
                <button onClick={onGoHome} className="absolute top-4 left-4 text-purple-500 hover:text-pink-500 transition-colors z-10">
                    <HomeIcon className="w-12 h-12" />
                </button>
                {subPhase !== 'mode_select' && (
                    <button onClick={handleGoToMenu} className="absolute top-4 right-4 text-purple-500 hover:text-pink-500 transition-colors z-10 text-xl font-bold">
                        Về Menu
                    </button>
                )}
                <div className="flex items-center justify-center h-full">
                  {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EnglishStoryGame;