
import React from 'react';

// FIX: Explicitly type icon components with React.FC to ensure they can accept React's special `key` prop without TypeScript errors.
export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

export const MathIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const AbcIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
  </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V21" />
    </svg>
);

export const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

export const LanguageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.289 7.5 15.5 7.5c1.21 0 2.32-.439 3.166-1.136m0 0V3m-3.166 2.864L21 3m-18 0h12.5A2.5 2.5 0 0115 5.5v1.871a2.5 2.5 0 01-2.5 2.5h-1.25a2.5 2.5 0 01-2.5-2.5V5.5A2.5 2.5 0 0110 3z" />
  </svg>
);

export const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const GearIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.946 1.544l-.412 1.362a1.75 1.75 0 0 1-1.54 1.151l-1.362.412c-.88.247-1.544.929-1.544 1.846v1.846c0 .918.663 1.699 1.544 1.946l1.362.412a1.75 1.75 0 0 1 1.54 1.151l.412 1.362c.247.88.929 1.544 1.846 1.544h1.846c.918 0 1.699-.663 1.946-1.544l.412-1.362a1.75 1.75 0 0 1 1.54-1.151l1.362-.412c.88-.247 1.544-.929 1.544-1.846V9.247c0-.917-.663-1.699-1.544-1.946l-1.362-.412a1.75 1.75 0 0 1-1.54-1.151l-.412-1.362A1.99 1.99 0 0 0 12.922 2.25h-1.846Zm-2.652 9.75a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" clipRule="evenodd" />
    </svg>
);

export const DiceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3.375 3.375C2.339 3.375 1.5 4.214 1.5 5.25v13.5c0 1.036.84 1.875 1.875 1.875h13.5c1.036 0 1.875-.84 1.875-1.875V5.25c0-1.036-.84-1.875-1.875-1.875H3.375ZM9 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm1.5 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm3-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm1.5 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-3 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm1.5 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
    </svg>
);

export const PuzzlePieceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.75 1.5a.75.75 0 0 0-1.5 0v5.333H9.75a.75.75 0 0 0 0 1.5h1.5v1.417A4.502 4.502 0 0 0 9.75 12c-2.485 0-4.5 2.015-4.5 4.5V18a.75.75 0 0 0 1.5 0v-1.5a3 3 0 0 1 3-3h.75a4.5 4.5 0 0 0 4.5-4.5V8.333h1.5a.75.75 0 0 0 0-1.5h-1.5V1.5Z" />
        <path fillRule="evenodd" d="M8.25 12.75a4.5 4.5 0 0 0-4.5 4.5v.75a.75.75 0 0 0 1.5 0v-.75a3 3 0 0 1 3-3h1.5a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
        <path d="M12.75 12.75h-.75a3 3 0 0 0-3 3V18a.75.75 0 0 0 1.5 0v-2.25a1.5 1.5 0 0 1 1.5-1.5h.75a.75.75 0 0 0 0-1.5Z" />
        <path d="M15 9.75a3 3 0 0 1 3-3h.75a.75.75 0 0 0 0-1.5H18a4.5 4.5 0 0 0-4.5 4.5v.75a.75.75 0 0 0 1.5 0v-.75Z" />
        <path fillRule="evenodd" d="M15.75 12.75a.75.75 0 0 0-1.5 0V15a1.5 1.5 0 0 1-1.5 1.5h-2.25a.75.75 0 0 0 0 1.5h2.25a3 3 0 0 0 3-3v-2.25Z" clipRule="evenodd" />
    </svg>
);

export const SpeakerOnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.932l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.807 3.808 3.807 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
        <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
    </svg>
);

export const SpeakerOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.932l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06Z" />
        <path d="M17.28 9.72a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0Z" />
        <path d="M14.72 12.28a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06Z" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.25 3.25-1.5-1.5a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.75-3.75Z" clipRule="evenodd" />
    </svg>
);

export const SoundWaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5h.75m.75 0h.75m.75 0h.75m.75 0h.75M4.5 9v6m1.5-6v6m1.5-6v6m1.5-6v6m1.5-6v6m1.5-6v6M21 10.5h-.75m-.75 0h-.75m-.75 0h-.75m-.75 0h-.75" />
  </svg>
);

export const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 0 0-4.773-4.773L6.75 5.25l-2.472 2.472a3.375 3.375 0 0 0 4.773 4.773L11.42 15.17Z" />
    </svg>
);
// FIX: Add missing FilmIcon component to resolve import error in RewardProgress.tsx.
export const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm-1.5 3a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
        <path d="M8.25 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Zm3.75 0a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Zm3.75 0a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Z" />
    </svg>
);

export const FoodBowlIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        <path fillRule="evenodd" d="M18.75 3.75a2.25 2.25 0 0 0-2.25-2.25h-9a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h2.093a.75.75 0 0 0 .524.22h3.866a.75.75 0 0 0 .524-.22h2.093a2.25 2.25 0 0 0 2.25-2.25v-9Zm-3.75 3a.75.75 0 0 0-1.5 0v.255a.75.75 0 0 1-1.5 0v-.255a.75.75 0 0 0-1.5 0v.255a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 0-1.5 0v.255a2.25 2.25 0 0 0 4.5 0V6.75a.75.75 0 0 0-1.5 0v.255a.75.75 0 0 1-1.5 0v-.255a.75.75 0 0 0-1.5 0Z" clipRule="evenodd" />
        <path d="M5.25 18.375a3.375 3.375 0 0 0 3.375-3.375h6.75a3.375 3.375 0 0 0 3.375 3.375c0 .35-.054.686-.157 1.002H5.407a4.908 4.908 0 0 1-.157-1.002Z" />
    </svg>
);

export const RobotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.5 7.5h-9v9h9v-9Z" />
        <path fillRule="evenodd" d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M5.25 3A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V5.25A2.25 2.25 0 0 0 18.75 3H5.25ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 6.75Zm.75 11.25a.75.75 0 0 0 0-1.5h10.5a.75.75 0 0 0 0 1.5H6.75Z" clipRule="evenodd" />
    </svg>
);

export const StorefrontIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 1.5a.75.75 0 0 1 .75.75V3a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5Z" />
        <path fillRule="evenodd" d="M4.5 4.5a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V7.5a3 3 0 0 0-3-3h-15Zm-1.5 3a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V7.5Z" clipRule="evenodd" />
        <path d="M7.5 15.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Zm3 0a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Zm3 0a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Zm3 0a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z" />
        <path d="M5.25 10.5a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z" />
    </svg>
);

export const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM8.663 5.484a.75.75 0 0 0-1.06 1.06l1.3 1.3a.75.75 0 0 0 1.06-1.06l-1.3-1.3Zm6.737 1.06a.75.75 0 0 0-1.06-1.06l-1.3 1.3a.75.75 0 1 0 1.06 1.06l1.3-1.3ZM12 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 12 6Zm-3 10.992a2.251 2.251 0 0 0 2.228 2.245 2.25 2.25 0 0 0 2.228-2.245 6.252 6.252 0 0 0-4.456 0ZM7.5 12c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5-4.5-2.015-4.5-4.5Z" clipRule="evenodd" />
    </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91a.75.75 0 0 1-1.29 0C8.632 19.17 3 14.532 3 9.447c0-2.828 2.228-5.11 5-5.11 1.487 0 2.872.672 3.845 1.763a5.11 5.11 0 0 1 3.845-1.763c2.772 0 5 2.282 5 5.11 0 5.085-5.632 9.723-7.355 11.463Z" />
    </svg>
);

export const FaceSmileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.975.435-.975.975v.03a.975.975 0 0 0 .975.975h.03a.975.975 0 0 0 .975-.975v-.03a.975.975 0 0 0-.975-.975h-.03ZM12 15a.75.75 0 0 1 .75.75v.03a.75.75 0 0 1-.75.75h-.03a.75.75 0 0 1-.75-.75v-.03a.75.75 0 0 1 .75-.75h.03Zm2.625-5.025c0 .54.435.975.975.975h.03a.975.975 0 0 0 .975-.975v-.03a.975.975 0 0 0-.975-.975h-.03a.975.975 0 0 0-.975.975v.03Z" clipRule="evenodd" />
    <path d="M14.25 15.75a3 3 0 0 0-4.5 0" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.981 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-3.833 2.067-7.172 5.168-8.972a.75.75 0 0 1 .819.162Z" clipRule="evenodd" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3 4.5A2.25 2.25 0 0 1 5.25 2.25h6.14a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 .75.75h3.383c.334 0 .66.124.908.343l1.458 1.25a.75.75 0 0 1-.908 1.156l-1.458-1.25a2.25 2.25 0 0 0-1.816-.693H5.25A2.25 2.25 0 0 1 3 15V4.5Zm12.72 4.03a.75.75 0 0 1 .33 1.018l-2.25 4.5a.75.75 0 0 1-1.356-.676l2.25-4.5a.75.75 0 0 1 1.026-.342Zm3-1.03a.75.75 0 1 1-1.06-1.06l3 3a.75.75 0 1 1-1.06 1.06l-3-3Z" clipRule="evenodd" />
        <path d="M16.703 6.203a.75.75 0 0 1 .33 1.018l-2.25 4.5a.75.75 0 0 1-1.356-.676l2.25-4.5a.75.75 0 0 1 1.026-.342ZM21 4.5A2.25 2.25 0 0 0 18.75 2.25h-6.14a.75.75 0 0 0 0 1.5h6.14a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-3.383c-.334 0-.66.124-.908.343l-1.458 1.25a.75.75 0 0 0 .908 1.156l1.458-1.25a2.25 2.25 0 0 1 1.816-.693h3.383A2.25 2.25 0 0 0 21 15V4.5Z" />
    </svg>
);

// NEW ICONS FOR STICKER BOOK V2
export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

export const ArrowsPointingOutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

export const ArrowsPointingInIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
    </svg>
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-1.946m0-5.992V6a3.47 3.47 0 0 0-3.47 3.47v.882M12 10.062a3.47 3.47 0 0 1 3.47 3.47v.882m-6.94 0h6.94m-6.94 0A3.47 3.47 0 0 0 12 18m0 0a3.47 3.47 0 0 1 3.47-3.47m-9.82-4.07a3.47 3.47 0 0 1 4.9 0m8.84 0a3.47 3.47 0 0 1 4.9 0M12 2.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.64 4.36a.75.75 0 0 1 1.06 1.06l-.53.53a.75.75 0 0 1-1.06-1.06l.53-.53Zm10.72 0a.75.75 0 0 1 1.06 0l.53.53a.75.75 0 1 1-1.06 1.06l-.53-.53a.75.75 0 0 1 0-1.06Z" />
    </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
    </svg>
);

export const ArrowUturnLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);

export const PencilSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);
