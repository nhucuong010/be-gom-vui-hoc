import React, { useState, useEffect, useRef } from 'react';
import { HomeIcon, StarIcon, ArrowUturnLeftIcon } from './icons';
import { playSound, stopAllSounds, playDynamicSentence } from '../services/audioService';
import Confetti from './Confetti';

interface PianoGameProps {
    onGoHome: () => void;
    isSoundOn: boolean;
}

interface Note {
    note: string;
    freq: number;
    type: 'white' | 'black';
    label?: string; // For tutorial hints
}

// Frequencies for C4 to E5
const NOTES: Note[] = [
    { note: 'C4', freq: 261.63, type: 'white' },
    { note: 'C#4', freq: 277.18, type: 'black' },
    { note: 'D4', freq: 293.66, type: 'white' },
    { note: 'D#4', freq: 311.13, type: 'black' },
    { note: 'E4', freq: 329.63, type: 'white' },
    { note: 'F4', freq: 349.23, type: 'white' },
    { note: 'F#4', freq: 369.99, type: 'black' },
    { note: 'G4', freq: 392.00, type: 'white' },
    { note: 'G#4', freq: 415.30, type: 'black' },
    { note: 'A4', freq: 440.00, type: 'white' },
    { note: 'A#4', freq: 466.16, type: 'black' },
    { note: 'B4', freq: 493.88, type: 'white' },
    { note: 'C5', freq: 523.25, type: 'white' },
    { note: 'C#5', freq: 554.37, type: 'black' },
    { note: 'D5', freq: 587.33, type: 'white' },
    { note: 'D#5', freq: 622.25, type: 'black' },
    { note: 'E5', freq: 659.25, type: 'white' },
];

const SONGS = [
    {
        id: 'happy_birthday',
        name: 'Happy Birthday 🎂',
        notes: [
            'C4', 'C4', 'D4', 'C4', 'F4', 'E4',
            'C4', 'C4', 'D4', 'C4', 'G4', 'F4',
            'C4', 'C4', 'C5', 'A4', 'F4', 'E4', 'D4',
            'A#4', 'A#4', 'A4', 'F4', 'G4', 'F4'
        ]
    },
    {
        id: 'twinkle',
        name: 'Twinkle Star 🌟',
        notes: [
            'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
            'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4',
            'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4',
            'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4',
            'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
            'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'
        ]
    },
    {
        id: 'jingle_bells',
        name: 'Jingle Bells 🎄',
        notes: [
            'E4', 'E4', 'E4',
            'E4', 'E4', 'E4',
            'E4', 'G4', 'C4', 'D4', 'E4',
            'F4', 'F4', 'F4', 'F4',
            'F4', 'E4', 'E4', 'E4', 'E4',
            'G4', 'G4', 'F4', 'D4', 'C4'
        ]
    },
    {
        id: 'baby_shark',
        name: 'Baby Shark 🦈',
        notes: [
            'D4', 'E4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4',
            'D4', 'E4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4',
            'D4', 'E4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4',
            'G4', 'G4', 'F#4'
        ]
    }
];

const PianoGame: React.FC<PianoGameProps> = ({ onGoHome, isSoundOn }) => {
    const [mode, setMode] = useState<'free' | 'tutorial'>('free');
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [tutorialIndex, setTutorialIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
    const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

    const currentSong = SONGS[currentSongIndex];

    useEffect(() => {
        // Initialize AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }

        if (mode === 'tutorial') {
            playDynamicSentence(`Bé hãy đánh bài ${currentSong.name} nhé!`, 'vi', isSoundOn);
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [mode, currentSongIndex, isSoundOn]);

    const playNote = (note: string, freq: number) => {
        if (!audioContextRef.current) return;
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        stopNote(note);

        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);

        gain.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);

        osc.start();

        oscillatorsRef.current.set(note, osc);
        gainNodesRef.current.set(note, gain);

        setActiveKeys(prev => new Set(prev).add(note));

        // Tutorial Logic
        if (mode === 'tutorial') {
            const expectedNote = currentSong.notes[tutorialIndex];
            if (note === expectedNote) {
                if (tutorialIndex === currentSong.notes.length - 1) {
                    setShowConfetti(true);
                    playDynamicSentence("Hoan hô! Bé giỏi quá!", 'vi', isSoundOn);
                    setTimeout(() => {
                        setShowConfetti(false);
                        setTutorialIndex(0);
                    }, 5000);
                } else {
                    setTutorialIndex(prev => prev + 1);
                }
            }
        }
    };

    const stopNote = (note: string) => {
        const osc = oscillatorsRef.current.get(note);
        const gain = gainNodesRef.current.get(note);

        if (osc && gain && audioContextRef.current) {
            try {
                gain.gain.cancelScheduledValues(audioContextRef.current.currentTime);
                gain.gain.setValueAtTime(gain.gain.value, audioContextRef.current.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);
                osc.stop(audioContextRef.current.currentTime + 0.1);
            } catch (e) { }
        }

        oscillatorsRef.current.delete(note);
        gainNodesRef.current.delete(note);
        setActiveKeys(prev => {
            const next = new Set(prev);
            next.delete(note);
            return next;
        });
    };

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, note: string, freq: number) => {
        e.preventDefault();
        playNote(note, freq);
    };

    const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent, note: string) => {
        e.preventDefault();
        setTimeout(() => {
            setActiveKeys(prev => {
                const next = new Set(prev);
                next.delete(note);
                return next;
            });
        }, 100);
    };

    return (
        <div className="fixed inset-0 bg-[#1a1a2e] flex flex-col items-center justify-center overflow-hidden touch-none select-none">
            {showConfetti && <Confetti />}

            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <HomeIcon className="w-8 h-8 text-purple-600" />
                </button>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4">
                        <button
                            onClick={() => { setMode('free'); setTutorialIndex(0); setShowConfetti(false); }}
                            className={`px-4 py-2 md:px-6 md:py-2 rounded-full font-bold text-lg md:text-xl shadow-lg transition-all ${mode === 'free' ? 'bg-pink-500 text-white scale-105 ring-4 ring-pink-300' : 'bg-white text-gray-600'}`}
                        >
                            Tự Do
                        </button>
                        <button
                            onClick={() => { setMode('tutorial'); setTutorialIndex(0); setShowConfetti(false); }}
                            className={`px-4 py-2 md:px-6 md:py-2 rounded-full font-bold text-lg md:text-xl shadow-lg transition-all ${mode === 'tutorial' ? 'bg-blue-500 text-white scale-105 ring-4 ring-blue-300' : 'bg-white text-gray-600'}`}
                        >
                            Học Đàn
                        </button>
                    </div>

                    {mode === 'tutorial' && (
                        <div className="bg-white/90 backdrop-blur rounded-xl p-2 shadow-xl border-2 border-blue-200">
                            <select
                                value={currentSongIndex}
                                onChange={(e) => {
                                    setCurrentSongIndex(Number(e.target.value));
                                    setTutorialIndex(0);
                                    setShowConfetti(false);
                                }}
                                className="bg-transparent text-blue-900 font-bold text-lg outline-none cursor-pointer"
                            >
                                {SONGS.map((song, idx) => (
                                    <option key={song.id} value={idx}>{song.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 mt-20 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-center px-4">
                {mode === 'tutorial' ? currentSong.name : 'Bé Làm Nhạc Sĩ'}
            </h2>

            {/* Piano Container */}
            <div className="relative flex items-start justify-center h-60 md:h-80 px-4 pb-10 w-full max-w-5xl overflow-x-auto no-scrollbar">
                <div className="relative flex h-full shadow-2xl rounded-b-xl overflow-hidden bg-gray-900 border-t-8 border-gray-800 p-1">
                    {NOTES.map((n, idx) => {
                        const isBlack = n.type === 'black';
                        const isActive = activeKeys.has(n.note);
                        const isTarget = mode === 'tutorial' && currentSong.notes[tutorialIndex] === n.note;

                        if (isBlack) return null;

                        const nextNote = NOTES[idx + 1];
                        const hasBlackAfter = nextNote && nextNote.type === 'black';

                        return (
                            <div key={n.note} className="relative h-full">
                                {/* White Key */}
                                <button
                                    onMouseDown={(e) => handleTouchStart(e, n.note, n.freq)}
                                    onMouseUp={(e) => handleTouchEnd(e, n.note)}
                                    onMouseLeave={(e) => handleTouchEnd(e, n.note)}
                                    onTouchStart={(e) => handleTouchStart(e, n.note, n.freq)}
                                    onTouchEnd={(e) => handleTouchEnd(e, n.note)}
                                    className={`
                                        w-10 md:w-16 h-full border border-gray-300 rounded-b-lg active:bg-gray-200 transition-colors
                                        ${isActive ? 'bg-yellow-200' : 'bg-white'}
                                        ${isTarget ? 'animate-pulse bg-yellow-100 ring-4 ring-yellow-400 z-10' : ''}
                                    `}
                                >
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 font-bold text-sm pointer-events-none">
                                        {n.note.replace(/\d/, '')}
                                    </span>
                                </button>

                                {/* Black Key */}
                                {hasBlackAfter && (
                                    <button
                                        onMouseDown={(e) => handleTouchStart(e, nextNote.note, nextNote.freq)}
                                        onMouseUp={(e) => handleTouchEnd(e, nextNote.note)}
                                        onMouseLeave={(e) => handleTouchEnd(e, nextNote.note)}
                                        onTouchStart={(e) => handleTouchStart(e, nextNote.note, nextNote.freq)}
                                        onTouchEnd={(e) => handleTouchEnd(e, nextNote.note)}
                                        className={`
                                            absolute top-0 -right-3 md:-right-5 w-6 md:w-10 h-[60%] z-20 rounded-b-lg border-x border-b border-gray-800
                                            ${activeKeys.has(nextNote.note) ? 'bg-gray-700' : 'bg-black'}
                                            ${mode === 'tutorial' && currentSong.notes[tutorialIndex] === nextNote.note ? 'animate-pulse bg-gray-600 ring-2 ring-yellow-400' : ''}
                                        `}
                                    >
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {mode === 'tutorial' && (
                <div className="mt-4 text-white text-xl font-bold animate-bounce bg-blue-600/50 px-6 py-2 rounded-full backdrop-blur">
                    Nốt tiếp theo: {currentSong.notes[tutorialIndex].replace(/\d/, '')}
                </div>
            )}
        </div>
    );
};

export default PianoGame;
