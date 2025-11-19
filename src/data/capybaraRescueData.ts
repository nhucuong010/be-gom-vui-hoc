
import type { CapybaraQuestion } from '../types';

// Helper to generate options (correct, +1/-1, +2/-2)
const generateOptions = (correct: number): number[] => {
    const options = new Set<number>([correct]);
    while (options.size < 3) {
        const offset = Math.floor(Math.random() * 5) - 2; // -2 to 2
        const val = correct + offset;
        if (val >= 0 && val <= 20 && val !== correct) {
            options.add(val);
        }
    }
    return Array.from(options).sort(() => 0.5 - Math.random());
};

// Generate a random addition problem within range
// stepIndex: 0-4. 
// Steps 0-1 (first 2 questions): Sum <= 5 (Easy)
// Steps 2-4: Sum <= 10 (Harder)
export const generateCapybaraQuestion = (stepIndex: number = 0): CapybaraQuestion => {
    const maxSum = stepIndex < 2 ? 5 : 10;

    let num1 = Math.floor(Math.random() * (maxSum + 1)); 
    let maxNum2 = maxSum - num1;
    let num2 = Math.floor(Math.random() * (maxNum2 + 1));
    
    // REDUCE ZERO FREQUENCY:
    // If either number is 0, we have an 80% chance to re-roll to try and get non-zero numbers.
    // This makes questions like "0 + 5" much rarer, preferring "2 + 3".
    if ((num1 === 0 || num2 === 0) && Math.random() > 0.2) {
         // Recursively try again (safe because probability of exit is high)
         return generateCapybaraQuestion(stepIndex);
    }

    const answer = num1 + num2;
    const options = generateOptions(answer);

    return {
        num1,
        num2,
        answer,
        options,
        questionText: `${num1} cộng ${num2} bằng mấy?`
    };
};

export const capybaraAudioTexts = [
    "Một hôm, bé Gốm đang chơi với bóng bay.",
    "Bỗng gió thổi mạnh, bóng bay bay lên cao mất rồi!",
    "Con giúp bé Gốm nhảy lên giải cứu bóng bay nhé!",
    "Mỗi khi con làm đúng một phép tính, bé Gốm sẽ nhảy lên một bậc.",
    "Yeahhh! Con đã giải cứu được bóng bay capybara rồi!",
    "Bé Gốm và bạn Capybara cảm ơn con nhiều lắm!",
    "Mình đếm thử nhé!",
    "Vậy là bằng..."
];
