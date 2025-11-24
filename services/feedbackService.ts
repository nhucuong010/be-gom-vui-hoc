
import { speak, playAudioSequence, playDynamicSentence } from './audioService';

// --- Helper Functions for Vietnamese Number/Operator to Text ---
const numberToVietnamese = (num: number): string => {
    const numbers: { [key: number]: string } = {
        0: 'không', 1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm',
        6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười'
    };
    if (numbers[num] !== undefined) return numbers[num];
    if (num > 10 && num < 20) {
        return 'mười ' + (num % 10 === 5 ? 'lăm' : numbers[num % 10]);
    }
    if (num >= 20 && num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        if (one === 0) return numbers[ten] + ' mươi';
        if (one === 1) return numbers[ten] + ' mươi mốt';
        if (one === 4) return numbers[ten] + ' mươi tư';
        if (one === 5) return numbers[ten] + ' mươi lăm';
        return numbers[ten] + ' mươi ' + numbers[one];
    }
    return String(num);
};

const operatorToVietnamese = (op: string): string => {
    const ops: { [key: string]: string } = {
        '+': 'cộng', '-': 'trừ', 'x': 'nhân', '>': 'lớn hơn', '<': 'bé hơn', '=': 'bằng'
    };
    return ops[op] || op;
};

/**
 * Converts a math problem into a full, speakable sentence.
 * @param problem The problem string, e.g., "5 + 3".
 * @param answer The correct answer.
 * @param type The type of problem.
 * @param isQuestion Whether to format as a question.
 * @returns A string representing the full sentence.
 */
export const getEquationText = (problem: string, answer: number | string, type: 'calculation' | 'comparison', isQuestion: boolean = false): string => {
    let sequence: (string | number)[] = [];
    const parts = problem.split(' ');
    // A valid problem must have 3 parts: [number, operator, number]
    if (parts.length !== 3) return ""; 

    try {
        const num1 = parseInt(parts[0], 10);
        const operator = parts[1];
        const num2 = parseInt(parts[2], 10);

        if (isNaN(num1) || isNaN(num2)) return "";

        if (type === 'comparison') {
            const comparisonOperator = String(answer);
            if (isQuestion) {
                 // Example: "Gốm ơi, con so sánh xem 5 và 7 nhé."
                 sequence = ['Gốm ơi, con so sánh xem', num1, 'và', num2, 'nhé.'];
            } else {
                 // Example: "Gốm ơi, 5 bé hơn 7."
                 sequence = ['Gốm ơi,', num1, operatorToVietnamese(comparisonOperator), num2, '.'];
            }
        } else if (type === 'calculation') {
            if (isQuestion) {
                 // Example: "Gốm ơi, con tính xem 5 cộng 3 bằng mấy?"
                 sequence = ['Gốm ơi, con tính xem', num1, operatorToVietnamese(operator), num2, 'bằng mấy?'];
            } else {
                 // Example: "Gốm ơi, 5 cộng 3 bằng 8."
                 sequence = ['Gốm ơi,', num1, operatorToVietnamese(operator), num2, 'bằng', Number(answer), '.'];
            }
        }
    } catch (e) {
        console.error("Error parsing equation parts for sequence", e);
        return "";
    }
    
    // Join the sequence into a single string.
    // Handles cases like "5 ." -> "5." and "mấy ?" -> "mấy?"
    return sequence.join(' ').replace(/ \./g, '.').replace(/ ,/g, ',').replace(/ \?/g, '?');
};

// --- Spelling Robot Service ---

// Maps Vietnamese onsets to their correct phonetic pronunciation.
const onsetPronunciations: Record<string, string> = {
    'B': 'bờ', 'C': 'cờ', 'CH': 'chờ', 'D': 'dờ', 'Đ': 'đờ', 'G': 'gờ', 'GH': 'gờ', 'H': 'hờ', 'K': 'ca',
    'KH': 'khờ', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ', 'NG': 'ngờ', 'NGH': 'ngờ', 'NH': 'nhờ', 'P': 'pờ', 'PH': 'phờ',
    'QU': 'quờ', 'R': 'rờ', 'S': 'sờ', 'T': 'tờ', 'TH': 'thờ', 'TR': 'trờ', 'V': 'vờ', 'X': 'xờ', 'GI': 'giờ'
};

/**
 * Generates an interactive audio sequence for each step of spelling a Vietnamese word.
 * This function creates a natural-sounding spelling process by blending sounds as they are selected.
 * @param step The current assembly step ('onset', 'rime', or 'tone').
 * @param problem The problem containing the target syllable.
 * @returns An array of strings representing the audio sequence for the current step.
 */
export const getInteractiveSpellingAudioSequence = (
  step: 'onset' | 'rime' | 'tone',
  problem: { syllable: { onset: string, rime: string, tone: string }, targetWord: string }
): string[] => {
  const { syllable, targetWord } = problem;
  const onsetSound = onsetPronunciations[syllable.onset.toUpperCase()] || syllable.onset;
  const baseWord = (syllable.onset + syllable.rime).toLowerCase();

  switch (step) {
    case 'onset':
      // Just say the sound of the chosen onset. e.g., "thờ"
      return onsetSound ? [onsetSound] : [];
    case 'rime': {
      const rimeSound = syllable.rime.toLowerCase();
      // Spell the combination: onset + rime -> base word. e.g., "thờ - ước - thước"
      return onsetSound ? [onsetSound, rimeSound, baseWord] : [rimeSound];
    }
    case 'tone': {
      const toneSound = syllable.tone;
      if (toneSound === 'ngang') {
        return [targetWord]; // No need to spell out the 'ngang' tone
      }
      // Spell the final combination: base word + tone -> final word. e.g., "thước - sắc - thước"
      return [baseWord, toneSound, targetWord];
    }
    default:
      return [];
  }
};


// --- Feedback Functions ---

export const positiveFeedbackPhrases = ['Đúng rồi!', 'Chính xác!'];
const incorrectFeedbackPhrases = ['Sai rồi, thử lại nhé!', 'Chưa đúng rồi! Thử lại nhé!'];

/**
 * Plays a pre-generated voice feedback sound and returns the spoken text.
 * @param isCorrect True for "Correct", false for "Incorrect".
 * @param isSoundOn A boolean to conditionally play the sound.
 * @returns The phrase that was spoken.
 */
export const playFeedback = async (isCorrect: boolean, isSoundOn: boolean): Promise<string> => {
    let textToSpeak: string;
    if (isCorrect) {
        textToSpeak = positiveFeedbackPhrases[Math.floor(Math.random() * positiveFeedbackPhrases.length)];
    } else {
        textToSpeak = incorrectFeedbackPhrases[Math.floor(Math.random() * incorrectFeedbackPhrases.length)];
    }
    
    if (isSoundOn) {
        // Use speak, which relies on pre-generated files, instead of dynamic TTS
        await speak(textToSpeak, 'vi', isSoundOn);
    }
    
    return textToSpeak;
};


/**
 * Plays a full sentence for a math problem.
 */
export const playEquationSpeech = (problem: string, answer: number | string, type: 'calculation' | 'comparison', isSoundOn: boolean) => {
    if (!isSoundOn) return;
    
    const sentence = getEquationText(problem, answer, type, false);
    
    if (sentence) {
        // Use the dynamic sentence player which falls back to TTS
        playDynamicSentence(sentence, 'vi', isSoundOn);
    } else {
        console.error("Could not convert equation to sequence:", { problem, answer, type });
    }
};

export const formatQuestionForDisplay = (question: string): string => {
    let formatted = question
        .replace(' nhé Hỏi', ' nhé. Hỏi')
        .replace(' nữa Con', ' nữa. Con')
        .replace(' nhé', ' nhé!')
        .replace(' Hỏi', '. Hỏi');

    if (formatted.endsWith('?')) {
        return formatted;
    }
    
    if (formatted.includes('Hỏi')) {
        return formatted + '?';
    }

    return formatted + '.';
};