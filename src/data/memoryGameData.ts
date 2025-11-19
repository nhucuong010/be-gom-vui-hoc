const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export interface MemoryPairWithImages {
    problem: string;
    answer: number;
    operation: 'add' | 'subtract';
    maxNumberInProblem: number;
    problemImageUrl: string;
    answerImageUrl: string;
}

// A predefined pool of math problems and their corresponding image assets.
export const memoryGamePool: MemoryPairWithImages[] = [
    // --- Addition up to 5 ---
    { problem: '1 + 1', answer: 2, operation: 'add', maxNumberInProblem: 1, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_1_plus_1.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_2.png` },
    { problem: '1 + 2', answer: 3, operation: 'add', maxNumberInProblem: 2, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_1_plus_2.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_3.png` },
    { problem: '1 + 3', answer: 4, operation: 'add', maxNumberInProblem: 3, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_1_plus_3.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_4.png` },
    { problem: '1 + 4', answer: 5, operation: 'add', maxNumberInProblem: 4, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_1_plus_4.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_5.png` },
    { problem: '2 + 2', answer: 4, operation: 'add', maxNumberInProblem: 2, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_2_plus_2.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_4.png` },
    { problem: '2 + 3', answer: 5, operation: 'add', maxNumberInProblem: 3, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_2_plus_3.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_5.png` },
    
    // --- Addition up to 10 ---
    { problem: '2 + 5', answer: 7, operation: 'add', maxNumberInProblem: 5, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_2_plus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_7.png` },
    { problem: '3 + 4', answer: 7, operation: 'add', maxNumberInProblem: 4, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_3_plus_4.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_7.png` },
    { problem: '3 + 5', answer: 8, operation: 'add', maxNumberInProblem: 5, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_3_plus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_8.png` },
    { problem: '3 + 6', answer: 9, operation: 'add', maxNumberInProblem: 6, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_3_plus_6.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_9.png` },
    { problem: '4 + 4', answer: 8, operation: 'add', maxNumberInProblem: 4, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_4_plus_4.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_8.png` },
    { problem: '4 + 5', answer: 9, operation: 'add', maxNumberInProblem: 5, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_4_plus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_9.png` },
    { problem: '4 + 6', answer: 10, operation: 'add', maxNumberInProblem: 6, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_4_plus_6.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_10.png` },
    { problem: '5 + 5', answer: 10, operation: 'add', maxNumberInProblem: 5, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_5_plus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_10.png` },
    { problem: '2 + 8', answer: 10, operation: 'add', maxNumberInProblem: 8, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_2_plus_8.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_10.png` },
    { problem: '3 + 7', answer: 10, operation: 'add', maxNumberInProblem: 7, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_3_plus_7.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_10.png` },
    
    // --- Subtraction from 10 ---
    { problem: '5 - 2', answer: 3, operation: 'subtract', maxNumberInProblem: 5, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_5_minus_2.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_3.png` },
    { problem: '6 - 4', answer: 2, operation: 'subtract', maxNumberInProblem: 6, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_6_minus_4.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_2.png` },
    { problem: '7 - 3', answer: 4, operation: 'subtract', maxNumberInProblem: 7, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_7_minus_3.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_4.png` },
    { problem: '8 - 5', answer: 3, operation: 'subtract', maxNumberInProblem: 8, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_8_minus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_3.png` },
    { problem: '9 - 4', answer: 5, operation: 'subtract', maxNumberInProblem: 9, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_9_minus_4.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_5.png` },
    { problem: '10 - 6', answer: 4, operation: 'subtract', maxNumberInProblem: 10, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_10_minus_6.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_4.png` },
    { problem: '10 - 3', answer: 7, operation: 'subtract', maxNumberInProblem: 10, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_10_minus_3.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_7.png` },
    { problem: '9 - 6', answer: 3, operation: 'subtract', maxNumberInProblem: 9, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_9_minus_6.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_3.png` },

    // --- Addition up to 20 ---
    { problem: '8 + 8', answer: 16, operation: 'add', maxNumberInProblem: 8, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_8_plus_8.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_16.png` },
    { problem: '9 + 5', answer: 14, operation: 'add', maxNumberInProblem: 9, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_9_plus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_14.png` },
    { problem: '7 + 6', answer: 13, operation: 'add', maxNumberInProblem: 7, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_7_plus_6.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_13.png` },
    { problem: '10 + 7', answer: 17, operation: 'add', maxNumberInProblem: 10, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_10_plus_7.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_17.png` },
    { problem: '12 + 5', answer: 17, operation: 'add', maxNumberInProblem: 12, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_12_plus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_17.png` },

    // --- Subtraction from 20 ---
    { problem: '15 - 5', answer: 10, operation: 'subtract', maxNumberInProblem: 15, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_15_minus_5.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_10.png` },
    { problem: '18 - 9', answer: 9, operation: 'subtract', maxNumberInProblem: 18, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_18_minus_9.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_9.png` },
    { problem: '20 - 10', answer: 10, operation: 'subtract', maxNumberInProblem: 20, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_20_minus_10.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_10.png` },
    { problem: '14 - 7', answer: 7, operation: 'subtract', maxNumberInProblem: 14, problemImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_prob_14_minus_7.png`, answerImageUrl: `${ASSET_BASE_URL}/assets/images/math_memory_ans_7.png` },
];