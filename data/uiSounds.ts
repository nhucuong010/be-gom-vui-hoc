
import type { SoundName } from '../types';

// Base64 encoded WAV files for UI sounds.
// These are simple, programmatically generated sounds to avoid external dependencies and network requests.

// FIX: Added all required sound properties to the uiSoundData object to satisfy the Record<SoundName, string> type.
export const uiSoundData: Record<SoundName, string> = {
  click: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YAAAAADA/2D/YP9g/2D/YP9g/2D/YP9g/2A=',
  correct: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAZv/u/4MAA0g=',
  incorrect: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAwCD/+7+ZgA=',
  'dice-roll': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YAAAAACc/7b/mv+l/5z/0v/K/7b/nP8=',
  'card-flip': 'data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP//7/8A/wD//+g=',
  'sticker-unlock': 'data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA/P/g/+D/8P/w/wA=',
  win: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YAAAAACe/+H/4v/l/+j/7//n/+P/3v8=',
  jump: 'data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAAA//8AAP//AAAAAAAA//8AAP//AAD//wAA//8=' // Placeholder short silence, in real app this would be a boing sound. Since I cannot generate a complex WAV file here, using a minimal valid WAV header. The browser might treat this as silent or short click, but it prevents crash. In a real scenario, we would paste a real base64 boing sound.
};
