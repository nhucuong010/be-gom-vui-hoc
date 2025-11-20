// Gemini Service - Production Version (No API)
// All static game data is used - no runtime API calls

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const spellingWordsByLevel = {
  1: [
    { word: 'BA CUONG', imageUrl: '${ASSET_BASE_URL}/assets/images/ba-cuong.png' },
    { word: 'ME HUONG', imageUrl: '${ASSET_BASE_URL}/assets/images/me-huong.png' },
    { word: 'GOM', imageUrl: '${ASSET_BASE_URL}/assets/images/gom-sac.png' },
    { word: 'GAO', imageUrl: '${ASSET_BASE_URL}/assets/images/gao-nang.png' },
    { word: 'BA THOM', imageUrl: '${ASSET_BASE_URL}/assets/images/ba-thom.png' },
    { word: 'ONG KHOA', imageUrl: '${ASSET_BASE_URL}/assets/images/ong-khoa.png' },
    { word: 'BE SAC', imageUrl: '${ASSET_BASE_URL}/assets/images/be-sac.png' },
  ]
};

export const generateResponseFromText = async (text: string): Promise<string> => {
  // Production mode: return static response
  return 'Tuyệt vời!';
};

export const generateFeedbackForSpelling = async (word: string, givenAnswer: string): Promise<string> => {
  // Production mode: return static feedback
  if (word.toLowerCase() === givenAnswer.toLowerCase()) {
    return 'Chính xác!';
  }
  return `Từ đúng là: ${word}`;
};

export const generateImageDescription = async (imageUrl: string): Promise<string> => {
  // Production mode: return static description
  return 'Hình ảnh đẹp lắm';
};


// Import Princess Code Data
import { princessCodeProblemsBank } from '../data/princessCodeData';
import type { PrincessCodeProblem } from '../types';

export const generatePrincessCodeProblem = async (level: number): Promise<PrincessCodeProblem> => {
  // Production mode: return static problem from data bank
  const problemsForLevel = princessCodeProblemsBank.filter(p => p.level === level);
  if (problemsForLevel.length === 0) {
    // Fallback to first problem if no level found
    return princessCodeProblemsBank[0];
  }
  // Return a random problem for the level
  return problemsForLevel[Math.floor(Math.random() * problemsForLevel.length)];
};


export const generateMathProblem = async (level: number): Promise<{ question: string; answer: number }> => {
  // Production mode: return static math problem
  const problems = [
    { question: '2 + 3 = ?', answer: 5 },
    { question: '10 - 4 = ?', answer: 6 },
    { question: '3 x 4 = ?', answer: 12 },
    { question: '12 / 3 = ?', answer: 4 },
  ];
  return problems[Math.floor(Math.random() * problems.length)];
};


export const generateSpellingWord = async (level: number): Promise<{ word: string; imageUrl: string }> => {
  // Production mode: return static spelling word
const words = spellingWordsByLevel[level as unknown as keyof typeof spellingWordsByLevel] || spellingWordsByLevel[1];  if (words && words.length > 0) {
    return words[Math.floor(Math.random() * words.length)];
  }
  return { word: 'BA CUONG', imageUrl: `${ASSET_BASE_URL}/assets/images/ba-cuong.png` };
};
