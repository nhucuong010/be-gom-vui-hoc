// TTS Service - Production Version (No API)
// Text-to-Speech using browser Web Speech API instead of Gemini API

/**
 * Generates speech from text using the browser's Web Speech API.
 * @param text The text to convert to speech.
 * @param language The language of the text ('en' or 'vi').
 * @returns A promise that resolves when speech is finished or after a timeout.
 */
export const generateSpeech = async (
  text: string,
  language: 'en' | 'vi' = 'en'
): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Use browser Web Speech API (widely supported)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        resolve(); // Silently fail and resolve
      };

      // Start speaking
      speechSynthesis.cancel(); // Clear any pending speech
      speechSynthesis.speak(utterance);

      // Timeout after 30 seconds to avoid hanging
      setTimeout(() => {
        speechSynthesis.cancel();
        resolve();
      }, 30000);
    } catch (error) {
      // Fallback: silently fail
      resolve();
    }
  });
};

/**
 * Stops any currently playing speech
 */
export const stopSpeech = (): void => {
  try {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  } catch (error) {
    // Silently ignore errors
  }
};
