
export interface MathProblem {
  problem: string; // ví dụ: "5 + 3" hoặc "5 _ 7"
  answer: number | string; // ví dụ: 8 hoặc "<"
  type: 'calculation' | 'comparison';
}

export interface SpellingWord {
  word: string;
  imageUrl: string;
}

export interface MemoryCard {
    id: number;
    content: string;
    matchId: number;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface Sticker {
  id: string;
  name: string;
  imageUrl: string;
}

export interface VocabularyItem {
  id?: string;
  word: string;
  vietnamese: string;
  imageUrl: string;
  sentence: string;
  // NEW: Add gender to determine pronouns (he/she) for more natural story generation.
  gender?: 'male' | 'female' | 'neutral';
}

export interface EnglishLesson {
  lesson: number;
  title: string;
  vocabulary: VocabularyItem[];
}

export interface ImagePromptItem {
    word: string;
    filename: string;
    prompt: string;
    referencePrompt?: string;
    // The game this asset belongs to, used for categorization and directory structure.
    game: 'common' | 'feeding' | 'bakery' | 'english' | 'sticker' | 'cover' | 'math_visual' | 'memory_math' | 'princess_code' | 'restaurant' | 'street_food' | 'bunny_rescue' | 'garden_memory' | 'capybara_rescue';
}

export interface FillInTheBlankProblem {
  word: string; // e.g., "MÈO"
  problemFormat: string; // e.g., "M _ O"
  hiddenIndex: number; // The index of the character to be guessed in the original `word` string.
  correctLetter: string; // e.g., "È"
  options: string[]; // e.g., ["È", "A", "U"]
  imageUrl: string;
}

export interface FeedingProblem {
  animal: string; // e.g., 'Thỏ'
  food: string; // e.g., 'cà rốt'
  animalImageUrl: string;
  foodImageUrl: string;
  initialAmount: number;
  changeAmount: number;
  operation: 'add' | 'subtract';
  question: string;
  answer: number;
}

export interface SpellingRobotSyllable {
  onset: string; // âm đầu
  rime: string;  // vần
  tone: string;  // thanh (e.g., 'ngang', 'sắc', 'huyền', 'hỏi', 'ngã', 'nặng')
}

export interface SpellingRobotChoices {
  onset: string[];
  rime: string[];
  tone: string[];
}

export interface SpellingRobotProblem {
  id: string; // e.g., 'ca_sac'
  targetWord: string; // e.g., 'CÁ'
  imageUrl: string; // e.g., '/assets/images/spelling/ca.png'
  syllable: SpellingRobotSyllable;
  choices: SpellingRobotChoices;
}

// --- Bakery Game Types ---
// REFACTORED: Simplified the structure to be more direct and easier to manage, similar to FeedingGame.
// This removes the complex `questionSequence` and multi-item arrays.
export interface BakeryProblem {
  customerName: string;
  customerImageUrl: string;
  item: {
    name: string;
    plural: string;
    imageUrl: string;
  };
  initialAmount: number;
  changeAmount: number;
  operation: 'add' | 'subtract';
  question: string;
  answer: number;
}

// --- Princess Code Game Types ---
export interface NumberCharacter {
  digit: number;
  name: string;
  imageUrl: string;
  description: string;
}

export interface StoryChoice {
  text: string;
  storySegment: string;
}

export interface StoryStep {
  question: string;
  characterIndices: number[];
  choices: StoryChoice[];
}

export interface PrincessCodeProblem {
  id: string;
  code: string;
  level: number;
  storySteps: StoryStep[];
}

// --- Restaurant Game Types ---
export interface RestaurantCustomer {
  id: string;
  name: string;
  imageUrl: string;
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface RestaurantOrder {
  customerId: string;
  items: RestaurantMenuItem[];
  orderSentence: string;
}

export interface RestaurantProblem {
  level: number;
  customers: RestaurantCustomer[];
  orders: RestaurantOrder[];
}

// --- Street Food Game Types ---
export interface StreetFoodCookingStep {
  instruction: string;
  imageUrl: string;
}

export interface StreetFoodMenuItem {
  id: 'pizza' | 'pasta' | 'fries' | 'hotdog';
  name: string;
  price: number;
  steps: StreetFoodCookingStep[];
}

export interface StreetFoodCustomerOrder {
  customerId: string;
  customerName: string;
  customerImageUrl: string;
  orderText: string;
  items: StreetFoodMenuItem['id'][];
  total: number;
  payment: number;
  change: number;
}

export interface StreetFoodProblem {
  level: number;
  order: StreetFoodCustomerOrder;
}

// --- Bunny Rescue Game Types ---
export interface BunnyRescueStep {
  problem: string;
  options: number[];
  answer: number;
  operation: 'add' | 'subtract';
  num1: number;
  num2: number;
}

export interface BunnyRescueLevel {
  level: number;
  steps: BunnyRescueStep[];
}

// --- Garden Memory Game Types ---
export interface GardenQuestion {
    questionText: string;
    options: (string | number)[];
    answer: string | number;
}

export interface GardenMemoryScene {
    id: string;
    imageUrl: string;
    intro_sentence: string;
    questions: GardenQuestion[];
}

// --- Capybara Rescue Game Types ---
export interface CapybaraQuestion {
    num1: number;
    num2: number;
    answer: number;
    options: number[];
    questionText: string; // "2 cộng 3 bằng mấy?"
}


export type GameState = 'home' | 'math' | 'spelling' | 'memory' | 'english' | 'sticker_book' | 'dice' | 'resource_generator' | 'fill_in_the_blank' | 'feeding' | 'spelling_robot' | 'bakery' | 'princess_code' | 'restaurant' | 'english_story' | 'street_food' | 'bunny_rescue' | 'garden_memory' | 'capybara_rescue';

// ADD: Add sound types here to break circular dependency
export const SOUNDS = ['click', 'correct', 'incorrect', 'dice-roll', 'card-flip', 'sticker-unlock', 'win', 'jump'] as const;
export type SoundName = typeof SOUNDS[number];
