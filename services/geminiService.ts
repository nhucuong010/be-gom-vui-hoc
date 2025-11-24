import { GoogleGenAI, Type } from "@google/genai";
import type { MathProblem, SpellingWord, FillInTheBlankProblem, FeedingProblem, SpellingRobotProblem, BakeryProblem, PrincessCodeProblem, RestaurantProblem, RestaurantOrder, RestaurantCustomer } from '../types';
import { imagePrompts } from '../data/imagePrompts';
import { generateImageFromText } from './imageService';
import { memoryGamePool } from '../data/memoryGameData';
import type { MemoryPairWithImages } from '../data/memoryGameData';
// NEW: Import the static problem banks
import { feedingProblemsBank, bakeryProblemsBank } from '../data/mathProblems';
import { princessCodeProblemsBank } from '../data/princessCodeData';
import { restaurantCustomers, restaurantMenuItems, restaurantOrdersBank } from '../data/restaurantData';


const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';


export const spellingWordsByLevel = {
  1: [ // Từ đơn giản 3 chữ cái, có chủ đề
    // Gia đình & người thân
    { word: 'BA CƯƠNG', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png` },
    { word: 'MẸ HƯƠNG', imageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png` },
    { word: 'GỐM', imageUrl: `${ASSET_BASE_URL}/assets/images/gom-sac.png` },
    { word: 'GẠO', imageUrl: `${ASSET_BASE_URL}/assets/images/gao-nang.png` },
    { word: 'BÀ THƠM', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png` },
    { word: 'ÔNG KHOA', imageUrl: `${ASSET_BASE_URL}/assets/images/ong-khoa.png` },
    { word: 'BÉ', imageUrl: `${ASSET_BASE_URL}/assets/images/be-sac.png` },
    // Động vật
    { word: 'CHÓ', imageUrl: `${ASSET_BASE_URL}/assets/images/cho-sac.png` },
    { word: 'MÈO', imageUrl: `${ASSET_BASE_URL}/assets/images/meo-huyen.png` },
    { word: 'CÁ', imageUrl: `${ASSET_BASE_URL}/assets/images/ca-sac.png` },
    { word: 'BÒ', imageUrl: `${ASSET_BASE_URL}/assets/images/bo-huyen.png` },
    { word: 'GÀ', imageUrl: `${ASSET_BASE_URL}/assets/images/ga-huyen.png` },
    { word: 'CUA', imageUrl: `${ASSET_BASE_URL}/assets/images/cua-ngang.png` },
    { word: 'TÔM', imageUrl: `${ASSET_BASE_URL}/assets/images/tom-ngang.png` },
    { word: 'VỊT', imageUrl: `${ASSET_BASE_URL}/assets/images/vit-nang.png` },
    // Đồ vật & Thức ăn
    { word: 'NHÀ', imageUrl: `${ASSET_BASE_URL}/assets/images/nha-huyen.png` },
    { word: 'XE', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-ngang.png` },
    { word: 'KEM', imageUrl: `${ASSET_BASE_URL}/assets/images/kem-ngang.png` },
    { word: 'TÁO', imageUrl: `${ASSET_BASE_URL}/assets/images/tao-sac.png` },
    { word: 'BÓNG', imageUrl: `${ASSET_BASE_URL}/assets/images/bong-sac.png` },
    { word: 'HOA', imageUrl: `${ASSET_BASE_URL}/assets/images/hoa-ngang.png` },
    { word: 'NÓN', imageUrl: `${ASSET_BASE_URL}/assets/images/non-sac.png` },
    { word: 'SAO', imageUrl: `${ASSET_BASE_URL}/assets/images/sao-ngang.png` },
    { word: 'CƠM', imageUrl: `${ASSET_BASE_URL}/assets/images/com-ngang.png` },
    { word: 'CANH', imageUrl: `${ASSET_BASE_URL}/assets/images/canh-ngang.png` },
    { word: 'BÚT', imageUrl: `${ASSET_BASE_URL}/assets/images/but-sac.png` },
    { word: 'SÁCH', imageUrl: `${ASSET_BASE_URL}/assets/images/sach-sac.png` },
  ],
  2: [ // Từ có 4 chữ cái
    { word: 'BÀN', imageUrl: `${ASSET_BASE_URL}/assets/images/ban-huyen.png` },
    { word: 'GHẾ', imageUrl: `${ASSET_BASE_URL}/assets/images/ghe-sac.png` },
    { word: 'CỬA', imageUrl: `${ASSET_BASE_URL}/assets/images/cua-hoi.png` },
    { word: 'BÁNH', imageUrl: `${ASSET_BASE_URL}/assets/images/banh-sac.png` },
    { word: 'CÂY', imageUrl: `${ASSET_BASE_URL}/assets/images/cay-ngang.png` },
    { word: 'MÂY', imageUrl: `${ASSET_BASE_URL}/assets/images/may-ngang.png` },
    { word: 'MƯA', imageUrl: `${ASSET_BASE_URL}/assets/images/mua-ngang.png` },
    { word: 'QUẢ', imageUrl: `${ASSET_BASE_URL}/assets/images/qua-hoi.png` },
    { word: 'TRĂNG', imageUrl: `${ASSET_BASE_URL}/assets/images/trang-ngang.png` },
    { word: 'BẢNG', imageUrl: `${ASSET_BASE_URL}/assets/images/bang-hoi.png` },
    { word: 'PHẤN', imageUrl: `${ASSET_BASE_URL}/assets/images/phan-sac.png` },
    { word: 'VỞ', imageUrl: `${ASSET_BASE_URL}/assets/images/vo-hoi.png` },
    { word: 'THƯỚC', imageUrl: `${ASSET_BASE_URL}/assets/images/thuoc-sac.png` },
    { word: 'MŨ', imageUrl: `${ASSET_BASE_URL}/assets/images/mu-nga.png` },
    { word: 'ÁO', imageUrl: `${ASSET_BASE_URL}/assets/images/ao-sac.png` },
    { word: 'QUẦN', imageUrl: `${ASSET_BASE_URL}/assets/images/quan-huyen.png` },
  ],
  3: [ // Từ có 5 chữ cái & tên riêng
    { word: 'NHO', imageUrl: `${ASSET_BASE_URL}/assets/images/nho-ngang.png` },
    { word: 'DÂU', imageUrl: `${ASSET_BASE_URL}/assets/images/dau-ngang.png` },
    { word: 'CHUỐI', imageUrl: `${ASSET_BASE_URL}/assets/images/chuoi-sac.png` },
    { word: 'QUẠT', imageUrl: `${ASSET_BASE_URL}/assets/images/quat-nang.png` },
    { word: 'ĐÈN', imageUrl: `${ASSET_BASE_URL}/assets/images/den-huyen.png` },
    { word: 'TRỜI', imageUrl: `${ASSET_BASE_URL}/assets/images/troi-huyen.png` },
    { word: 'THUYỀN', imageUrl: `${ASSET_BASE_URL}/assets/images/thuyen-huyen.png` },
    { word: 'GƯƠM', imageUrl: `${ASSET_BASE_URL}/assets/images/guom-ngang.png` },
    { word: 'VIỆT', imageUrl: `${ASSET_BASE_URL}/assets/images/viet-nang.png` },
    { word: 'NAM', imageUrl: `${ASSET_BASE_URL}/assets/images/nam-ngang.png` },
    { word: 'GIÀY', imageUrl: `${ASSET_BASE_URL}/assets/images/giay-huyen.png` },
    { word: 'DÉP', imageUrl: `${ASSET_BASE_URL}/assets/images/dep-sac.png` },
    { word: 'NƯỚC', imageUrl: `${ASSET_BASE_URL}/assets/images/nuoc-sac.png` },
    { word: 'LỬA', imageUrl: `${ASSET_BASE_URL}/assets/images/lua-hoi.png` },
  ],
  4: [ // Từ ghép hoặc từ dài hơn
    { word: 'BÀ BÚP', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-bup.png` },
    { word: 'ANH XOÀI', imageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png` },
    { word: 'CHỊ NA', imageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png` },
    { word: 'EM GẤM', imageUrl: `${ASSET_BASE_URL}/assets/images/em-gam.png` },
    { word: 'XE ĐẠP', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-dap.png` },
    { word: 'MÁY BAY', imageUrl: `${ASSET_BASE_URL}/assets/images/may-bay.png` },
    { word: 'BỆNH VIỆN', imageUrl: `${ASSET_BASE_URL}/assets/images/benh-vien.png` },
    { word: 'CÔNG VIÊN', imageUrl: `${ASSET_BASE_URL}/assets/images/cong-vien.png` },
    { word: 'TRƯỜNG HỌC', imageUrl: `${ASSET_BASE_URL}/assets/images/truong-hoc.png` },
    { word: 'SIÊU THỊ', imageUrl: `${ASSET_BASE_URL}/assets/images/sieu-thi.png` },
    { word: 'HOA HỒNG', imageUrl: `${ASSET_BASE_URL}/assets/images/hoa-hong.png` },
    { word: 'MẶT TRỜI', imageUrl: `${ASSET_BASE_URL}/assets/images/mat-troi.png` },
    { word: 'XE CỨU HỎA', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-cuu-hoa.png` },
    { word: 'MÁY TÍNH', imageUrl: `${ASSET_BASE_URL}/assets/images/may-tinh.png` },
    { word: 'CÁI KÉO', imageUrl: `${ASSET_BASE_URL}/assets/images/cai-keo.png` },
    { word: 'BÔNG CẢI', imageUrl: `${ASSET_BASE_URL}/assets/images/bong-cai.png` },
    { word: 'XE MÁY', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-may.png` },
    { word: 'Ô TÔ', imageUrl: `${ASSET_BASE_URL}/assets/images/o-to.png` },
    { word: 'TÀU HỎA', imageUrl: `${ASSET_BASE_URL}/assets/images/tau-hoa.png` },
    { word: 'CON VOI', imageUrl: `${ASSET_BASE_URL}/assets/images/con-voi.png` },
    { word: 'CON HỔ', imageUrl: `${ASSET_BASE_URL}/assets/images/con-ho.png` },
    { word: 'QUẢ CAM', imageUrl: `${ASSET_BASE_URL}/assets/images/qua-cam.png` },
    { word: 'QUẢ DỨA', imageUrl: `${ASSET_BASE_URL}/assets/images/qua-dua.png` },
  ],
};


export const generateMathProblem = async (level: number, type?: 'addition' | 'subtraction' | 'comparison'): Promise<MathProblem> => {
    // Determine the type of problem to generate. If a type is provided, use it.
    // Otherwise, fall back to the original random logic.
    const effectiveType = type || (Math.random() < 0.3 && level > 1 ? 'comparison' : (level === 1 || Math.random() < 0.6 ? 'addition' : 'subtraction'));

    if (effectiveType === 'comparison') {
        let num1: number, num2: number, answer: string;
        const maxNum = Math.min(20, level * 2 + 5);
        num1 = Math.floor(Math.random() * maxNum) + 1;
        const variation = Math.floor(Math.random() * 5) - 2;
        num2 = num1 + variation;
        if (num2 < 1) num2 = 1;

        // Ensure numbers are not equal for a more interesting comparison, if possible
        if (num1 === num2 && maxNum > 1) {
             num2 = num1 + (Math.random() > 0.5 ? 1 : -1);
             if (num2 < 1) num2 = num1 + 1;
        }

        if (Math.random() > 0.5) {
            [num1, num2] = [num2, num1];
        }

        if (num1 < num2) answer = '<';
        else if (num1 > num2) answer = '>';
        else answer = '=';
        
        return Promise.resolve({ problem: `${num1} _ ${num2}`, answer, type: 'comparison' });
    } 
    
    // Handle Calculation problems (addition or subtraction)
    let num1: number, num2: number, answer: number, problemString: string;
    
    if (effectiveType === 'addition') {
        const maxResult = Math.min(20, 5 + level * 2);
        num1 = Math.floor(Math.random() * (maxResult - 1)) + 1;
        num2 = Math.floor(Math.random() * (maxResult - num1)) + 1;
        answer = num1 + num2;
        problemString = `${num1} + ${num2}`;
    } else { // Subtraction
        const maxNum = 5 + level * 2;
        num1 = Math.floor(Math.random() * maxNum) + 2;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        answer = num1 - num2;
        problemString = `${num1} - ${num2}`;
    }

    return Promise.resolve({ problem: problemString, answer, type: 'calculation' });
};


export const generateSpellingWord = async (level: number): Promise<SpellingWord> => {
    const effectiveLevel = Math.min(level, Object.keys(spellingWordsByLevel).length);
    const wordList = spellingWordsByLevel[effectiveLevel as keyof typeof spellingWordsByLevel];
    
    if (!wordList || wordList.length === 0) {
        // Fallback word in case something goes wrong
        return Promise.resolve({ word: 'MÈO', imageUrl: `${ASSET_BASE_URL}/assets/images/meo-huyen.png` });
    }

    const randomIndex = Math.floor(Math.random() * wordList.length);
    const wordDataTemplate = { ...wordList[randomIndex] };
    wordDataTemplate.word = wordDataTemplate.word.toUpperCase(); // Allow spaces

    // Return the static data directly, removing all dynamic generation and caching.
    // This improves performance and reliability as requested.
    return Promise.resolve(wordDataTemplate);
};


export const generateMemoryPairs = async (level: number, pairCount: number, maxNumber: number, operationType: 'add' | 'add-subtract'): Promise<MemoryPairWithImages[]> => {
    // Filter the pool based on the game settings
    const filteredPool = memoryGamePool.filter(pair => {
        const isOperationOk = operationType === 'add-subtract' || pair.operation === 'add';
        const isNumberOk = pair.answer <= maxNumber && pair.maxNumberInProblem <= maxNumber;
        return isOperationOk && isNumberOk;
    });

    // Shuffle and select the required number of pairs
    if (filteredPool.length < pairCount) {
        console.warn(`Not enough memory pairs in the pool for level config. Required: ${pairCount}, Available: ${filteredPool.length}. Using all available.`);
        return Promise.resolve(filteredPool.sort(() => 0.5 - Math.random()));
    }

    const shuffled = filteredPool.sort(() => 0.5 - Math.random());
    return Promise.resolve(shuffled.slice(0, pairCount));
};

// --- Fill in the Blank Game Service ---

export const fillInTheBlankWords = [
    // Tên gia đình
    { word: 'BA CƯƠNG', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png` },
    { word: 'MẸ HƯƠNG', imageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png` },
    { word: 'ÔNG KHOA', imageUrl: `${ASSET_BASE_URL}/assets/images/ong-khoa.png` },
    { word: 'BÀ THƠM', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-thom.png` },
    { word: 'BÀ BÚP', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-bup.png` },
    { word: 'ANH XOÀI', imageUrl: `${ASSET_BASE_URL}/assets/images/anh-xoai.png` },
    { word: 'CHỊ NA', imageUrl: `${ASSET_BASE_URL}/assets/images/chi-na.png` },
    { word: 'EM GẤM', imageUrl: `${ASSET_BASE_URL}/assets/images/em-gam.png` },
    // 2-3 letter words
    { word: 'MÈO', imageUrl: `${ASSET_BASE_URL}/assets/images/meo-huyen.png` },
    { word: 'CHÓ', imageUrl: `${ASSET_BASE_URL}/assets/images/cho-sac.png` },
    { word: 'BÚT', imageUrl: `${ASSET_BASE_URL}/assets/images/but-sac.png` },
    { word: 'NHÀ', imageUrl: `${ASSET_BASE_URL}/assets/images/nha-huyen.png` },
    { word: 'BÒ', imageUrl: `${ASSET_BASE_URL}/assets/images/bo-huyen.png` },
    { word: 'GÀ', imageUrl: `${ASSET_BASE_URL}/assets/images/ga-huyen.png` },
    { word: 'KEM', imageUrl: `${ASSET_BASE_URL}/assets/images/kem-ngang.png` },
    { word: 'CÁ', imageUrl: `${ASSET_BASE_URL}/assets/images/ca-sac.png` },
    { word: 'TÁO', imageUrl: `${ASSET_BASE_URL}/assets/images/tao-sac.png` },
    { word: 'HOA', imageUrl: `${ASSET_BASE_URL}/assets/images/hoa-ngang.png` },
    { word: 'CUA', imageUrl: `${ASSET_BASE_URL}/assets/images/cua-ngang.png` },
    { word: 'TÔM', imageUrl: `${ASSET_BASE_URL}/assets/images/tom-ngang.png` },
    { word: 'XE', imageUrl: `${ASSET_BASE_URL}/assets/images/xe-ngang.png` },
    { word: 'BÉ', imageUrl: `${ASSET_BASE_URL}/assets/images/be-sac.png` },
    { word: 'CƠM', imageUrl: `${ASSET_BASE_URL}/assets/images/com-ngang.png` },
    { word: 'CANH', imageUrl: `${ASSET_BASE_URL}/assets/images/canh-ngang.png` },
    // 4-letter words
    { word: 'BÀN', imageUrl: `${ASSET_BASE_URL}/assets/images/ban-huyen.png` },
    { word: 'GHẾ', imageUrl: `${ASSET_BASE_URL}/assets/images/ghe-sac.png` },
    { word: 'SÁCH', imageUrl: `${ASSET_BASE_URL}/assets/images/sach-sac.png` },
    { word: 'CÂY', imageUrl: `${ASSET_BASE_URL}/assets/images/cay-ngang.png` },
    { word: 'BÁNH', imageUrl: `${ASSET_BASE_URL}/assets/images/banh-sac.png` },
    { word: 'CỬA', imageUrl: `${ASSET_BASE_URL}/assets/images/cua-hoi.png` },
    { word: 'MÂY', imageUrl: `${ASSET_BASE_URL}/assets/images/may-ngang.png` },
    { word: 'MƯA', imageUrl: `${ASSET_BASE_URL}/assets/images/mua-ngang.png` },
    { word: 'BẢNG', imageUrl: `${ASSET_BASE_URL}/assets/images/bang-hoi.png` },
    { word: 'PHẤN', imageUrl: `${ASSET_BASE_URL}/assets/images/phan-sac.png` },
    { word: 'VỞ', imageUrl: `${ASSET_BASE_URL}/assets/images/vo-hoi.png` },
    { word: 'MŨ', imageUrl: `${ASSET_BASE_URL}/assets/images/mu-nga.png` },
    { word: 'ÁO', imageUrl: `${ASSET_BASE_URL}/assets/images/ao-sac.png` },
    // more words
    { word: 'NHO', imageUrl: `${ASSET_BASE_URL}/assets/images/nho-ngang.png` },
    { word: 'DÂU', imageUrl: `${ASSET_BASE_URL}/assets/images/dau-ngang.png` },
    { word: 'ĐÈN', imageUrl: `${ASSET_BASE_URL}/assets/images/den-huyen.png` },
    { word: 'QUẢ', imageUrl: `${ASSET_BASE_URL}/assets/images/qua-hoi.png` },
    { word: 'VỊT', imageUrl: `${ASSET_BASE_URL}/assets/images/vit-nang.png` },
    { word: 'NÓN', imageUrl: `${ASSET_BASE_URL}/assets/images/non-sac.png` },
    { word: 'TRĂNG', imageUrl: `${ASSET_BASE_URL}/assets/images/trang-ngang.png` },
    { word: 'SAO', imageUrl: `${ASSET_BASE_URL}/assets/images/sao-ngang.png` },
    { word: 'CHUỐI', imageUrl: `${ASSET_BASE_URL}/assets/images/chuoi-sac.png` },
    { word: 'QUẠT', imageUrl: `${ASSET_BASE_URL}/assets/images/quat-nang.png` },
    { word: 'TRỜI', imageUrl: `${ASSET_BASE_URL}/assets/images/troi-huyen.png` },
    { word: 'GIÀY', imageUrl: `${ASSET_BASE_URL}/assets/images/giay-huyen.png` },
    { word: 'DÉP', imageUrl: `${ASSET_BASE_URL}/assets/images/dep-sac.png` },
    { word: 'NƯỚC', imageUrl: `${ASSET_BASE_URL}/assets/images/nuoc-sac.png` },
    { word: 'LỬA', imageUrl: `${ASSET_BASE_URL}/assets/images/lua-hoi.png` },
];

export const generateFillInTheBlankProblem = async (level: number): Promise<FillInTheBlankProblem> => {
    const wordPool = level < 3 
        ? fillInTheBlankWords.filter(w => w.word.length <= 4) 
        : fillInTheBlankWords;
    
    const selectedWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    const word = selectedWord.word;

    // Bỏ qua khoảng trắng khi chọn ký tự để ẩn
    const wordWithoutSpaces = word.replace(/\s/g, '');
    const hiddenIndexInSpaceless = Math.floor(Math.random() * wordWithoutSpaces.length);
    const correctLetter = wordWithoutSpaces[hiddenIndexInSpaceless];

    // Tìm index thật trong từ gốc
    let hiddenIndex = -1;
    let spacelessCount = 0;
    for (let i = 0; i < word.length; i++) {
        if (word[i] !== ' ') {
            if (spacelessCount === hiddenIndexInSpaceless) {
                hiddenIndex = i;
                break;
            }
            spacelessCount++;
        }
    }
    
    const problemFormat = word.split('').map((char, i) => {
        if (i === hiddenIndex) return '_';
        if (char === ' ') return ' '; // Giữ lại khoảng trắng
        return char;
    }).join(' ');

    const allVowels = 'AĂÂEÊIOÔƠUƯY';
    const distractors = new Set<string>();
    while (distractors.size < 2) {
        const randomVowel = allVowels[Math.floor(Math.random() * allVowels.length)];
        if (randomVowel !== correctLetter && !word.includes(randomVowel)) {
            distractors.add(randomVowel);
        }
    }
    
    const options = Array.from(distractors);
    options.push(correctLetter);
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return Promise.resolve({
        word: word,
        problemFormat: problemFormat,
        hiddenIndex: hiddenIndex,
        correctLetter: correctLetter,
        options: shuffledOptions,
        imageUrl: selectedWord.imageUrl,
    });
};

// --- Feeding Game Service ---
// REFACTORED: This function now selects a pre-defined problem from the bank.
// It also accepts an 'operation' to filter by addition or subtraction.
export const generateFeedingProblem = async (level: number, operation: 'add' | 'subtract'): Promise<FeedingProblem> => {
    // Filter problems that are appropriate for the current level and selected operation.
    // For now, we'll just filter by operation.
    const relevantProblems = feedingProblemsBank.filter(p => p.operation === operation);
    if (relevantProblems.length === 0) {
        // Fallback to the full bank if no problems match, though this shouldn't happen with current data.
        console.warn(`No feeding problems found for operation: ${operation}. Using the full bank.`);
        const problem = feedingProblemsBank[Math.floor(Math.random() * feedingProblemsBank.length)];
        return Promise.resolve(problem);
    }
    const problem = relevantProblems[Math.floor(Math.random() * relevantProblems.length)];
    return Promise.resolve(problem);
};

// --- Spelling Robot Game Service ---
export const spellingRobotData: SpellingRobotProblem[] = [
    // --- Set 1: Basic ---
    { id: 'ca_sac', targetWord: 'CÁ', imageUrl: `${ASSET_BASE_URL}/assets/images/ca-sac.png`, syllable: { onset: 'C', rime: 'A', tone: 'sắc' }, choices: { onset: ['C', 'B', 'M'], rime: ['A', 'O', 'E'], tone: ['ngang', 'sắc', 'huyền'] } },
    { id: 'bo_huyen', targetWord: 'BÒ', imageUrl: `${ASSET_BASE_URL}/assets/images/bo-huyen.png`, syllable: { onset: 'B', rime: 'O', tone: 'huyền' }, choices: { onset: ['B', 'D', 'G'], rime: ['O', 'A', 'Ô'], tone: ['ngang', 'hỏi', 'huyền'] } },
    { id: 'me_nang', targetWord: 'MẸ', imageUrl: `${ASSET_BASE_URL}/assets/images/me-huong.png`, syllable: { onset: 'M', rime: 'E', tone: 'nặng' }, choices: { onset: ['M', 'N', 'H'], rime: ['E', 'Ê', 'A'], tone: ['ngang', 'sắc', 'nặng'] } },
    { id: 'ba_ngang', targetWord: 'BA', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png`, syllable: { onset: 'B', rime: 'A', tone: 'ngang' }, choices: { onset: ['B', 'D', 'C'], rime: ['A', 'O', 'I'], tone: ['ngang', 'huyền', 'sắc'] } },
    { id: 'ga_huyen', targetWord: 'GÀ', imageUrl: `${ASSET_BASE_URL}/assets/images/ga-huyen.png`, syllable: { onset: 'G', rime: 'A', tone: 'huyền' }, choices: { onset: ['G', 'C', 'B'], rime: ['A', 'Ă', 'Â'], tone: ['huyền', 'sắc', 'hỏi'] } },
    // --- Set 2: Compound Onsets ---
    { id: 'nha_huyen', targetWord: 'NHÀ', imageUrl: `${ASSET_BASE_URL}/assets/images/nha-huyen.png`, syllable: { onset: 'NH', rime: 'A', tone: 'huyền' }, choices: { onset: ['NH', 'N', 'M'], rime: ['A', 'O', 'E'], tone: ['huyền', 'ngang', 'sắc'] } },
    { id: 'cho_sac', targetWord: 'CHÓ', imageUrl: `${ASSET_BASE_URL}/assets/images/cho-sac.png`, syllable: { onset: 'CH', rime: 'O', tone: 'sắc' }, choices: { onset: ['CH', 'TR', 'C'], rime: ['O', 'Ô', 'A'], tone: ['sắc', 'hỏi', 'ngang'] } },
    { id: 'ghe_sac', targetWord: 'GHẾ', imageUrl: `${ASSET_BASE_URL}/assets/images/ghe-sac.png`, syllable: { onset: 'GH', rime: 'Ê', tone: 'sắc' }, choices: { onset: ['GH', 'G', 'C'], rime: ['Ê', 'E', 'A'], tone: ['sắc', 'ngã', 'huyền'] } },
    { id: 'trang_ngang', targetWord: 'TRĂNG', imageUrl: `${ASSET_BASE_URL}/assets/images/trang-ngang.png`, syllable: { onset: 'TR', rime: 'ĂNG', tone: 'ngang' }, choices: { onset: ['TR', 'CH', 'T'], rime: ['ĂNG', 'ANG', 'ÔNG'], tone: ['ngang', 'hỏi', 'nặng'] } },
    { id: 'qua_hoi', targetWord: 'QUẢ', imageUrl: `${ASSET_BASE_URL}/assets/images/qua-hoi.png`, syllable: { onset: 'QU', rime: 'A', tone: 'hỏi' }, choices: { onset: ['QU', 'Q', 'C'], rime: ['A', 'O', 'U'], tone: ['hỏi', 'sắc', 'ngã'] } },
    // --- Set 3: Compound Rimes ---
    { id: 'kem_ngang', targetWord: 'KEM', imageUrl: `${ASSET_BASE_URL}/assets/images/kem-ngang.png`, syllable: { onset: 'K', rime: 'EM', tone: 'ngang' }, choices: { onset: ['K', 'C', 'Q'], rime: ['EM', 'AM', 'ÊM'], tone: ['ngang', 'huyền', 'nặng'] } },
    { id: 'tao_sac', targetWord: 'TÁO', imageUrl: `${ASSET_BASE_URL}/assets/images/tao-sac.png`, syllable: { onset: 'T', rime: 'AO', tone: 'sắc' }, choices: { onset: ['T', 'S', 'L'], rime: ['AO', 'EO', 'OA'], tone: ['sắc', 'hỏi', 'nặng'] } },
    { id: 'but_sac', targetWord: 'BÚT', imageUrl: `${ASSET_BASE_URL}/assets/images/but-sac.png`, syllable: { onset: 'B', rime: 'UT', tone: 'sắc' }, choices: { onset: ['B', 'Đ', 'V'], rime: ['UT', 'UC', 'IT'], tone: ['sắc', 'nặng', 'ngang'] } },
    { id: 'sach_sac', targetWord: 'SÁCH', imageUrl: `${ASSET_BASE_URL}/assets/images/sach-sac.png`, syllable: { onset: 'S', rime: 'ACH', tone: 'sắc' }, choices: { onset: ['S', 'X', 'CH'], rime: ['ACH', 'ANH', 'ECH'], tone: ['sắc', 'hỏi', 'nặng'] } },
    { id: 'cay_ngang', targetWord: 'CÂY', imageUrl: `${ASSET_BASE_URL}/assets/images/cay-ngang.png`, syllable: { onset: 'C', rime: 'ÂY', tone: 'ngang' }, choices: { onset: ['C', 'K', 'L'], rime: ['ÂY', 'AY', 'EY'], tone: ['ngang', 'huyền', 'hỏi'] } },
    { id: 'hoa_ngang', targetWord: 'HOA', imageUrl: `${ASSET_BASE_URL}/assets/images/hoa-ngang.png`, syllable: { onset: 'H', rime: 'OA', tone: 'ngang' }, choices: { onset: ['H', 'L', 'M'], rime: ['OA', 'OE', 'O'], tone: ['ngang', 'nặng', 'sắc'] } },
    { id: 'cua_ngang', targetWord: 'CUA', imageUrl: `${ASSET_BASE_URL}/assets/images/cua-ngang.png`, syllable: { onset: 'C', rime: 'UA', tone: 'ngang' }, choices: { onset: ['C', 'T', 'CH'], rime: ['UA', 'ƯA', 'A'], tone: ['ngang', 'sắc', 'hỏi'] } },
    { id: 'vit_nang', targetWord: 'VỊT', imageUrl: `${ASSET_BASE_URL}/assets/images/vit-nang.png`, syllable: { onset: 'V', rime: 'IT', tone: 'nặng' }, choices: { onset: ['V', 'D', 'B'], rime: ['IT', 'UT', 'ET'], tone: ['nặng', 'sắc', 'huyền'] } },
    // --- Set 4: More Variety ---
    { id: 'nho_ngang', targetWord: 'NHO', imageUrl: `${ASSET_BASE_URL}/assets/images/nho-ngang.png`, syllable: { onset: 'NH', rime: 'O', tone: 'ngang' }, choices: { onset: ['NH', 'NG', 'N'], rime: ['O', 'A', 'U'], tone: ['ngang', 'huyền', 'sắc'] } },
    { id: 'ban_huyen', targetWord: 'BÀN', imageUrl: `${ASSET_BASE_URL}/assets/images/ban-huyen.png`, syllable: { onset: 'B', rime: 'AN', tone: 'huyền' }, choices: { onset: ['B', 'D', 'P'], rime: ['AN', 'ĂN', 'ON'], tone: ['huyền', 'ngang', 'sắc'] } },
    { id: 'sao_ngang', targetWord: 'SAO', imageUrl: `${ASSET_BASE_URL}/assets/images/sao-ngang.png`, syllable: { onset: 'S', rime: 'AO', tone: 'ngang' }, choices: { onset: ['S', 'X', 'CH'], rime: ['AO', 'AU', 'EO'], tone: ['ngang', 'sắc', 'hỏi'] } },
    { id: 'banh_sac', targetWord: 'BÁNH', imageUrl: `${ASSET_BASE_URL}/assets/images/banh-sac.png`, syllable: { onset: 'B', rime: 'ANH', tone: 'sắc' }, choices: { onset: ['B', 'P', 'V'], rime: ['ANH', 'ACH', 'INH'], tone: ['sắc', 'hỏi', 'nặng'] } },
    { id: 'cua_hoi', targetWord: 'CỬA', imageUrl: `${ASSET_BASE_URL}/assets/images/cua-hoi.png`, syllable: { onset: 'C', rime: 'ƯA', tone: 'hỏi' }, choices: { onset: ['C', 'K', 'QU'], rime: ['ƯA', 'UA', 'A'], tone: ['hỏi', 'ngang', 'nặng'] } },
    { id: 'dau_ngang', targetWord: 'DÂU', imageUrl: `${ASSET_BASE_URL}/assets/images/dau-ngang.png`, syllable: { onset: 'D', rime: 'ÂU', tone: 'ngang' }, choices: { onset: ['D', 'Đ', 'GI'], rime: ['ÂU', 'AU', 'ÊU'], tone: ['ngang', 'sắc', 'huyền'] } },
    { id: 'chuoi_sac', targetWord: 'CHUỐI', imageUrl: `${ASSET_BASE_URL}/assets/images/chuoi-sac.png`, syllable: { onset: 'CH', rime: 'UÔI', tone: 'sắc' }, choices: { onset: ['CH', 'TR', 'S'], rime: ['UÔI', 'UOI', 'ÔI'], tone: ['sắc', 'hỏi', 'ngang'] } },
    { id: 'quat_nang', targetWord: 'QUẠT', imageUrl: `${ASSET_BASE_URL}/assets/images/quat-nang.png`, syllable: { onset: 'QU', rime: 'AT', tone: 'nặng' }, choices: { onset: ['QU', 'C', 'K'], rime: ['AT', 'OAT', 'ET'], tone: ['nặng', 'sắc', 'huyền'] } },
    { id: 'den_huyen', targetWord: 'ĐÈN', imageUrl: `${ASSET_BASE_URL}/assets/images/den-huyen.png`, syllable: { onset: 'Đ', rime: 'EN', tone: 'huyền' }, choices: { onset: ['Đ', 'D', 'B'], rime: ['EN', 'ÊN', 'AN'], tone: ['huyền', 'ngang', 'sắc'] } },
    { id: 'mu_nga', targetWord: 'MŨ', imageUrl: `${ASSET_BASE_URL}/assets/images/mu-nga.png`, syllable: { onset: 'M', rime: 'U', tone: 'ngã' }, choices: { onset: ['M', 'N', 'L'], rime: ['U', 'Ư', 'Ô'], tone: ['ngã', 'hỏi', 'sắc'] } },
    { id: 'ao_sac', targetWord: 'ÁO', imageUrl: `${ASSET_BASE_URL}/assets/images/ao-sac.png`, syllable: { onset: '', rime: 'AO', tone: 'sắc' }, choices: { onset: ['', 'C', 'H'], rime: ['AO', 'EO', 'AU'], tone: ['sắc', 'huyền', 'ngang'] } },
    { id: 'quan_huyen', targetWord: 'QUẦN', imageUrl: `${ASSET_BASE_URL}/assets/images/quan-huyen.png`, syllable: { onset: 'QU', rime: 'ÂN', tone: 'huyền' }, choices: { onset: ['QU', 'C', 'GI'], rime: ['ÂN', 'AN', 'ÔN'], tone: ['huyền', 'nặng', 'ngang'] } },
    // --- Set 5: Advanced ---
    { id: 'thuyen_huyen', targetWord: 'THUYỀN', imageUrl: `${ASSET_BASE_URL}/assets/images/thuyen-huyen.png`, syllable: { onset: 'TH', rime: 'UYÊN', tone: 'huyền' }, choices: { onset: ['TH', 'T', 'CH'], rime: ['UYÊN', 'IÊN', 'UYEN'], tone: ['huyền', 'sắc', 'ngang'] } },
    { id: 'thuoc_sac', targetWord: 'THƯỚC', imageUrl: `${ASSET_BASE_URL}/assets/images/thuoc-sac.png`, syllable: { onset: 'TH', rime: 'ƯỚC', tone: 'sắc' }, choices: { onset: ['TH', 'TR', 'T'], rime: ['ƯỚC', 'UOC', 'ƯƠI'], tone: ['sắc', 'nặng', 'hỏi'] } },
    { id: 'phan_sac', targetWord: 'PHẤN', imageUrl: `${ASSET_BASE_URL}/assets/images/phan-sac.png`, syllable: { onset: 'PH', rime: 'ÂN', tone: 'sắc' }, choices: { onset: ['PH', 'F', 'V'], rime: ['ÂN', 'AN', 'ÂU'], tone: ['sắc', 'hỏi', 'ngã'] } },
    { id: 'nuoc_sac', targetWord: 'NƯỚC', imageUrl: `${ASSET_BASE_URL}/assets/images/nuoc-sac.png`, syllable: { onset: 'N', rime: 'ƯỚC', tone: 'sắc' }, choices: { onset: ['N', 'NG', 'NH'], rime: ['ƯỚC', 'UOC', 'ƯƠI'], tone: ['sắc', 'hỏi', 'nặng'] } },
    { id: 'lua_hoi', targetWord: 'LỬA', imageUrl: `${ASSET_BASE_URL}/assets/images/lua-hoi.png`, syllable: { onset: 'L', rime: 'ƯA', tone: 'hỏi' }, choices: { onset: ['L', 'N', 'D'], rime: ['ƯA', 'UA', 'A'], tone: ['hỏi', 'ngã', 'nặng'] } },
    { id: 'giay_huyen', targetWord: 'GIÀY', imageUrl: `${ASSET_BASE_URL}/assets/images/giay-huyen.png`, syllable: { onset: 'GI', rime: 'AY', tone: 'huyền' }, choices: { onset: ['GI', 'D', 'V'], rime: ['AY', 'ÂY', 'AI'], tone: ['huyền', 'sắc', 'ngang'] } },
    { id: 'dep_sac', targetWord: 'DÉP', imageUrl: `${ASSET_BASE_URL}/assets/images/dep-sac.png`, syllable: { onset: 'D', rime: 'EP', tone: 'sắc' }, choices: { onset: ['D', 'GI', 'V'], rime: ['EP', 'ÊP', 'AP'], tone: ['sắc', 'nặng', 'hỏi'] } },
    { id: 'ong_ngang', targetWord: 'ÔNG', imageUrl: `${ASSET_BASE_URL}/assets/images/ong-khoa.png`, syllable: { onset: '', rime: 'ÔNG', tone: 'ngang' }, choices: { onset: ['', 'G', 'C'], rime: ['ÔNG', 'ÔN', 'OONG'], tone: ['ngang', 'sắc', 'huyền'] } },
    { id: 'com_ngang', targetWord: 'CƠM', imageUrl: `${ASSET_BASE_URL}/assets/images/com-ngang.png`, syllable: { onset: 'C', rime: 'ƠM', tone: 'ngang' }, choices: { onset: ['C', 'K', 'CH'], rime: ['ƠM', 'ÔM', 'EM'], tone: ['ngang', 'huyền', 'sắc'] } },
    { id: 'canh_ngang', targetWord: 'CANH', imageUrl: `${ASSET_BASE_URL}/assets/images/canh-ngang.png`, syllable: { onset: 'C', rime: 'ANH', tone: 'ngang' }, choices: { onset: ['C', 'K', 'Q'], rime: ['ANH', 'ACH', 'INH'], tone: ['ngang', 'sắc', 'hỏi'] } },
    { id: 'vo_hoi', targetWord: 'VỞ', imageUrl: `${ASSET_BASE_URL}/assets/images/vo-hoi.png`, syllable: { onset: 'V', rime: 'Ơ', tone: 'hỏi' }, choices: { onset: ['V', 'D', 'B'], rime: ['Ơ', 'Ô', 'O'], tone: ['hỏi', 'ngã', 'nặng'] } },
];

// Function to get a set of problems for one round
export const generateSpellingRobotProblemSet = async (count = 3): Promise<SpellingRobotProblem[]> => {
    const shuffled = [...spellingRobotData].sort(() => 0.5 - Math.random());
    return Promise.resolve(shuffled.slice(0, count));
};

// --- Bakery Game Service ---
// REFACTORED: This function now selects a pre-defined problem from the bank.
// It also accepts an 'operation' to filter by addition or subtraction.
export const generateBakeryProblem = async (level: number, operation: 'add' | 'subtract'): Promise<BakeryProblem> => {
    // Filter problems that are appropriate for the current level and selected operation.
    const relevantProblems = bakeryProblemsBank.filter(p => p.operation === operation);
     if (relevantProblems.length === 0) {
        // Fallback to the full bank if no problems match.
        console.warn(`No bakery problems found for operation: ${operation}. Using the full bank.`);
        const problem = bakeryProblemsBank[Math.floor(Math.random() * bakeryProblemsBank.length)];
        return Promise.resolve(problem);
    }
    const problem = relevantProblems[Math.floor(Math.random() * relevantProblems.length)];
    return Promise.resolve(problem);
};

// --- Princess Code Game Service ---
export const generatePrincessCodeProblem = async (level: number): Promise<PrincessCodeProblem> => {
    const relevantProblems = princessCodeProblemsBank.filter(p => p.level === level);
    if (relevantProblems.length > 0) {
        const problem = relevantProblems[Math.floor(Math.random() * relevantProblems.length)];
        return Promise.resolve(problem);
    }
    // Fallback to any problem if no specific level match is found
    const problem = princessCodeProblemsBank[Math.floor(Math.random() * princessCodeProblemsBank.length)];
    return Promise.resolve(problem);
};

// --- Restaurant Game Service ---
// REFACTORED: Now uses a predefined bank of orders.
export const generateRestaurantProblem = async (level: number): Promise<RestaurantProblem> => {
    const config = {
        1: { numCustomers: 2 },
        2: { numCustomers: 3 },
        3: { numCustomers: 4 }
    };

    const currentConfig = config[level as keyof typeof config] || config[1];
    
    // Select unique orders from the bank
    const shuffledOrders = [...restaurantOrdersBank].sort(() => 0.5 - Math.random());
    const selectedBankOrders: typeof restaurantOrdersBank = [];
    const usedCustomerIds = new Set<string>();

    for (const order of shuffledOrders) {
        if (selectedBankOrders.length >= currentConfig.numCustomers) {
            break;
        }
        if (!usedCustomerIds.has(order.customerId)) {
            selectedBankOrders.push(order);
            usedCustomerIds.add(order.customerId);
        }
    }
    
    // Fallback if not enough unique customer orders are found (unlikely with a good bank)
    if (selectedBankOrders.length < currentConfig.numCustomers) {
        console.warn("Not enough unique customer orders in bank, may have duplicate customers.");
        const needed = currentConfig.numCustomers - selectedBankOrders.length;
        // Simple fallback: just add more, even if customers are duplicates
        const remainingOrders = shuffledOrders.filter(o => !selectedBankOrders.includes(o)).slice(0, needed);
        selectedBankOrders.push(...remainingOrders);
    }

    const problemCustomers: RestaurantCustomer[] = [];
    const problemOrders: RestaurantOrder[] = [];

    for (const bankOrder of selectedBankOrders) {
        const customer = restaurantCustomers.find(c => c.id === bankOrder.customerId);
        const items = bankOrder.items.map(itemId => restaurantMenuItems.find(m => m.id === itemId)!);

        if (customer && items.every(item => item)) {
            // Ensure customer is only added once
            if (!problemCustomers.some(pc => pc.id === customer.id)) {
                problemCustomers.push(customer);
            }
            problemOrders.push({
                customerId: customer.id,
                items: items,
                orderSentence: bankOrder.orderSentence,
            });
        }
    }

    return Promise.resolve({
        level,
        customers: problemCustomers,
        orders: problemOrders,
    });
};
