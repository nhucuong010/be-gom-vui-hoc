
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { HomeIcon, StarIcon, HeartIcon } from './icons';
import { playSound, playDynamicSentence, stopAllSounds } from '../services/audioService';
import { imagePrompts } from '../data/imagePrompts';
import { supermarketItems } from '../data/supermarketData';
import { scienceItems } from '../data/weatherGameData';
import { WRITING_WORDS, WRITING_DATA } from '../data/writingData';
import Confetti from './Confetti';

interface CatchGameProps {
    onGoHome: () => void;
    onCorrectAnswer: () => void;
    isSoundOn: boolean;
}

interface FallingItem {
    uid: number;
    id: string;
    type: 'target' | 'distractor' | 'bonus' | 'bad';
    name: string;
    imageUrl: string;
    x: number; // % left (0-100)
    y: number; // % top (0-100)
    speed: number;
    rotation: number;
    rotSpeed: number;
    scale: number;
    value?: string | number; // To verify answer
    // Control rotation behavior
    shouldSpin: boolean;
    baseRotation: number;
    isCaught?: boolean; // To prevent double catching
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    size: number;
}

interface FloatingText {
    id: number;
    x: number;
    y: number;
    text: string;
    life: number;
    color: string;
}

// Expanded Quest Interface
interface QuestData {
    type: 'find' | 'math' | 'spelling' | 'compare' | 'word_match';
    textDisplay: string;
    imageDisplay?: string;
    targetIdPrefix?: string;
    targetValue?: string | number;
    speakText?: string;
}

type GameMode = 'intro' | 'playing' | 'game_over';
type LevelTopic = 'numbers' | 'letters' | 'animals' | 'food' | 'nature' | 'mixed' | 'math' | 'spelling' | 'compare' | 'word_match' | 'family';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

const CatchGame: React.FC<CatchGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
    const [mode, setMode] = useState<GameMode>('intro');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(7);
    const [items, setItems] = useState<FallingItem[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

    // Quest State
    const [currentQuest, setCurrentQuest] = useState<QuestData | null>(null);
    const [levelTopic, setLevelTopic] = useState<LevelTopic>('numbers');

    const [playerX, setPlayerX] = useState(50);
    const [playerDirection, setPlayerDirection] = useState<'left' | 'right' | 'idle'>('idle');
    const lastPlayerX = useRef(50);

    // Tilt Control State
    const [isTiltEnabled, setIsTiltEnabled] = useState(false);
    const tiltRef = useRef(0);

    // Game Loop Refs
    const requestRef = useRef<number>();
    const lastSpawnTime = useRef<number>(0);
    const uidCounter = useRef<number>(0);
    const scoreRef = useRef(0);
    const distractorCountRef = useRef(0); // Pity system counter
    const gameAreaRef = useRef<HTMLDivElement>(null);

    // --- DATA POOLS ---
    const pools = useMemo(() => {
        const numbers = imagePrompts
            .filter(p => p.game === 'writing' && p.filename.startsWith('img_num'))
            .map(p => ({ id: p.filename, name: p.word, imageUrl: `${ASSET_BASE_URL}/assets/images/chucai/${p.filename}`, value: parseInt(p.filename.split('_').pop() || '0') }));

        const mathSigns = imagePrompts
            .filter(p => p.game === 'writing' && p.filename.startsWith('math_'))
            .map(p => {
                let val = '';
                if (p.filename.includes('greater')) val = '>';
                else if (p.filename.includes('less')) val = '<';
                else if (p.filename.includes('equals')) val = '=';
                return { id: p.filename, name: p.word, imageUrl: `${ASSET_BASE_URL}/assets/images/chucai/${p.filename}`, value: val };
            })
            .filter(p => p.value !== '');

        const letters = imagePrompts
            .filter(p => p.game === 'writing' && p.filename.startsWith('img_char'))
            .map(p => {
                const writingChar = WRITING_DATA.find(c => `img_${c.id.toLowerCase()}.png` === p.filename.toLowerCase());
                const rawVal = p.filename.replace('img_char_', '').replace('.png', '').toUpperCase();
                return {
                    id: p.filename,
                    name: p.word,
                    imageUrl: `${ASSET_BASE_URL}/assets/images/chucai/${p.filename}`,
                    value: writingChar ? writingChar.char : rawVal
                };
            });

        const animals = scienceItems.filter(i => i.category === 'animal');
        const nature = scienceItems.filter(i => ['weather', 'plant', 'water_physics', 'geography'].includes(i.category));
        const food = supermarketItems;

        const spellingVocab = imagePrompts
            .filter(p => p.game === 'common' || p.game === 'weather_explorer' || p.game === 'writing')
            .filter(p => {
                const firstChar = p.word.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return letters.some(l => l.value === firstChar);
            })
            .map(p => ({
                word: p.word,
                firstChar: p.word.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                image: p.game === 'writing' ? `${ASSET_BASE_URL}/assets/images/chucai/${p.filename}` :
                    p.game === 'weather_explorer' ? `${ASSET_BASE_URL}/assets/images/khampha/${p.filename}` :
                        `${ASSET_BASE_URL}/assets/images/${p.filename}`
            }));

        return { numbers, mathSigns, letters, animals, food, nature, spellingVocab };
    }, []);

    const STAR_IMAGE = `${ASSET_BASE_URL}/assets/images/khampha/we_star.png`;
    const RAIN_IMAGE = `${ASSET_BASE_URL}/assets/images/khampha/we_cloud_rain.png`;

    useEffect(() => {
        if (mode === 'intro') {
            playDynamicSentence("Chào mừng bé đến với trò chơi Hứng Chữ Số! Bé hãy chọn chủ đề nhé.", 'vi', isSoundOn);
        }
    }, [mode, isSoundOn]);

    // --- TILT SENSOR LOGIC ---
    const requestTiltPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setIsTiltEnabled(true);
                    playDynamicSentence("Đã bật chế độ nghiêng máy. Hãy nghiêng iPad để di chuyển!", 'vi', isSoundOn);
                } else {
                    alert('Bạn cần cấp quyền để sử dụng tính năng nghiêng máy.');
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            setIsTiltEnabled(true);
            playDynamicSentence("Đã bật chế độ nghiêng máy.", 'vi', isSoundOn);
        }
    };

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma !== null) {
                tiltRef.current = event.gamma;
            }
        };
        if (isTiltEnabled) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [isTiltEnabled]);

    // --- QUEST LOGIC ---
    const generateNewQuest = useCallback((): QuestData => {
        if (levelTopic === 'math') {
            const num1 = Math.floor(Math.random() * 5);
            const num2 = Math.floor(Math.random() * 5);
            const sum = num1 + num2;
            return {
                type: 'math',
                textDisplay: `${num1} + ${num2} = ?`,
                targetValue: sum,
                speakText: `${num1} cộng ${num2} bằng mấy?`
            };
        } else if (levelTopic === 'compare') {
            const num1 = Math.floor(Math.random() * 9) + 1;
            let num2 = Math.floor(Math.random() * 9) + 1;
            while (num2 === num1) num2 = Math.floor(Math.random() * 9) + 1;

            let sign = '=';
            let speakSign = 'bằng';
            if (num1 > num2) { sign = '>'; speakSign = 'lớn hơn'; }
            if (num1 < num2) { sign = '<'; speakSign = 'bé hơn'; }

            return {
                type: 'compare',
                textDisplay: `${num1} ... ${num2}`,
                targetValue: sign,
                speakText: `${num1} như thế nào so với ${num2}?`
            };
        } else if (levelTopic === 'spelling') {
            const wordObj = pools.spellingVocab[Math.floor(Math.random() * pools.spellingVocab.length)];
            return {
                type: 'spelling',
                textDisplay: `${wordObj.word}`,
                imageDisplay: wordObj.image,
                targetValue: wordObj.firstChar,
                speakText: `${wordObj.word} bắt đầu bằng chữ gì?`
            };
        } else if (levelTopic === 'word_match' || levelTopic === 'family') {
            let categories = WRITING_WORDS;
            if (levelTopic === 'family') {
                categories = WRITING_WORDS.filter(c => c.category === "Gia Đình" || c.category === "Tên Của Bé");
            }

            const randomCat = categories[Math.floor(Math.random() * categories.length)];
            const randomWord = randomCat.words[Math.floor(Math.random() * randomCat.words.length)];

            const charIndexToHide = Math.floor(Math.random() * randomWord.charIds.length);
            const hiddenCharId = randomWord.charIds[charIndexToHide];
            const hiddenCharData = WRITING_DATA.find(c => c.id === hiddenCharId);

            if (!hiddenCharData) return generateNewQuest();

            const displayText = randomWord.charIds.map((id, idx) => {
                if (idx === charIndexToHide) return "_";
                const c = WRITING_DATA.find(wd => wd.id === id);
                return c ? c.char : "?";
            }).join(" ");

            return {
                type: 'word_match',
                textDisplay: displayText,
                imageDisplay: randomWord.image,
                targetValue: hiddenCharData.char,
                speakText: `Điền chữ còn thiếu cho từ ${randomWord.label}`
            };

        } else {
            let pool: any[] = [];
            if (levelTopic === 'numbers') pool = pools.numbers;
            else if (levelTopic === 'letters') pool = pools.letters;
            else if (levelTopic === 'animals') pool = pools.animals;
            else if (levelTopic === 'food') pool = pools.food;
            else if (levelTopic === 'nature') pool = pools.nature;
            else pool = [...pools.numbers, ...pools.letters, ...pools.animals, ...pools.food, ...pools.nature];

            const item = pool[Math.floor(Math.random() * pool.length)];
            return {
                type: 'find',
                textDisplay: item.name,
                imageDisplay: item.imageUrl,
                targetIdPrefix: item.id,
                speakText: levelTopic === 'mixed' ? 'Hứng tự do!' : item.name
            };
        }
    }, [levelTopic, pools]);

    const startGame = (topic: LevelTopic) => {
        playSound('click', isSoundOn);
        setLevelTopic(topic);
        setMode('playing');
        setScore(0);
        scoreRef.current = 0;
        setLives(7);
        setItems([]);
        setParticles([]);
        setFloatingTexts([]);
        setPlayerX(50);
        lastPlayerX.current = 50;
        setCurrentQuest(null);
        distractorCountRef.current = 0;
    };

    useEffect(() => {
        if (mode === 'playing' && !currentQuest) {
            const quest = generateNewQuest();
            setCurrentQuest(quest);
            distractorCountRef.current = 0;
            if (quest.speakText && levelTopic !== 'mixed') {
                playDynamicSentence(quest.speakText, 'vi', isSoundOn);
            }
        }
    }, [mode, levelTopic, generateNewQuest, isSoundOn, currentQuest]);

    useEffect(() => {
        if (mode === 'playing' && currentQuest && levelTopic !== 'mixed') {
            const timer = setTimeout(() => {
                if (currentQuest.speakText) playDynamicSentence(currentQuest.speakText, 'vi', isSoundOn);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentQuest, mode, isSoundOn, levelTopic]);

    const spawnParticle = (x: number, y: number, color: string) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 8; i++) {
            newParticles.push({
                id: Math.random(),
                x, y,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                color,
                life: 1.0,
                size: Math.random() * 10 + 5
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    };

    const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
        setFloatingTexts(prev => [...prev, {
            id: Math.random(),
            x, y,
            text,
            life: 1.0,
            color
        }]);
    };

    // --- Logic: Process Item Catch/Click ---
    const processCatch = useCallback((item: FallingItem) => {
        if (item.isCaught) return false;
        item.isCaught = true; // Mark as caught immediately to prevent double processing

        let isGood = false;
        let points = 0;
        let color = '#fff';
        let feedbackText = '';

        if (item.type === 'bonus') {
            isGood = true; points = 5; color = '#FFD700';
            setLives(l => Math.min(7, l + 1));
            playDynamicSentence('Ngôi sao may mắn!', 'vi', isSoundOn);
        } else if (item.type === 'bad') {
            isGood = false;
        } else if (item.type === 'target') {
            isGood = true; points = 1; color = '#4ADE80';
        } else {
            isGood = false;
            feedbackText = 'Sai rồi!';
        }

        if (isGood) {
            playSound('correct', isSoundOn);
            scoreRef.current += points;
            setScore(s => s + points);
            onCorrectAnswer();
            spawnParticle(item.x, item.y, color);
            spawnFloatingText(item.x, item.y - 10, `+${points}`, color);

            if (item.type === 'target' && levelTopic !== 'mixed') {
                setTimeout(() => {
                    const newQuest = generateNewQuest();
                    setCurrentQuest(newQuest);
                    distractorCountRef.current = 0; // Reset on success
                }, 200);
            }

            return true;
        } else {
            playSound('incorrect', isSoundOn);
            setLives(l => l - 1);
            spawnFloatingText(item.x, item.y - 10, feedbackText || 'Ôi không!', '#EF4444');
            spawnParticle(item.x, item.y, '#EF4444');
            return true;
        }
    }, [isSoundOn, onCorrectAnswer, levelTopic, generateNewQuest]);

    // --- Handler: Click Item ---
    const handleItemClick = (e: React.PointerEvent, itemUid: number) => {
        e.stopPropagation();
        e.preventDefault();

        setItems(prevItems => {
            const itemIndex = prevItems.findIndex(i => i.uid === itemUid);
            if (itemIndex === -1) return prevItems;

            const item = prevItems[itemIndex];
            // Clone item to avoid mutating state directly before update
            const processedItem = { ...item };
            const wasProcessed = processCatch(processedItem);

            if (wasProcessed) {
                return prevItems.filter(i => i.uid !== itemUid);
            }
            return prevItems;
        });
    };

    // --- Game Loop ---
    const updateGame = useCallback((time: number) => {
        if (mode !== 'playing') return;

        // --- TILT PROCESSING ---
        if (isTiltEnabled) {
            const tilt = tiltRef.current;
            if (Math.abs(tilt) > 2) {
                const moveAmount = tilt * 0.5;
                setPlayerX(prev => {
                    const nextX = prev + moveAmount;
                    return Math.max(8, Math.min(92, nextX));
                });
            }
        }

        const difficultyMultiplier = Math.min(2, 1 + scoreRef.current / 30);
        const spawnRate = Math.max(1000, 2500 / difficultyMultiplier);

        if (time - lastSpawnTime.current > spawnRate) {
            const rand = Math.random();
            let spawnType: 'target' | 'distractor' | 'bonus' | 'bad' = 'distractor';
            let template: any | undefined;

            let spawnPool: any[] = [];
            if (levelTopic === 'math' || levelTopic === 'numbers') spawnPool = pools.numbers;
            else if (levelTopic === 'spelling' || levelTopic === 'letters' || levelTopic === 'word_match' || levelTopic === 'family') spawnPool = pools.letters;
            else if (levelTopic === 'compare') spawnPool = pools.mathSigns;
            else if (levelTopic === 'mixed') spawnPool = [...pools.numbers, ...pools.letters, ...pools.animals];
            else spawnPool = pools.numbers;

            if (levelTopic === 'mixed') {
                if (rand < 0.05) spawnType = 'bonus';
                else if (rand < 0.15) spawnType = 'bad';
                else spawnType = 'target';
                template = spawnPool[Math.floor(Math.random() * spawnPool.length)];
            } else {
                // Pity System: Force target if 2 distractors have passed
                const forceTarget = distractorCountRef.current >= 2;

                // Increased probability of target spawning (60%)
                if ((rand < 0.60 || forceTarget) && currentQuest) {
                    spawnType = 'target';
                    distractorCountRef.current = 0; // Reset pity counter

                    if (currentQuest.type === 'math') {
                        template = pools.numbers.find(n => n.value === currentQuest.targetValue);
                    } else if (currentQuest.type === 'compare') {
                        template = pools.mathSigns.find(s => s.value === currentQuest.targetValue);
                    } else if (currentQuest.type === 'spelling' || currentQuest.type === 'word_match') {
                        template = pools.letters.find(l => l.value === currentQuest.targetValue);
                    } else {
                        const allItems = [...pools.numbers, ...pools.letters, ...pools.animals, ...pools.food, ...pools.nature];
                        template = allItems.find(i => i.id === currentQuest.targetIdPrefix);
                    }
                    if (!template) spawnType = 'distractor'; // Fallback
                } else if (rand < 0.90) {
                    spawnType = 'distractor';
                    distractorCountRef.current += 1; // Increment pity counter

                    let candidates = spawnPool;
                    if (currentQuest?.targetValue) {
                        candidates = spawnPool.filter(i => i.value !== currentQuest.targetValue);
                    }
                    if (currentQuest?.targetIdPrefix) {
                        candidates = candidates.filter(i => i.id !== currentQuest.targetIdPrefix);
                    }

                    if (candidates.length > 0) {
                        template = candidates[Math.floor(Math.random() * candidates.length)];
                    } else {
                        template = spawnPool[0];
                    }
                } else if (rand < 0.95) {
                    spawnType = 'bonus';
                } else {
                    spawnType = 'bad';
                }
            }

            let newItem: FallingItem;
            // Slower falling speed modifier
            const isThinkingGame = levelTopic === 'math' || levelTopic === 'compare' || levelTopic === 'word_match' || levelTopic === 'family';
            const speedModifier = isThinkingGame ? 0.4 : 0.8;

            if (spawnType === 'bonus') {
                newItem = {
                    uid: uidCounter.current++, id: 'star', type: 'bonus', name: 'Ngôi Sao', imageUrl: STAR_IMAGE,
                    x: Math.random() * 80 + 10, y: -15, speed: 0.3 * difficultyMultiplier, rotation: 0, rotSpeed: 2, scale: 1.2,
                    shouldSpin: true, baseRotation: 0
                };
            } else if (spawnType === 'bad') {
                newItem = {
                    uid: uidCounter.current++, id: 'cloud', type: 'bad', name: 'Mây Mưa', imageUrl: RAIN_IMAGE,
                    x: Math.random() * 80 + 10, y: -15, speed: 0.25 * difficultyMultiplier, rotation: 0, rotSpeed: 0, scale: 1.1,
                    shouldSpin: true, baseRotation: 0
                };
            } else {
                if (!template && spawnPool.length > 0) template = spawnPool[Math.floor(Math.random() * spawnPool.length)];

                if (template) {
                    const isSymbol = template.id.startsWith('img_num') || template.id.startsWith('img_char') || template.id.startsWith('math_');

                    newItem = {
                        uid: uidCounter.current++,
                        id: template.id,
                        type: spawnType,
                        name: template.name,
                        imageUrl: template.imageUrl,
                        value: template.value,
                        x: Math.random() * 80 + 10,
                        y: -15,
                        speed: ((Math.random() * 0.15 + 0.25) * difficultyMultiplier) * speedModifier,
                        rotation: 0,
                        rotSpeed: isThinkingGame ? (Math.random() - 0.5) * 1 : (Math.random() - 0.5) * 3,
                        scale: 1,
                        shouldSpin: !isSymbol,
                        baseRotation: (Math.random() - 0.5) * 10
                    };
                } else { return; }
            }

            // @ts-ignore
            setItems(prev => [...prev, newItem]);
            lastSpawnTime.current = time;
        }

        setItems(prevItems => {
            const nextItems: FallingItem[] = [];

            prevItems.forEach(item => {
                item.y += item.speed;

                if (item.shouldSpin) {
                    item.rotation += item.rotSpeed;
                } else {
                    item.rotation = item.baseRotation + Math.sin(time * 0.005) * 15;
                }

                // Hitbox Logic (Player Catch)
                const playerTop = 75;
                const playerBottom = 85;
                const playerLeft = playerX - 10;
                const playerRight = playerX + 10;
                const itemBottom = item.y + 8;
                const itemLeft = item.x - 4;
                const itemRight = item.x + 4;

                const isColliding =
                    itemBottom >= playerTop &&
                    itemBottom <= playerBottom &&
                    itemRight >= playerLeft &&
                    itemLeft <= playerRight;

                if (isColliding) {
                    const processedItem = { ...item };
                    const wasProcessed = processCatch(processedItem);
                    if (wasProcessed) return;
                }

                if (item.y > 105) return;
                nextItems.push(item);
            });

            return nextItems;
        });

        setParticles(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02 })).filter(p => p.life > 0));
        setFloatingTexts(prev => prev.map(t => ({ ...t, y: t.y - 0.2, life: t.life - 0.02 })).filter(t => t.life > 0));

        requestRef.current = requestAnimationFrame(updateGame);
    }, [mode, levelTopic, playerX, onCorrectAnswer, isSoundOn, pools, currentQuest, generateNewQuest, isTiltEnabled, processCatch]);

    useEffect(() => {
        if (mode === 'playing') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [mode, updateGame]);

    useEffect(() => {
        if (lives <= 0 && mode === 'playing') {
            setMode('game_over');
            playSound('incorrect', isSoundOn);
            stopAllSounds();
            playDynamicSentence("Ôi không! Hết lượt chơi rồi. Bé cố gắng lần sau nhé!", 'vi', isSoundOn);
        }
    }, [lives, mode, isSoundOn]);

    const handleInput = (clientX: number) => {
        const screenWidth = window.innerWidth;
        const x = (clientX / screenWidth) * 100;
        const clampedX = Math.min(92, Math.max(8, x));
        if (clampedX > lastPlayerX.current + 0.5) setPlayerDirection('right');
        else if (clampedX < lastPlayerX.current - 0.5) setPlayerDirection('left');
        else setPlayerDirection('idle');
        lastPlayerX.current = clampedX;
        setPlayerX(clampedX);
    };

    const handlePointerMove = (e: React.PointerEvent) => { if (mode !== 'playing') return; handleInput(e.clientX); };
    const handleTouchMove = (e: React.TouchEvent) => { if (mode !== 'playing') return; handleInput(e.touches[0].clientX); };
    const handleTouchEnd = () => setPlayerDirection('idle');

    const MenuButton: React.FC<{ label: string, subLabel: string, icon: string, color: string, onClick: () => void }> = ({ label, subLabel, icon, color, onClick }) => (
        <button
            onClick={onClick}
            className={`group relative w-full p-4 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-4 border-white/50 overflow-hidden ${color}`}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner flex-shrink-0">
                <img src={icon} className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col items-start text-white">
                <span className="text-2xl font-black drop-shadow-md">{label}</span>
                <span className="text-sm font-medium opacity-90">{subLabel}</span>
            </div>
        </button>
    );

    return (
        <div
            className="relative w-full h-full z-0 bg-gradient-to-b from-sky-300 via-sky-200 to-indigo-200 overflow-hidden touch-none select-none font-sans"
            onPointerMove={handlePointerMove}
            onPointerLeave={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={gameAreaRef}
        >
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-60 animate-slide-slow"></div>
                <div className="absolute top-32 left-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-40 animate-slide-slower"></div>
            </div>
            <div className="absolute bottom-0 w-full h-[12%] bg-[#4ade80] border-t-8 border-[#22c55e] shadow-inner">
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-30"></div>
            </div>

            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50 pointer-events-none">
                <button onClick={() => { stopAllSounds(); onGoHome(); }} className="pointer-events-auto bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-sky-100">
                    <HomeIcon className="w-8 h-8 text-sky-600" />
                </button>
                <div className="flex gap-3">
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border-2 border-red-200 shadow-lg">
                        <HeartIcon className="w-6 h-6 text-red-500 mr-2 animate-pulse" />
                        <span className="text-2xl font-black text-red-600">{lives}</span>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border-2 border-yellow-200 shadow-lg">
                        <StarIcon className="w-8 h-8 text-yellow-500 mr-2" />
                        <span className="text-3xl font-black text-orange-500">{score}</span>
                    </div>
                </div>
            </div>

            {/* --- QUEST HUD --- */}
            {mode === 'playing' && currentQuest && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl border-4 border-pink-300 flex flex-col md:flex-row items-center gap-4 animate-pop-in max-w-[95%] pointer-events-none">
                    <div className="flex items-center gap-2">
                        <span className="text-purple-800 font-bold uppercase text-xs md:text-sm">Nhiệm vụ:</span>
                        {currentQuest.imageDisplay && (
                            <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-inner">
                                <img src={currentQuest.imageDisplay} alt="hint" className="w-10 h-10 object-contain" />
                            </div>
                        )}
                    </div>
                    <span className="text-3xl md:text-4xl font-black text-pink-600 whitespace-nowrap drop-shadow-sm">{currentQuest.textDisplay}</span>
                </div>
            )}

            {/* --- GAMEPLAY AREA --- */}
            {particles.map(p => (
                <div key={p.id} className="absolute rounded-full pointer-events-none" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, backgroundColor: p.color, opacity: p.life, transform: 'translate(-50%, -50%)' }} />
            ))}
            {floatingTexts.map(t => (
                <div key={t.id} className="absolute font-black text-3xl pointer-events-none drop-shadow-md whitespace-nowrap" style={{ left: `${t.x}%`, top: `${t.y}%`, color: t.color, opacity: t.life, transform: 'translate(-50%, -50%) scale(' + (1 + (1 - t.life)) + ')', textShadow: '0px 2px 0px rgba(0,0,0,0.5), -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}>{t.text}</div>
            ))}

            {/* Items with Click Handler */}
            {items.map(item => (
                <div
                    key={item.uid}
                    className="absolute w-24 h-24 sm:w-32 sm:h-32 will-change-transform cursor-pointer z-20"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translateX(-50%) rotate(${item.rotation}deg) scale(${item.scale})`
                    }}
                    onPointerDown={(e) => handleItemClick(e, item.uid)}
                >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] filter contrast-125" />
                </div>
            ))}

            {/* Player */}
            <div className="absolute bottom-[8%] w-32 h-32 sm:w-40 sm:h-40 transition-transform duration-75 ease-linear z-10 pointer-events-none will-change-transform" style={{ left: `${playerX}%`, transform: `translateX(-50%) ${playerDirection === 'left' ? 'rotate(-10deg)' : playerDirection === 'right' ? 'rotate(10deg)' : 'rotate(0deg)'}` }}>
                <div className="relative w-full h-full">
                    <img src={`${ASSET_BASE_URL}/assets/images/gom-sac.png`} alt="Gốm" className="w-full h-full object-contain drop-shadow-2xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-12 bg-amber-700 rounded-b-full border-4 border-amber-900 shadow-inner flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]"></div>
                    </div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[115%] h-4 bg-amber-800 rounded-full"></div>
                </div>
            </div>

            {/* --- INTRO SCREEN --- */}
            {mode === 'intro' && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-2xl max-w-3xl w-full text-center border-8 border-sky-400 animate-pop-in relative my-auto">
                        <div className="mb-2 flex justify-center">
                            <img src={`${ASSET_BASE_URL}/assets/images/gom-sac.png`} className="w-24 h-24 md:w-32 md:h-32 object-contain animate-bounce" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-purple-600 mb-2">Hứng Đồ Vật</h2>
                        <p className="text-base md:text-lg text-gray-700 mb-6 font-bold">Chọn chủ đề bé thích nhé!</p>

                        {/* Tilt Control Button */}
                        {!isTiltEnabled && (
                            <button
                                onClick={requestTiltPermission}
                                className="mb-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg flex items-center justify-center gap-2 mx-auto animate-pulse"
                            >
                                <span>📱</span> Bật chế độ nghiêng máy (iPad)
                            </button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <MenuButton label="Gia Đình" subLabel="Ghép tên Ba, Mẹ..." icon={`${ASSET_BASE_URL}/assets/images/ba-cuong.png`} color="bg-pink-500 hover:bg-pink-600" onClick={() => startGame('family')} />
                            <MenuButton label="Toán Học" subLabel="Cộng: 1 + 2 = 3" icon={`${ASSET_BASE_URL}/assets/images/writing/math_plus.png`} color="bg-blue-500 hover:bg-blue-600" onClick={() => startGame('math')} />
                            <MenuButton label="So Sánh" subLabel="Lớn, Bé, Bằng" icon={`${ASSET_BASE_URL}/assets/images/chucai/math_greater.png`} color="bg-cyan-500 hover:bg-cyan-600" onClick={() => startGame('compare')} />
                            <MenuButton label="Ghép Từ" subLabel="Điền chữ thiếu: C _ M" icon={`${ASSET_BASE_URL}/assets/images/chucai/img_char_o.png`} color="bg-purple-500 hover:bg-purple-600" onClick={() => startGame('word_match')} />
                            <MenuButton label="Chữ Cái Đầu" subLabel="Cá -> C" icon={`${ASSET_BASE_URL}/assets/images/chucai/img_char_a.png`} color="bg-red-500 hover:bg-red-600" onClick={() => startGame('spelling')} />
                            <MenuButton label="Số Đếm" subLabel="Tìm các con số" icon={`${ASSET_BASE_URL}/assets/images/chucai/img_num_5.png`} color="bg-orange-500 hover:bg-orange-600" onClick={() => startGame('numbers')} />
                            <MenuButton label="Động Vật" subLabel="Tìm các bạn thú" icon={`${ASSET_BASE_URL}/assets/images/khampha/we_bee.png`} color="bg-yellow-500 hover:bg-yellow-600" onClick={() => startGame('animals')} />
                            <MenuButton label="Thiên Nhiên" subLabel="Mây, mưa, cây cối" icon={`${ASSET_BASE_URL}/assets/images/khampha/we_sun.png`} color="bg-teal-500 hover:bg-teal-600" onClick={() => startGame('nature')} />
                            <MenuButton label="Tổng Hợp" subLabel="Chơi vui vẻ!" icon={STAR_IMAGE} color="bg-green-500 hover:bg-green-600" onClick={() => startGame('mixed')} />
                        </div>
                    </div>
                </div>
            )}

            {/* --- GAME OVER SCREEN --- */}
            {mode === 'game_over' && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md p-4">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center animate-pop-in border-8 border-red-300 max-w-md w-full">
                        <Confetti />
                        <h2 className="text-5xl font-black text-red-500 mb-4">Kết Thúc!</h2>
                        <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 mb-8">
                            <p className="text-gray-500 text-lg font-bold uppercase mb-1">Điểm số của bé</p>
                            <p className="text-6xl font-black text-orange-500">{score}</p>
                        </div>
                        <button onClick={() => setMode('intro')} className="w-full bg-sky-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg hover:bg-sky-600 transition-transform transform hover:scale-105">
                            Chơi Lại
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
                .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes slide-slow { from { background-position: 0 0; } to { background-position: 100% 0; } }
                .animate-slide-slow { animation: slide-slow 60s linear infinite; }
                .animate-slide-slower { animation: slide-slow 120s linear infinite; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
            `}</style>
        </div>
    );
};

export default CatchGame;
