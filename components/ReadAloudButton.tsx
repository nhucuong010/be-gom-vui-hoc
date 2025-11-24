
import React, { useState } from 'react';
import { speak, playAudioSequence, playDynamicSentence } from '../services/audioService';
import { SpeakerIcon, SoundWaveIcon } from './icons';

interface ReadAloudButtonProps {
  text?: string;
  sequence?: (string|number)[];
  isSoundOn: boolean;
  lang?: 'vi' | 'en';
  className?: string;
  game?: 'restaurant' | 'street_food' | 'garden_memory' | 'bunny_rescue' | 'english_story' | 'capybara_rescue' | 'time_adventure' | 'english' | 'online_shopping' | 'weather_explorer' | 'supermarket';
}

const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ text, sequence, isSoundOn, lang, className, game }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || (!text && !sequence)) return;
    setIsLoading(true);
    try {
      if (text) {
        // Use the new dynamic sentence player which falls back to TTS
        await playDynamicSentence(text, lang ?? 'vi', isSoundOn, game);
      } else if (sequence && sequence.length > 0) {
        // Use playAudioSequence for joining multiple pre-generated word files
        await playAudioSequence(sequence, isSoundOn);
      }
    } catch (error) {
      console.error("Failed to speak text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isSoundOn || isLoading || (!text && !sequence)}
      className={`text-sky-500 hover:text-sky-600 active:scale-90 transition-transform disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
      aria-label="Đọc to"
    >
      {isLoading ? <SoundWaveIcon className="w-10 h-10 animate-pulse" /> : <SpeakerIcon className="w-10 h-10" />}
    </button>
  );
};

export default ReadAloudButton;