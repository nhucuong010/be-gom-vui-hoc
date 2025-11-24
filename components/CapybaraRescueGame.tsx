
import React, { useState, useEffect, useCallback } from 'react';
import { generateCapybaraQuestion } from '../data/capybaraRescueData';
import type { CapybaraQuestion } from '../types';
import { HomeIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import Confetti from './Confetti';
import ReadAloudButton from './ReadAloudButton';

interface CapybaraRescueGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app/assets/images';
const STEPS_COUNT = 5;

// Visual positions for steps (percentages from bottom)
const STEP_POSITIONS = [15, 30, 45, 60, 75]; 

const CapybaraRescueGame: React.FC<CapybaraRescueGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [phase, setPhase] = useState<'intro' | 'playing' | 'win'>('intro');
    const [currentStep, setCurrentStep] = useState(0); // 0 = ground, 1-5 = cloud steps
    const [question, setQuestion] = useState<CapybaraQuestion | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [showHint, setShowHint] = useState(false);

    // --- Audio Effects ---
    useEffect(() => {
        if (phase === 'intro') {
            const introSequence = async () => {
                await playDynamicSentence("Một hôm, bé Gốm đang chơi với bóng bay.", 'vi', isSoundOn, 'capybara_rescue');
                await new Promise(r => setTimeout(r, 500));
                await playDynamicSentence("Bỗng gió thổi mạnh, bóng bay bay lên cao mất rồi!", 'vi', isSoundOn, 'capybara_rescue');
            };
            introSequence();
        } else if (phase === 'playing' && currentStep === 0) {
             playDynamicSentence("Con giúp bé Gốm nhảy lên giải cứu bóng bay nhé!", 'vi', isSoundOn, 'capybara_rescue');
        } else if (phase === 'win') {
            // NEW: Updated win sequence with specific thanks to Gom
            const winSequence = async () => {
                 await playDynamicSentence("Yeahhh! Con đã giải cứu được bóng bay capybara rồi!", 'vi', isSoundOn, 'capybara_rescue');
                 await new Promise(r => setTimeout(r, 500));
                 await playDynamicSentence("Cảm ơn Gốm đã lấy bóng giúp tớ! Gốm giỏi quá!", 'vi', isSoundOn, 'capybara_rescue');
            }
            winSequence();
        }
    }, [phase, isSoundOn, currentStep]);

    // --- Logic ---
    const startGame = () => {
        playSound('click', isSoundOn);
        setCurrentStep(0);
        // Start with step 0 difficulty
        setQuestion(generateCapybaraQuestion(0));
        setPhase('playing');
        setShowHint(false);
    };

    const handleAnswer = (selected: number) => {
        if (!question || feedback) return;
        playSound('click', isSoundOn);

        if (selected === question.answer) {
            setFeedback('correct');
            playSound('correct', isSoundOn);
            onCorrectAnswer();
            playDynamicSentence("Đúng rồi!", 'vi', isSoundOn);

            setTimeout(() => {
                setFeedback(null);
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                
                if (nextStep >= STEPS_COUNT) {
                    setTimeout(() => {
                        setPhase('win');
                        playSound('win', isSoundOn);
                    }, 1000);
                } else {
                    // Generate next question based on the new step index (increases difficulty)
                    setQuestion(generateCapybaraQuestion(nextStep));
                    // Play question audio for the new question
                    setTimeout(() => {
                         if (phase === 'playing') { // Check if still playing
                             // We don't have the new question obj here easily without refetching, 
                             // but the effect isn't ideal for rapid fire. 
                             // Let's just play a generic sound or rely on the auto-read button.
                         }
                    }, 500);
                }
            }, 1000);
        } else {
            setFeedback('incorrect');
            playSound('incorrect', isSoundOn);
            playDynamicSentence("Mình đếm thử nhé!", 'vi', isSoundOn, 'capybara_rescue');
            setShowHint(true);
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    // --- Rendering ---

    const renderIntro = () => (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg text-center shadow-2xl border-4 border-sky-300 animate-pop-in">
                <img src={`${ASSET_BASE_URL}/cr_balloon_capy.png`} className="w-32 h-32 mx-auto mb-4 animate-bounce-slow" alt="Balloon" style={{ mixBlendMode: 'multiply' }}/>
                <h2 className="text-3xl font-bold text-purple-700 mb-4">Giải Cứu Bóng Bay!</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Bóng bay của Capybara bị kẹt trên cao rồi! <br/>
                    Con hãy giúp Gốm trả lời đúng các phép tính để nhảy lên từng bậc mây và lấy bóng nhé!
                </p>
                <button onClick={startGame} className="bg-sky-500 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:scale-105 transition-transform">
                    Bắt đầu
                </button>
            </div>
        </div>
    );

    const renderWin = () => (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <Confetti />
            <div className="bg-white rounded-3xl p-8 max-w-lg text-center shadow-2xl border-4 border-yellow-300 animate-pop-in">
                <img src={`${ASSET_BASE_URL}/cr_capy_happy.png`} className="w-40 h-40 mx-auto mb-4" alt="Happy Capy" style={{ mixBlendMode: 'multiply' }}/>
                <h2 className="text-4xl font-bold text-green-600 mb-4">Thành công rồi!</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Gốm đã lấy được bóng bay cho bạn Capybara.<br/>
                    Con giỏi quá!
                </p>
                <button onClick={startGame} className="bg-pink-500 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:scale-105 transition-transform">
                    Chơi lại
                </button>
            </div>
        </div>
    );

    const renderHint = () => {
        if (!question) return null;
        return (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl z-40 animate-fade-in flex flex-col items-center">
                <h3 className="text-purple-600 font-bold mb-2">Đếm cùng tớ nhé:</h3>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1 bg-sky-100 p-2 rounded-lg">
                        {Array.from({length: question.num1}).map((_,i) => (
                            <img key={`h1-${i}`} src={`${ASSET_BASE_URL}/cr_candy_dot.png`} className="w-8 h-8" style={{ mixBlendMode: 'multiply' }}/>
                        ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-500">+</span>
                    <div className="flex gap-1 bg-pink-100 p-2 rounded-lg">
                        {Array.from({length: question.num2}).map((_,i) => (
                            <img key={`h2-${i}`} src={`${ASSET_BASE_URL}/cr_candy_dot.png`} className="w-8 h-8" style={{ mixBlendMode: 'multiply' }}/>
                        ))}
                    </div>
                </div>
                <p className="mt-2 text-xl font-bold text-gray-700">Tất cả là: <span className="text-green-600">{question.answer}</span></p>
                <button onClick={() => setShowHint(false)} className="mt-4 bg-sky-500 text-white px-6 py-2 rounded-full">Đã hiểu</button>
            </div>
        )
    }

    return (
        <div className="w-full h-screen max-h-screen flex flex-col items-center relative overflow-hidden bg-sky-200">
             {/* Background */}
            <div 
                className="absolute inset-0 bg-cover bg-bottom transition-all duration-1000"
                style={{ backgroundImage: `url(${ASSET_BASE_URL}/cr_bg_sky.png)` }}
            ></div>

            {/* Header Controls */}
            <button onClick={() => { stopAllSounds(); onGoHome(); }} className="absolute top-4 left-4 z-30 bg-white p-2 rounded-full shadow-md text-sky-600">
                <HomeIcon className="w-8 h-8" />
            </button>

            {/* Balloon Target (Top) */}
            <div className={`absolute top-[5%] left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1000 ${phase === 'win' ? 'top-[60%]' : ''}`}>
                <img src={`${ASSET_BASE_URL}/cr_balloon_capy.png`} className="w-24 md:w-32 animate-bounce-slow drop-shadow-lg" alt="Target Balloon" style={{ mixBlendMode: 'multiply' }}/>
            </div>

            {/* Cloud Steps */}
            {STEP_POSITIONS.map((bottomPos, index) => (
                <div 
                    key={index}
                    // INCREASED CLOUD SIZE HERE
                    className="absolute w-48 md:w-72 h-24 md:h-32 transition-all duration-500"
                    style={{ 
                        bottom: `${bottomPos}%`, 
                        left: index % 2 === 0 ? '30%' : '70%', // Zigzag pattern
                        transform: 'translateX(-50%)'
                    }}
                >
                    <img src={`${ASSET_BASE_URL}/cr_cloud_step.png`} className="w-full h-full object-contain opacity-90" alt="cloud" style={{ mixBlendMode: 'screen' }}/>
                </div>
            ))}

            {/* Characters (Bottom Ground) */}
            <div className="absolute bottom-[5%] left-[10%] z-10">
                <img src={`${ASSET_BASE_URL}/cr_capy_friend.png`} className="w-24 md:w-32 drop-shadow-md" alt="Sad Capy" style={{ mixBlendMode: 'multiply' }}/>
            </div>
            
            {/* Gốm Character (Moving) */}
            <div 
                className="absolute z-20 transition-all duration-700 ease-in-out"
                style={{
                    // ADJUSTED VERTICAL OFFSET HERE (+12% instead of +8%)
                    bottom: currentStep === 0 ? '5%' : `${STEP_POSITIONS[currentStep - 1] + 12}%`,
                    left: currentStep === 0 ? '25%' : ( (currentStep - 1) % 2 === 0 ? '30%' : '70%' ),
                    transform: 'translateX(-50%)'
                }}
            >
                <img 
                    src={`${ASSET_BASE_URL}/${phase === 'win' ? 'br_gom_happy.png' : 'cr_gom_jump.png'}`} 
                    className={`w-28 md:w-36 drop-shadow-xl ${phase === 'win' ? 'animate-bounce' : ''}`} 
                    alt="Gom"
                    style={{ mixBlendMode: 'multiply' }}
                />
            </div>

            {/* Game Interface (Bottom) */}
            {phase === 'playing' && question && (
                // COMPACT INTERFACE: Reduced padding, font sizes, and margins
                <div className="absolute bottom-0 left-0 right-0 bg-white/60 backdrop-blur-md p-3 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-30 flex flex-col items-center animate-slide-up border-t-4 border-white/30">
                    <div className="flex items-center gap-3 mb-2 bg-white/40 px-6 py-1 rounded-full">
                        <p className="text-2xl md:text-4xl font-black text-purple-700 drop-shadow-sm">{question.questionText}</p>
                        <ReadAloudButton text={question.questionText} lang="vi" isSoundOn={isSoundOn} className="scale-75" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                        {question.options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="bg-sky-400 hover:bg-sky-500 active:scale-95 text-white font-bold text-3xl py-2 md:py-3 rounded-2xl shadow-lg transition-all border-b-4 border-sky-600"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Overlays */}
            {phase === 'intro' && renderIntro()}
            {phase === 'win' && renderWin()}
            {showHint && renderHint()}

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
                 @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                 @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CapybaraRescueGame;
