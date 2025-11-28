# CLAUDE.md - AI Assistant Guide for Bé Gốm Vui Học

> **Last Updated:** 2025-11-28
> **Project:** Bé Gốm Vui Học (Fun Learning with Gốm)
> **Type:** Educational React PWA for Children (3-8 years old)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Key Architecture Patterns](#key-architecture-patterns)
5. [Development Conventions](#development-conventions)
6. [Adding New Features](#adding-new-features)
7. [Asset Management](#asset-management)
8. [Audio System](#audio-system)
9. [Sticker & Reward System](#sticker--reward-system)
10. [Testing & Quality Guidelines](#testing--quality-guidelines)
11. [Deployment Workflow](#deployment-workflow)
12. [Common Tasks](#common-tasks)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Bé Gốm Vui Học** is a Progressive Web App (PWA) designed for Vietnamese children aged 3-8 to learn through interactive games. The app features a lovable ceramic character named "Gốm" and teaches:

- **Vietnamese:** Reading, spelling, writing, pronunciation
- **Math:** Basic arithmetic, counting, comparison
- **English:** Vocabulary, stories, sentences
- **Creative Play:** Piano, coloring, memory games
- **Life Skills:** Shopping, restaurant scenarios, weather

### Key Features

- 25+ educational mini-games
- Sticker collection reward system
- Cartoon rewards for sustained engagement
- Audio feedback and text-to-speech
- Offline-capable PWA
- Mobile-first design (portrait & landscape)
- Wake lock to prevent screen sleep during use

### Target Audience

- **Primary:** Vietnamese children (3-8 years old)
- **Secondary:** Parents/educators managing learning activities
- **Platform:** Mobile browsers (iOS Safari, Chrome on Android)

---

## Tech Stack

### Core Technologies

```json
{
  "framework": "React 18.2",
  "language": "TypeScript 5.2",
  "build": "Vite 5.2",
  "styling": "Tailwind CSS 3.4",
  "pwa": "vite-plugin-pwa 1.1",
  "ai": "@google/genai 1.0 (Gemini API)"
}
```

### Key Dependencies

- **React + React DOM:** UI framework
- **TypeScript:** Type safety
- **Vite:** Fast build tool and dev server
- **Tailwind CSS + PostCSS + Autoprefixer:** Styling
- **vite-plugin-pwa:** Progressive Web App support
- **@google/genai:** Gemini AI for story generation

### Build Tools

- **npm:** Package manager
- **tsc:** TypeScript compiler
- **Vercel:** Deployment platform (auto-deploy from Git)

---

## Repository Structure

```
be-gom-vui-hoc/
├── components/           # React game components (35+ files)
│   ├── HomeScreen.tsx    # Main menu
│   ├── MathGame.tsx      # Math learning game
│   ├── PianoGame.tsx     # Piano learning game
│   ├── ColoringGame.tsx  # Coloring game
│   ├── SpellingGame.tsx  # Vietnamese spelling
│   └── ...               # 30+ other game components
│
├── data/                 # Static game data & manifests
│   ├── mathProblems.ts   # Math question data
│   ├── englishLessons.ts # English vocabulary
│   ├── imagePrompts.ts   # AI image generation prompts
│   ├── restaurantData.ts # Restaurant game data
│   ├── uiSounds.ts       # Sound effect definitions
│   └── ...               # 15+ data files
│
├── services/             # Business logic & API services
│   ├── audioService.ts   # Audio playback & TTS
│   ├── geminiService.ts  # AI story generation
│   ├── ttsService.ts     # Text-to-speech
│   ├── feedbackService.ts# User feedback handling
│   └── imageService.ts   # Image loading utilities
│
├── hooks/                # React custom hooks
│   └── useWakeLock.ts    # Screen wake lock management
│
├── utils/                # Utility functions
│   └── textUtils.ts      # Text processing & sanitization
│
├── public/               # Static assets
│   └── assets/
│       ├── images/       # Game images (by category)
│       │   ├── english/  # English vocabulary images
│       │   ├── chucai/   # Vietnamese letters
│       │   ├── coloring/ # Coloring templates
│       │   └── ...       # 10+ image folders
│       └── audio/        # Audio files
│           ├── sieuthi/  # Supermarket audio
│           ├── piano/    # Piano note samples
│           └── ...       # 5+ audio folders
│
├── App.tsx               # Root component & game router
├── index.tsx             # App entry point
├── types.ts              # TypeScript type definitions
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # (Generated) Tailwind config
├── package.json          # Dependencies & scripts
├── COLORING_GUIDE.md     # Guide for adding coloring pages
└── README.md             # Project README
```

### Directory Purposes

| Directory     | Purpose                                      | Examples                          |
|---------------|----------------------------------------------|-----------------------------------|
| `components/` | React game components & UI elements          | MathGame, PianoGame, icons        |
| `data/`       | Static game content & configuration          | Questions, vocabulary, prompts    |
| `services/`   | Business logic, API calls, audio management  | Gemini AI, TTS, audio playback    |
| `hooks/`      | Reusable React hooks                         | Wake lock, custom state hooks     |
| `utils/`      | Pure utility functions                       | Text sanitization, helpers        |
| `public/`     | Static assets served as-is                   | Images, audio, manifest.json      |

---

## Key Architecture Patterns

### 1. Game Component Structure

All game components follow this pattern:

```typescript
interface GameProps {
  onGoHome: () => void;           // Navigate back to home screen
  onCorrectAnswer?: () => void;   // Trigger reward system
  isSoundOn: boolean;             // Global sound toggle state
}

const MyGame: React.FC<GameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  // Handle correct answer
  const handleCorrect = () => {
    playSound('correct', isSoundOn);
    onCorrectAnswer?.();  // Trigger sticker/reward system
    // ... advance to next question
  };

  return (
    <div className="game-container">
      {/* Game UI */}
    </div>
  );
};
```

### 2. State Management

- **Global State:** Managed in `App.tsx` (game selection, rewards, sound)
- **Local State:** Each game manages its own state using `useState`
- **No Redux:** Simple useState + props is sufficient for this app size
- **Audio Context:** Shared audio context in `audioService.ts`

### 3. Asset Loading Pattern

```typescript
// Assets are loaded from Vercel CDN
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// Function to get correct image path based on game
const getImagePath = (filename: string, game: string): string => {
  if (game === 'writing') return `${ASSET_BASE_URL}/assets/images/chucai/${filename}`;
  if (game === 'weather_explorer') return `${ASSET_BASE_URL}/assets/images/khampha/${filename}`;
  // ... more game-specific paths
  return `${ASSET_BASE_URL}/assets/images/${filename}`;
};
```

### 4. Sound System Architecture

```typescript
// Centralized sound management
import { playSound, stopAllSounds, preloadSounds } from './services/audioService';

// In App.tsx - preload on mount
useEffect(() => {
  preloadSounds();
}, []);

// In any component - play sound
playSound('correct', isSoundOn);
playSound('incorrect', isSoundOn);
```

---

## Development Conventions

### Code Style

1. **TypeScript Strict Mode:** Enabled - always type your code
2. **Functional Components:** Use `React.FC<Props>` pattern
3. **Hooks:** Prefer hooks over class components
4. **File Naming:** PascalCase for components (`MathGame.tsx`)
5. **Export Pattern:** Default export for components
6. **Comments:** Use Vietnamese for game content, English for technical comments

### Naming Conventions

```typescript
// Components: PascalCase
MathGame, HomeScreen, StickerBook

// Functions: camelCase
handleCorrectAnswer, generateQuestion, playSound

// Constants: UPPER_SNAKE_CASE
ASSET_BASE_URL, STICKER_REWARD_THRESHOLD

// Types/Interfaces: PascalCase
GameState, MathProblem, VocabularyItem

// CSS Classes: Tailwind utility classes
className="bg-purple-500 text-white rounded-lg"
```

### Type Definitions

All types are centralized in `types.ts`:

```typescript
// Game state type
export type GameState = 'home' | 'math' | 'spelling' | 'piano' | ...;

// Problem types for each game
export interface MathProblem { ... }
export interface SpellingWord { ... }
export interface VocabularyItem { ... }
```

### Component Props Pattern

```typescript
// Always define props interface
interface MyGameProps {
  onGoHome: () => void;
  onCorrectAnswer?: () => void;  // Optional with ?
  isSoundOn: boolean;
}

// Use React.FC<Props>
const MyGame: React.FC<MyGameProps> = (props) => {
  // Destructure in function signature or here
  const { onGoHome, onCorrectAnswer, isSoundOn } = props;
  // ...
};
```

### Responsive Design Patterns

```typescript
// Use Tailwind responsive classes
<div className="
  w-full h-screen          // Full viewport on all screens
  p-4 md:p-8               // More padding on larger screens
  grid grid-cols-1         // 1 column on mobile
  md:grid-cols-2           // 2 columns on tablet
  lg:grid-cols-3           // 3 columns on desktop
">
```

---

## Adding New Features

### Adding a New Game

**Step 1: Create Game Component**

```bash
# Create new file
touch components/MyNewGame.tsx
```

```typescript
// components/MyNewGame.tsx
import React, { useState } from 'react';
import { playSound } from '../services/audioService';

interface MyNewGameProps {
  onGoHome: () => void;
  onCorrectAnswer?: () => void;
  isSoundOn: boolean;
}

const MyNewGame: React.FC<MyNewGameProps> = ({
  onGoHome,
  onCorrectAnswer,
  isSoundOn
}) => {
  const [score, setScore] = useState(0);

  const handleCorrect = () => {
    playSound('correct', isSoundOn);
    onCorrectAnswer?.();
    setScore(s => s + 1);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-200 to-purple-200 p-6">
      <button onClick={onGoHome} className="btn-back">
        🏠 Home
      </button>

      {/* Game content here */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold">My New Game</h1>
      </div>
    </div>
  );
};

export default MyNewGame;
```

**Step 2: Add to GameState Type**

```typescript
// types.ts
export type GameState =
  | 'home'
  | 'math'
  | 'spelling'
  | 'my_new_game'  // ADD THIS
  | ...;
```

**Step 3: Register in App.tsx**

```typescript
// App.tsx

// 1. Import component
import MyNewGame from './components/MyNewGame';

// 2. Add to renderGame() switch
const renderGame = () => {
  switch (gameState) {
    case 'my_new_game':
      return <MyNewGame {...gameProps} />;
    // ... other cases
  }
};
```

**Step 4: Add to Home Screen**

```typescript
// components/HomeScreen.tsx

const games = [
  // ... existing games
  {
    id: 'my_new_game' as GameState,
    title: 'My New Game',
    icon: '🎮',
    bgColor: 'from-blue-400 to-blue-600'
  }
];
```

### Adding Game Data

**Create data file:**

```typescript
// data/myNewGameData.ts
export interface MyGameQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
}

export const myGameQuestions: MyGameQuestion[] = [
  {
    id: 'q1',
    question: 'What is 2+2?',
    answer: '4',
    options: ['3', '4', '5']
  },
  // ... more questions
];
```

**Import in component:**

```typescript
import { myGameQuestions } from '../data/myNewGameData';
```

---

## Asset Management

### Image Assets

**Directory Structure:**

```
public/assets/images/
├── english/       # English vocabulary images
├── chucai/        # Vietnamese letter images
├── coloring/      # Coloring page templates
├── khampha/       # Science/weather images
├── muasam/        # Shopping game images
├── thoitiet/      # Time/weather images
├── spelling/      # Spelling game images
├── feeding/       # Feeding game images
└── stickers/      # Sticker reward images
```

**Naming Convention:**

- Lowercase with hyphens: `fire-truck.png`
- Descriptive names: `ca-rot.png` (carrot), `cho.png` (dog)
- PNG format preferred for transparency

**Adding Images:**

1. Place image in appropriate folder
2. Reference in code using `getImagePath()` or direct URL:

```typescript
// Using getImagePath helper (from App.tsx)
const imagePath = getImagePath('my-image.png', 'english');

// Or direct CDN URL
const imageUrl = 'https://be-gom-vui-hoc.vercel.app/assets/images/coloring/unicorn.png';
```

**Image Size Guidelines:**

- Minimum: 800x800px
- Recommended: 1000x1000px
- Max file size: 200KB (compress if needed)

### Audio Assets

**Directory Structure:**

```
public/assets/audio/
├── sieuthi/       # Supermarket audio
├── piano/         # Piano note samples
├── vuonthu/       # Garden/zoo audio
├── khampha/       # Science audio
├── nhahang/       # Restaurant audio
└── bongbay/       # Bubble pop audio
```

**Audio Format:**

- Primary: `.wav` for sound effects
- Secondary: `.mp3` for music/longer clips
- Naming: `{word}-{tone}.wav` (e.g., `ba-ngang.wav`)

**Adding Audio:**

See [Audio System](#audio-system) section below.

---

## Audio System

### Architecture

The audio system uses Web Audio API for sound effects and HTML5 Audio for longer clips.

**Key Files:**

- `services/audioService.ts` - Main audio logic
- `services/ttsService.ts` - Text-to-speech generation
- `data/uiSounds.ts` - UI sound effect definitions

### Sound Types

```typescript
// types.ts
export const SOUNDS = [
  'click',         // Button clicks
  'correct',       // Correct answer
  'incorrect',     // Wrong answer
  'dice-roll',     // Dice rolling
  'card-flip',     // Card flipping
  'sticker-unlock',// Sticker unlocked
  'win',           // Level complete
  'jump'           // Character jump
] as const;

export type SoundName = typeof SOUNDS[number];
```

### Playing Sounds

```typescript
import { playSound } from '../services/audioService';

// In any component
playSound('correct', isSoundOn);
playSound('click', isSoundOn);

// Stop all sounds
import { stopAllSounds } from '../services/audioService';
stopAllSounds();
```

### Text-to-Speech

```typescript
import { speak } from '../services/ttsService';

// Speak Vietnamese text
await speak('Xin chào!', isSoundOn);

// With options
await speak(text, isSoundOn, {
  rate: 0.9,      // Speed
  pitch: 1.0,     // Pitch
  lang: 'vi-VN'   // Language
});
```

### Adding New Sounds

**Step 1: Add audio file**

```bash
# Place .wav file in appropriate folder
cp new-sound.wav public/assets/audio/
```

**Step 2: Define in uiSounds.ts**

```typescript
// data/uiSounds.ts
export const uiSoundData = {
  // ... existing sounds
  'new-sound': 'base64_encoded_audio_data_here'
};
```

**Step 3: Add to SOUNDS type**

```typescript
// types.ts
export const SOUNDS = [
  'click',
  'correct',
  'new-sound',  // ADD THIS
  // ...
] as const;
```

**Step 4: Use in components**

```typescript
playSound('new-sound', isSoundOn);
```

### Audio Context Sharing

All games share a single `AudioContext` to avoid iOS limitations:

```typescript
// services/audioService.ts
export const audioContext = new AudioContext();

// Use this shared context in all audio operations
```

---

## Sticker & Reward System

### How It Works

The app has a dual reward system:

1. **Sticker Rewards:** Every 10 correct answers → unlock 1 random sticker
2. **Big Rewards:** Every 20 correct answers → watch a cartoon

### Architecture

**State Management (in App.tsx):**

```typescript
const [correctAnswersForSticker, setCorrectAnswersForSticker] = useState(0);
const [correctAnswersForBigReward, setCorrectAnswersForBigReward] = useState(0);
const [unlockedStickers, setUnlockedStickers] = useState<Sticker[]>([]);
const [showCartoon, setShowCartoon] = useState(false);
```

**Reward Thresholds:**

```typescript
const STICKER_REWARD_THRESHOLD = 10;  // 10 correct → 1 sticker
const BIG_REWARD_THRESHOLD = 20;       // 20 correct → cartoon
```

### Sticker Aggregation

All stickers are aggregated from multiple data sources:

```typescript
// App.tsx - generateAllStickers()
const allStickers = [
  ...imagePrompts,          // Core game assets
  ...supermarketItems,      // Supermarket game
  ...scienceItems,          // Weather/science game
  ...restaurantMenuItems,   // Restaurant game
  ...streetFoodMenu         // Street food game
];
```

### Triggering Rewards

In any game component:

```typescript
const handleCorrect = () => {
  playSound('correct', isSoundOn);
  onCorrectAnswer?.();  // This triggers the reward system
  // ... rest of your logic
};
```

### Sticker Display

Users can view all stickers (locked + unlocked) in the StickerBook component, accessible from HomeScreen.

---

## Testing & Quality Guidelines

### Before Committing

1. **Type Check:** `npm run build` (runs `tsc`)
2. **Visual Test:** Test in mobile viewport (Chrome DevTools)
3. **Audio Test:** Verify sounds work on iOS Safari
4. **Portrait + Landscape:** Test both orientations

### Manual Testing Checklist

- [ ] Game loads without errors
- [ ] Audio plays correctly (when sound is ON)
- [ ] Audio stops when sound is OFF
- [ ] Back button navigates to home
- [ ] Correct answers trigger rewards
- [ ] Layout works in portrait mode
- [ ] Layout works in landscape mode
- [ ] No console errors
- [ ] Images load properly

### Common Issues to Avoid

1. **Audio on iOS:** Always require user interaction before playing audio
2. **Wake Lock:** Only works on HTTPS (production) not localhost
3. **Asset Paths:** Always use absolute paths from `/assets/`
4. **Performance:** Optimize large images before adding
5. **TypeScript:** Fix all type errors before committing

---

## Deployment Workflow

### Git Branch Strategy

- **Main Branch:** Protected - auto-deploys to production
- **Feature Branches:** Use `claude/` prefix for AI-assisted development
- **Branch Naming:** `claude/feature-name-{session-id}`

### Commit Message Format

Follow conventional commits:

```bash
# New feature
git commit -m "feat: add new math game for multiplication"

# Bug fix
git commit -m "fix: resolve audio playback issue on iOS"

# Refactor
git commit -m "refactor: optimize sticker loading performance"

# Documentation
git commit -m "docs: update CLAUDE.md with audio guidelines"

# Chore
git commit -m "chore: remove unused Bubble Pop game"
```

### Deployment Process

**Vercel auto-deploys on push to main:**

```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Build to check for errors
npm run build

# 4. Commit
git add .
git commit -m "feat: your feature description"

# 5. Push to your branch
git push -u origin claude/your-branch-name

# 6. Create PR or push to main (if authorized)
# Vercel will auto-deploy in 1-2 minutes
```

### Environment Variables

Required for production:

```bash
# .env.local (not committed to git)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // ... PWA config
    })
  ],
  build: {
    outDir: 'dist'
  }
});
```

---

## Common Tasks

### Task: Add a Coloring Page

See `COLORING_GUIDE.md` for detailed instructions.

**Quick steps:**

1. Get PNG image (white background, black outlines)
2. Place in `public/assets/images/coloring/`
3. Add to `TEMPLATES` array in `ColoringGame.tsx`
4. Test and deploy

### Task: Add English Vocabulary

**Step 1: Add to data file**

```typescript
// data/englishLessons.ts
export const lessons: EnglishLesson[] = [
  {
    lesson: 1,
    title: 'Animals',
    vocabulary: [
      // ... existing words
      {
        id: 'elephant',
        word: 'elephant',
        vietnamese: 'con voi',
        imageUrl: '/assets/images/english/elephant.png',
        sentence: 'The elephant is big.',
        gender: 'neutral'
      }
    ]
  }
];
```

**Step 2: Add image**

Place image at `public/assets/images/english/elephant.png`

**Step 3: Test**

Play the English game and verify the new word appears.

### Task: Add Piano Song

**Step 1: Define note sequence**

```typescript
// components/PianoGame.tsx - Add to SONGS array
{
  id: 'my-song',
  title: 'My Song 🎵',
  notes: [
    { note: 'C4', duration: 500 },
    { note: 'D4', duration: 500 },
    { note: 'E4', duration: 1000 },
  ],
  highlightDuration: 2000
}
```

**Step 2: Test**

Play the piano game and verify the song plays correctly.

### Task: Modify Reward Thresholds

```typescript
// App.tsx
const STICKER_REWARD_THRESHOLD = 5;   // Change from 10 to 5
const BIG_REWARD_THRESHOLD = 15;       // Change from 20 to 15
```

### Task: Add New Math Problem Type

**Step 1: Add to MathProblem type**

```typescript
// types.ts
export interface MathProblem {
  problem: string;
  answer: number | string;
  type: 'calculation' | 'comparison' | 'new-type';  // Add new type
}
```

**Step 2: Add problems**

```typescript
// data/mathProblems.ts
export const newTypeProblems: MathProblem[] = [
  { problem: '...', answer: 42, type: 'new-type' }
];
```

**Step 3: Update game logic**

```typescript
// components/MathGame.tsx
// Add handling for 'new-type' problems
```

---

## Troubleshooting

### Issue: Audio not playing on iOS

**Cause:** iOS requires user interaction before playing audio.

**Solution:**

```typescript
// Add audio unlock overlay (see PianoGame.tsx for example)
const [audioUnlocked, setAudioUnlocked] = useState(false);

const unlockAudio = async () => {
  await audioContext.resume();
  playSound('click', true);
  setAudioUnlocked(true);
};

// Show button requiring tap to unlock audio
{!audioUnlocked && (
  <div className="audio-unlock-overlay">
    <button onClick={unlockAudio}>Tap to Start 🎵</button>
  </div>
)}
```

### Issue: Build failing with TypeScript errors

**Cause:** Type errors in code.

**Solution:**

```bash
# Run TypeScript compiler to see errors
npm run build

# Fix all type errors before committing
# Common fixes:
# - Add type annotations
# - Fix undefined/null checks
# - Update types.ts
```

### Issue: Images not loading

**Cause:** Incorrect asset path.

**Solution:**

```typescript
// ❌ Wrong (relative path)
imageUrl: './assets/images/my-image.png'

// ✅ Correct (absolute path)
imageUrl: '/assets/images/my-image.png'

// ✅ Correct (CDN URL)
imageUrl: 'https://be-gom-vui-hoc.vercel.app/assets/images/my-image.png'
```

### Issue: App not updating on mobile

**Cause:** Service worker caching old version.

**Solution:**

1. Hard refresh: Chrome → Settings → Clear cache
2. Or update `manifest.json` version number
3. PWA will auto-update on next visit

### Issue: Wake lock not working

**Cause:** Wake Lock API only works on HTTPS.

**Solution:**

- This is expected on `localhost`
- Will work correctly in production (Vercel uses HTTPS)

---

## Important Notes for AI Assistants

### Do's

✅ **Always read existing code** before suggesting changes
✅ **Follow existing patterns** - consistency is key
✅ **Test in mobile viewport** - this is a mobile-first app
✅ **Use TypeScript types** - never use `any`
✅ **Respect the reward system** - call `onCorrectAnswer()` appropriately
✅ **Preserve Vietnamese content** - don't translate game text
✅ **Keep it simple** - this is for 3-8 year olds
✅ **Add comments in English** for technical code
✅ **Use Tailwind utilities** - avoid custom CSS

### Don'ts

❌ **Don't remove working features** without confirmation
❌ **Don't change reward thresholds** without discussion
❌ **Don't add complex dependencies** - keep it lightweight
❌ **Don't use class components** - use functional + hooks
❌ **Don't skip type definitions** - always define types
❌ **Don't translate Vietnamese game content** to English
❌ **Don't add features for older kids** - target 3-8 years
❌ **Don't break mobile layout** - always test responsive

### When Making Changes

1. **Understand the context:** Read related files first
2. **Check types:** Ensure TypeScript types are correct
3. **Test locally:** Run `npm run dev` and test in browser
4. **Build check:** Run `npm run build` to catch type errors
5. **Commit clearly:** Use conventional commit format
6. **Document changes:** Update this file if adding major features

### Code Review Checklist

Before suggesting code changes, verify:

- [ ] TypeScript types are defined
- [ ] Component follows existing patterns
- [ ] Props interface is defined
- [ ] Sound toggle (`isSoundOn`) is respected
- [ ] Back button (`onGoHome`) is present
- [ ] Reward system (`onCorrectAnswer`) is called
- [ ] Responsive design is maintained
- [ ] No console errors in browser
- [ ] Assets load correctly
- [ ] Code is commented (English for technical, Vietnamese OK for content)

---

## Version History

| Date       | Version | Changes                                      |
|------------|---------|----------------------------------------------|
| 2025-11-28 | 1.0.0   | Initial CLAUDE.md created                    |

---

## Contact & Resources

- **Live App:** https://be-gom-vui-hoc.vercel.app
- **AI Studio:** https://ai.studio/apps/drive/1Fl_LNdWUeq7741NEq39m1Kh6ex-0dlmn
- **Repository:** Current Git repository
- **Deployment:** Vercel (auto-deploy on push to main)

---

**Note:** This document should be updated whenever major architectural changes are made to the codebase. AI assistants should read this file at the start of each session to understand the project structure and conventions.
