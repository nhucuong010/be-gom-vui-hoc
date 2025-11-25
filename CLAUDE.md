# CLAUDE.md - AI Assistant Guide

> Comprehensive guide for AI assistants working on **Bé Gốm Vui Học** (Fun Learning for Kids)

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Directory Structure](#directory-structure)
- [Key Conventions](#key-conventions)
- [Development Workflow](#development-workflow)
- [Code Patterns](#code-patterns)
- [Asset Management](#asset-management)
- [Game Development](#game-development)
- [Testing & Building](#testing--building)
- [Deployment](#deployment)
- [Common Tasks](#common-tasks)
- [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Project Overview

**Bé Gốm Vui Học** is a Vietnamese educational Progressive Web App (PWA) designed for children aged 3-8. The app features multiple interactive learning games covering:

- **Math**: Arithmetic, counting, comparison
- **Vietnamese Language**: Spelling, writing, fill-in-the-blank
- **English**: Vocabulary, stories, pronunciation
- **Memory & Logic**: Memory matching, pattern recognition
- **Life Skills**: Shopping, restaurant, cooking simulations
- **Creative**: Coloring, piano, sticker collection

### Key Features
- ✅ Progressive Web App (PWA) with offline support
- ✅ Mobile-first design optimized for iPad/tablets
- ✅ Audio feedback and Text-to-Speech
- ✅ Reward system (stickers & cartoon videos)
- ✅ Wake lock to prevent screen sleep during gameplay
- ✅ Vietnamese language localization
- ✅ Personalized content featuring family names

### Target Platform
- Primary: iPad/Tablets (landscape orientation)
- Secondary: Modern mobile browsers
- Deployment: Vercel (https://be-gom-vui-hoc.vercel.app)

---

## Architecture & Tech Stack

### Core Technologies
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 5.2.2",
  "build_tool": "Vite 5.2.0",
  "styling": "TailwindCSS 3.4.3 (via CDN)",
  "ai_integration": "@google/genai 1.0.0 (Gemini API)",
  "pwa": "vite-plugin-pwa 1.1.0"
}
```

### Project Type
- **Single Page Application (SPA)** with component-based routing
- **PWA** with service worker for offline capability
- **Client-side rendering** (no SSR/SSG)

### Build Configuration
- **TypeScript**: Strict mode enabled, ES2020 target
- **Module Resolution**: Bundler mode (Vite)
- **Output**: `dist/` directory
- **Dev Server**: Vite dev server on default port

---

## Directory Structure

```
be-gom-vui-hoc/
├── components/           # React game components (35+ games)
│   ├── HomeScreen.tsx   # Main menu
│   ├── MathGame.tsx     # Individual game components
│   ├── ColoringGame.tsx
│   ├── icons.tsx        # SVG icon components
│   └── ...              # 30+ other game components
│
├── data/                # Static game data & content
│   ├── imagePrompts.ts  # Asset metadata & generation prompts
│   ├── mathProblems.ts  # Math problem banks
│   ├── englishLessons.ts
│   ├── restaurantData.ts
│   └── ...              # 15+ data files
│
├── services/            # Business logic & external APIs
│   ├── geminiService.ts # AI content generation (Gemini API)
│   ├── audioService.ts  # Sound effects & music
│   ├── ttsService.ts    # Text-to-speech
│   ├── feedbackService.ts # User feedback
│   └── imageService.ts  # Image handling
│
├── hooks/               # Custom React hooks
│   └── useWakeLock.ts  # Screen wake lock hook
│
├── utils/               # Utility functions
│   └── textUtils.ts    # Text processing utilities
│
├── public/              # Static assets (served as-is)
│   └── assets/
│       ├── images/      # Game images (categorized by game)
│       ├── audio/       # Sound effects & voice files
│       └── videos/      # Reward videos
│
├── App.tsx              # Main app component & routing
├── index.tsx            # React entry point
├── index.html           # HTML entry point
├── types.ts             # TypeScript type definitions
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
├── COLORING_GUIDE.md    # Guide for adding coloring pages
└── CLAUDE.md            # This file
```

### Key File Locations

| Purpose | Location | Description |
|---------|----------|-------------|
| Game Components | `components/*.tsx` | All game UI components |
| Game Data | `data/*.ts` | Static problem banks & content |
| AI Services | `services/geminiService.ts` | Dynamic content generation |
| Type Definitions | `types.ts` | All TypeScript interfaces |
| Main App Logic | `App.tsx` | Routing, state, reward system |
| Asset Metadata | `data/imagePrompts.ts` | Image catalog & prompts |

---

## Key Conventions

### 1. File Naming
- **Components**: PascalCase (e.g., `MathGame.tsx`, `HomeScreen.tsx`)
- **Services/Utils**: camelCase (e.g., `geminiService.ts`, `textUtils.ts`)
- **Data Files**: camelCase (e.g., `mathProblems.ts`, `englishLessons.ts`)
- **Types**: Centralized in `types.ts` (not scattered)
- **Assets**: kebab-case (e.g., `ba-cuong.png`, `xe-cuu-hoa.png`)

### 2. Component Structure
All game components follow this interface:
```typescript
interface GameProps {
  onGoHome: () => void;           // Navigate back to home
  onCorrectAnswer: () => void;    // Trigger reward tracking
  isSoundOn: boolean;             // Audio state
}
```

### 3. Game State Management
- **Global State**: Managed in `App.tsx` using React `useState`
- **Local State**: Each game manages its own level/question state
- **Persistence**: localStorage for unlocked stickers only
- **Routing**: String-based game state (`GameState` type)

### 4. Asset URL Pattern
```typescript
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// Standard pattern:
`${ASSET_BASE_URL}/assets/images/${filename}`

// Game-specific subdirectories:
`${ASSET_BASE_URL}/assets/images/chucai/${filename}`   // Writing game
`${ASSET_BASE_URL}/assets/images/english/${filename}`  // English game
`${ASSET_BASE_URL}/assets/images/khampha/${filename}` // Weather game
`${ASSET_BASE_URL}/assets/images/thoitiet/${filename}` // Time game
`${ASSET_BASE_URL}/assets/images/muasam/${filename}`   // Shopping game
```

### 5. Audio Management
```typescript
import { playSound, stopAllSounds, preloadSounds } from './services/audioService';

// Always check isSoundOn before playing:
playSound('click', isSoundOn);
playSound('correct', isSoundOn);
playSound('incorrect', isSoundOn);

// Stop all sounds when leaving game:
stopAllSounds();
```

### 6. TypeScript Conventions
- **Strict mode**: Enabled (null checks required)
- **Interfaces**: Prefer interfaces over types for objects
- **Enums**: Use string literal unions, not TypeScript enums
- **Props**: Always type component props explicitly
- **Event Handlers**: Use proper event types (React.MouseEvent, etc.)

### 7. Styling Conventions
- **TailwindCSS**: Primary styling method (CDN-based)
- **Responsive**: Mobile-first with iPad optimization
- **Safe Areas**: Use `pt-safe` for notch/status bar
- **Layout**: Use Flexbox/Grid, avoid absolute positioning when possible
- **Colors**: Playful palette (pink, purple, indigo gradients)
- **Font**: Nunito from Google Fonts

---

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Start dev server (localhost:5173 by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create `.env.local` file:
```bash
GEMINI_API_KEY=your_api_key_here
```

### Git Workflow
- **Main branch**: Production-ready code
- **Feature branches**: `claude/claude-md-*` pattern
- **Commits**: Conventional commits format
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation
  - `style:` Formatting/styling
  - `refactor:` Code restructuring

### Common Commands
```bash
# Development
npm run dev              # Start dev server with hot reload

# Build & Deploy
npm run build            # TypeScript compile + Vite build
npm run preview          # Preview production build locally

# The build process:
# 1. TypeScript compilation (tsc)
# 2. Vite bundling
# 3. Output to dist/
```

---

## Code Patterns

### 1. Game Component Template
```typescript
import React, { useState } from 'react';
import { playSound } from '../services/audioService';

interface MyGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

const MyGame: React.FC<MyGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect: boolean) => {
    playSound(isCorrect ? 'correct' : 'incorrect', isSoundOn);
    if (isCorrect) {
      onCorrectAnswer(); // Triggers reward system
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-200 to-purple-200">
      {/* Header with home button */}
      <div className="flex justify-between items-center p-4">
        <button onClick={onGoHome} className="bg-white rounded-full p-3">
          🏠
        </button>
        <span className="text-2xl font-bold">Level {level}</span>
      </div>

      {/* Game content */}
      <div className="flex-grow flex items-center justify-center">
        {/* Your game logic here */}
      </div>
    </div>
  );
};

export default MyGame;
```

### 2. Data File Pattern
```typescript
// data/myGameData.ts
import type { MyGameProblem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const myGameProblemsBank: MyGameProblem[] = [
  {
    id: 'problem_1',
    question: 'Example question?',
    answer: 'correct answer',
    options: ['option1', 'option2', 'option3'],
    imageUrl: `${ASSET_BASE_URL}/assets/images/example.png`
  },
  // More problems...
];
```

### 3. Type Definition Pattern
```typescript
// types.ts - Add new types here
export interface MyGameProblem {
  id: string;
  question: string;
  answer: string | number;
  options: string[];
  imageUrl: string;
}

// Add to GameState union:
export type GameState =
  | 'home'
  | 'math'
  | 'my_game'  // Add your game here
  | ...
```

### 4. Service Pattern
```typescript
// services/myService.ts
export const myFunction = async (param: string): Promise<string> => {
  try {
    // Implementation
    return result;
  } catch (error) {
    console.error('Error in myFunction:', error);
    throw error;
  }
};
```

### 5. Reward System Integration
The app has a built-in reward system in `App.tsx`:
```typescript
const STICKER_REWARD_THRESHOLD = 10; // 10 correct = 1 sticker
const BIG_REWARD_THRESHOLD = 20;     // 20 correct = cartoon video

// Call onCorrectAnswer() in your game component when user answers correctly
// The App component handles reward logic automatically
```

---

## Asset Management

### Image Assets
**Location**: `public/assets/images/`

**Organization**:
- Root: Common assets used across games
- `chucai/`: Writing game assets
- `english/`: English vocabulary images
- `khampha/`: Weather exploration assets
- `thoitiet/`: Time/seasons assets
- `muasam/`: Shopping game assets
- `coloring/`: Coloring page templates

**Naming Convention**:
- Lowercase, kebab-case: `ba-cuong.png`, `mat-troi.png`
- Include tones in Vietnamese names: `meo-huyen.png`, `ca-sac.png`
- Descriptive names: `xe-cuu-hoa.png` (fire truck)

**Image Metadata**:
All assets cataloged in `data/imagePrompts.ts`:
```typescript
export const imagePrompts: ImagePromptItem[] = [
  {
    word: 'GỐM',              // Display name
    filename: 'gom-sac.png',  // Actual filename
    prompt: '...',            // AI generation prompt
    game: 'common'            // Game category
  },
  // 600+ entries...
];
```

### Audio Assets
**Location**: `public/assets/audio/`

**Types**:
- UI sounds: `click.wav`, `correct.wav`, `incorrect.wav`
- Voice instructions: Pre-recorded Vietnamese audio
- Music: Background music (optional)

**Management**: `services/audioService.ts`
- Preloading for performance
- Volume control
- Sound on/off toggle

### Video Assets
**Location**: `public/assets/videos/`
- Reward videos for milestone achievements
- Displayed via `CartoonPlayer` component

---

## Game Development

### Adding a New Game

#### 1. Define Types (`types.ts`)
```typescript
export interface MyGameProblem {
  id: string;
  question: string;
  answer: string;
  // ... other fields
}

// Add to GameState union:
export type GameState = ... | 'my_game' | ...
```

#### 2. Create Data File (`data/myGameData.ts`)
```typescript
import type { MyGameProblem } from '../types';

const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

export const myGameProblemsBank: MyGameProblem[] = [
  // Your problems here
];
```

#### 3. Create Component (`components/MyGame.tsx`)
```typescript
import React, { useState } from 'react';
import { myGameProblemsBank } from '../data/myGameData';
import { playSound } from '../services/audioService';

interface MyGameProps {
  onGoHome: () => void;
  onCorrectAnswer: () => void;
  isSoundOn: boolean;
}

const MyGame: React.FC<MyGameProps> = ({ onGoHome, onCorrectAnswer, isSoundOn }) => {
  // Implementation
};

export default MyGame;
```

#### 4. Register in App (`App.tsx`)
```typescript
// 1. Import component
import MyGame from './components/MyGame';

// 2. Add to renderGame() switch:
case 'my_game': return <MyGame {...gameProps} />;
```

#### 5. Add to Home Screen (`components/HomeScreen.tsx`)
```typescript
// Add button to game grid:
<button
  onClick={() => {
    playSound('click', isSoundOn);
    onSelectGame('my_game');
  }}
  className="game-card-class"
>
  <span className="text-6xl">🎮</span>
  <span className="text-xl font-bold">My Game</span>
</button>
```

### Adding Coloring Pages
See `COLORING_GUIDE.md` for detailed instructions.

**Quick Steps**:
1. Add PNG image to `public/assets/images/coloring/`
2. Update `TEMPLATES` array in `components/ColoringGame.tsx`
3. Test and deploy

---

## Testing & Building

### Development Testing
```bash
# Start dev server
npm run dev

# Open in browser: http://localhost:5173
# Test on mobile: Use ngrok or local network IP
```

### Production Build
```bash
# Build for production
npm run build

# Outputs to: dist/
# Includes: TypeScript compilation + Vite bundling + PWA assets
```

### Testing Checklist
- ✅ All games load without errors
- ✅ Audio plays correctly (with toggle working)
- ✅ Reward system triggers at correct thresholds
- ✅ PWA install prompt appears on mobile
- ✅ Responsive layout on iPad/mobile
- ✅ Correct answer feedback works
- ✅ Home button navigation works
- ✅ Sticker system saves to localStorage

### Build Validation
```bash
# Preview production build locally
npm run preview

# Check for:
# - No console errors
# - Assets load correctly
# - PWA manifest valid
# - Service worker registered
```

---

## Deployment

### Vercel Deployment (Automatic)
The app is configured for automatic deployment on Vercel:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **Vercel Auto-Deploy**:
   - Detects push to main branch
   - Runs `npm run build`
   - Deploys to production URL
   - Usually completes in 1-2 minutes

3. **Production URL**:
   - https://be-gom-vui-hoc.vercel.app

### Environment Variables (Vercel)
Set in Vercel Dashboard → Project Settings → Environment Variables:
- `GEMINI_API_KEY`: Gemini API key for AI features

### PWA Updates
- Service worker updates automatically on deployment
- Users get new version on next app reload
- Uses `autoUpdate` strategy (configured in `vite.config.ts`)

---

## Common Tasks

### Task: Add New Vocabulary Words
**Location**: `data/englishLessons.ts`

```typescript
// 1. Add to vocabulary array in appropriate lesson:
export const englishLessons: EnglishLesson[] = [
  {
    lesson: 1,
    title: "Lesson Title",
    vocabulary: [
      {
        word: "cat",
        vietnamese: "con mèo",
        imageUrl: `${ASSET_BASE_URL}/assets/images/english/cat.png`,
        sentence: "This is a cat.",
        gender: 'neutral'
      },
      // Add new word here...
    ]
  }
];

// 2. Add corresponding image to: public/assets/images/english/
// 3. Test in English Game
```

### Task: Update Math Problem Bank
**Location**: `data/mathProblems.ts`

```typescript
// Add to appropriate level:
export const mathProblemsLevel1: MathProblem[] = [
  { problem: "2 + 3", answer: 5, type: 'calculation' },
  // Add new problem here...
];
```

### Task: Modify Reward Thresholds
**Location**: `App.tsx`

```typescript
// Line 45-47
const STICKER_REWARD_THRESHOLD = 10; // Change this
const BIG_REWARD_THRESHOLD = 20;     // Change this
```

### Task: Add New Sound Effect
**Steps**:
1. Add WAV file to: `public/assets/audio/`
2. Update `types.ts`:
   ```typescript
   export const SOUNDS = ['click', 'correct', 'my_sound', ...] as const;
   ```
3. Update `services/audioService.ts` sound mapping
4. Use in component:
   ```typescript
   playSound('my_sound', isSoundOn);
   ```

### Task: Change Color Theme
**Location**: Component files (Tailwind classes)

Common gradients:
```typescript
// Purple/Pink theme:
className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200"

// Blue theme:
className="bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200"

// Green theme:
className="bg-gradient-to-br from-green-200 via-emerald-200 to-lime-200"
```

### Task: Debug Game Issues
1. **Check browser console**: Look for errors
2. **Verify asset paths**: Check Network tab in DevTools
3. **Test data**: Console.log problem data
4. **Audio issues**: Check `isSoundOn` state propagation
5. **State issues**: Use React DevTools

---

## AI Assistant Guidelines

### When Working on This Project

#### ✅ DO:
- **Read existing code first** before making changes
- **Follow established patterns** (see Code Patterns section)
- **Test locally** after changes (`npm run dev`)
- **Use TypeScript strictly** (no `any` types)
- **Maintain consistency** with existing game structure
- **Check asset paths** are correct before referencing
- **Use proper Vietnamese characters** (tones matter!)
- **Consider mobile/iPad layout** (touch targets, safe areas)
- **Preserve reward system integration** (call `onCorrectAnswer()`)
- **Keep components small** and focused on single game

#### ❌ DON'T:
- **Break existing games** when adding new features
- **Ignore TypeScript errors** during build
- **Hard-code asset URLs** (use `ASSET_BASE_URL` constant)
- **Skip audio toggle checks** (respect `isSoundOn` prop)
- **Use inline styles** (prefer Tailwind classes)
- **Add unnecessary dependencies** (keep bundle small)
- **Forget to update `types.ts`** when adding new game types
- **Bypass the reward system** (affects user experience)
- **Use English text** in UI (Vietnamese only, except English learning games)
- **Create duplicate code** (use existing patterns)

### Code Quality Standards
- **TypeScript**: Strict mode, explicit types, no `any`
- **React**: Functional components, hooks, proper key props
- **Performance**: Lazy load heavy components if needed
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Mobile-first**: Touch-friendly, responsive design
- **Error handling**: Try-catch for async operations, fallbacks
- **Comments**: Explain complex logic, Vietnamese comments OK

### Common Pitfalls
1. **Asset 404 errors**: Wrong path or missing file
2. **Audio not playing**: Missing `isSoundOn` check
3. **Reward not triggering**: Forgot `onCorrectAnswer()` call
4. **Type errors**: Missing interface updates in `types.ts`
5. **Layout breaks**: iPad landscape not considered
6. **Build fails**: TypeScript errors ignored in dev mode

### Testing Your Changes
Before committing:
```bash
# 1. Dev server runs without errors
npm run dev

# 2. Production build succeeds
npm run build

# 3. No TypeScript errors
# 4. Test on mobile device (use ngrok or local IP)
# 5. Check responsive layout at various sizes
# 6. Verify audio works with toggle
# 7. Test reward system (reach thresholds)
```

### Getting Help
- **Code examples**: Look at similar games in `components/`
- **Data structure**: Check `types.ts` for interfaces
- **Asset catalog**: Browse `data/imagePrompts.ts`
- **Styling patterns**: Check `HomeScreen.tsx` for UI examples
- **API usage**: See `services/geminiService.ts` for AI integration

---

## Additional Resources

### External Documentation
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev/guide
- **TailwindCSS**: https://tailwindcss.com/docs
- **Gemini API**: https://ai.google.dev/docs

### Project-Specific Docs
- **COLORING_GUIDE.md**: Adding coloring pages
- **README.md**: Basic setup instructions
- **package.json**: Dependency versions

### Asset Sources
- **Images**: Custom-generated via Gemini + manual uploads
- **Audio**: Pre-recorded Vietnamese voice (family members)
- **Videos**: Curated children's cartoons (Vietnamese)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-11 | Initial release with 25+ games |
| 1.1.0 | 2024-11 | Added coloring game with brush tool |
| 1.1.1 | 2024-11 | iPad landscape optimization |
| Current | 2024-11 | CLAUDE.md documentation added |

---

## Contact & Maintenance

**Project Owner**: Family educational project for Bé Gốm (Minh Khuê)

**Repository**: GitHub repository (inferred from .git directory)

**Deployment**: Vercel (https://be-gom-vui-hoc.vercel.app)

**AI Studio**: https://ai.studio/apps/drive/1Fl_LNdWUeq7741NEq39m1Kh6ex-0dlmn

---

**Last Updated**: November 2024
**Document Version**: 1.0.0
**Maintained By**: AI Assistant (Claude)
