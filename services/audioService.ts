
import { sanitizeFilename } from '../utils/textUtils';
import { generateSpeech } from './ttsService';
import { uiSoundData } from '../data/uiSounds';
import { SOUNDS } from '../types';
import type { SoundName } from '../types';

// --- Constants ---
const ASSET_BASE_URL = 'https://be-gom-vui-hoc.vercel.app';

// Re-export the uiSoundData for use in the ResourceGenerator.
export const soundData = uiSoundData;


// --- Audio Context and Buffer Management ---
export const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const audioBuffers: Partial<Record<SoundName, AudioBuffer>> = {};
const sentenceAudioCache: Record<string, AudioBuffer> = {};

// NEW: Set to track all currently active audio sources to allow for immediate stopping.
const activeSources = new Set<AudioBufferSourceNode | HTMLAudioElement>();

// NEW: Function to stop all playing sounds immediately.
export const stopAllSounds = () => {
    activeSources.forEach(source => {
        try {
            if (source instanceof AudioBufferSourceNode) {
                // For AudioBufferSourceNode, stop() is the method to halt playback.
                source.stop();
            } else if (source instanceof HTMLAudioElement) {
                // For HTMLAudioElement, pause and reset.
                source.pause();
                source.currentTime = 0; // Reset for next play
                // Important: Remove event listeners to prevent memory leaks and incorrect state on stopped elements.
                source.onended = null;
                source.onerror = null;
            }
        } catch (e) {
            // Catch errors, e.g., if a source was already stopped.
            console.error("Error stopping sound source:", e);
        }
    });
    activeSources.clear(); // Clear the set after stopping all sources.
};


// --- Core Audio Functions ---
export function decodeBase64(base64: string): Uint8Array {
    try {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    } catch (e) {
        console.error("Failed to decode base64 string:", e);
        return new Uint8Array(0);
    }
}

export async function decodePcmAudioData(data: Uint8Array): Promise<AudioBuffer> {
    const sampleRate = 24000;
    const numChannels = 1;
    const byteLength = data.byteLength;
    const alignedByteLength = byteLength - (byteLength % 2);
    if (byteLength !== alignedByteLength) {
        console.warn(`Audio data has an odd byte length (${byteLength}). Truncating to ${alignedByteLength}.`);
    }
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, alignedByteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels] / 32768.0;
    }
    return buffer;
}

export function playAudioBuffer(buffer: AudioBuffer | null) {
    if (!buffer || audioContext.state === 'suspended') return;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    // Track the source
    activeSources.add(source);
    source.onended = () => {
        activeSources.delete(source);
    };

    source.start(0);
}

export const preloadSounds = async () => {
    if (audioContext.state === 'suspended') {
        try {
            await audioContext.resume();
        } catch (e) {
            console.error("Audio context could not be resumed.", e);
            return;
        }
    }

    const promises = SOUNDS.map(async (name) => {
        if (audioBuffers[name]) return;
        try {
            const dataUrl = soundData[name];
            const base64String = dataUrl.split(',')[1];
            if (!base64String) throw new Error("Invalid data URL format.");

            const binaryString = window.atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const decodedBuffer = await audioContext.decodeAudioData(bytes.buffer);
            audioBuffers[name] = decodedBuffer;
        } catch (error) {
            console.error(`Failed to load or decode sound: ${name}`, error);
        }
    });

    await Promise.all(promises);
};

export const playSound = (name: SoundName, isSoundOn: boolean) => {
    if (!isSoundOn || audioContext.state === 'suspended') return;
    const buffer = audioBuffers[name];
    if (buffer) {
        playAudioBuffer(buffer);
    } else {
        console.warn(`Sound "${name}" not preloaded or failed to load.`);
        preloadSounds();
    }
};

/**
 * Plays a sequence of pre-generated audio files one after another.
 * Used for constructing sentences from individual words.
 * @param texts An array of words/phrases to play.
 * @param isSoundOn A boolean to conditionally play the sound.
 */
export const playAudioSequence = async (texts: (string | number)[], isSoundOn: boolean): Promise<void> => {
    if (!isSoundOn) return;
    for (const text of texts) {
        if (!text) continue;
        try {
            await speak(String(text), 'vi', isSoundOn);
        } catch (e) {
            console.error('Error in playAudioSequence while playing:', text, e);
        }
    }
};

/**
 * Generates and plays audio for a full sentence using TTS, with caching.
 * @param text The full sentence to speak.
 * @param lang The language of the text.
 * @param isSoundOn A boolean to conditionally play the sound.
 */
export const speakSentence = async (text: string, lang: 'vi' | 'en', isSoundOn: boolean): Promise<void> => {
    if (!isSoundOn || !text) return;

    // Check cache first
    const cacheKey = `${lang}:${text}`;
    if (sentenceAudioCache[cacheKey]) {
        playAudioBuffer(sentenceAudioCache[cacheKey]);
        return;
    }

    try {
        const base64Audio = await generateSpeech(text, lang);
        const pcmBytes = decodeBase64(base64Audio);
        const audioBuffer = await decodePcmAudioData(pcmBytes);

        // Cache the result
        sentenceAudioCache[cacheKey] = audioBuffer;

        playAudioBuffer(audioBuffer);
    } catch (error) {
        console.error(`Failed to generate or play speech for sentence: "${text}"`, error);
    }
};

/**
 * NEW: Plays a full sentence dynamically. It first attempts to play a pre-generated file.
 * If the file doesn't exist or fails to load, it falls back to generating the audio
 * on-the-fly using the TTS service.
 * @param text The full sentence to speak.
 * @param lang The language of the text.
 * @param isSoundOn A boolean to conditionally play the sound.
 */
export const playDynamicSentence = (text: string, lang: 'vi' | 'en', isSoundOn: boolean, game?: 'restaurant' | 'street_food' | 'garden_memory' | 'bunny_rescue' | 'english_story' | 'capybara_rescue' | 'time_adventure' | 'english' | 'online_shopping' | 'weather_explorer' | 'supermarket' | 'writing_practice'): Promise<void> => {
    return new Promise((resolve) => {
        if (!isSoundOn || !text) {
            resolve();
            return;
        }

        const filename = sanitizeFilename(text, 'wav');
        let subfolder = '';
        if (game === 'restaurant') {
            subfolder = 'nhahang/';
        } else if (game === 'street_food') {
            subfolder = 'nauan/';
        } else if (game === 'garden_memory') {
            subfolder = 'khuvuon/';
        } else if (game === 'bunny_rescue') {
            subfolder = 'bantho/';
        } else if (game === 'english_story') {
            subfolder = 'giadinhgom/';
        } else if (game === 'capybara_rescue') {
            subfolder = 'bongbay/';
        } else if (game === 'time_adventure') {
            subfolder = 'thoitiet/';
        } else if (game === 'english') {
            subfolder = 'english/';
        } else if (game === 'online_shopping') {
            subfolder = 'muasam/';
        } else if (game === 'weather_explorer') {
            subfolder = 'khampha/';
        } else if (game === 'supermarket') {
            subfolder = 'sieuthi/';
        } else if (game === 'writing_practice') {
            subfolder = 'chucai/';
        }


        const audioSrc = `${ASSET_BASE_URL}/assets/audio/${subfolder}${filename}`;

        const audio = new Audio(audioSrc);

        // Track the source
        activeSources.add(audio);

        const cleanupAndResolve = () => {
            activeSources.delete(audio);
            // Ensure listeners are removed to prevent calls on stopped elements
            audio.onended = null;
            audio.onerror = null;
            resolve();
        };


        const onAudioError = () => {
            activeSources.delete(audio); // Untrack the failed audio element

            // If the file is missing, we just log it and resolve the promise so the game continues.
            console.warn(`Audio file missing (TTS disabled for performance): ${audioSrc}`);
            resolve();
        };

        audio.onended = cleanupAndResolve;
        audio.onerror = onAudioError;

        // Attempt to play the pre-generated file.
        audio.play().catch(error => {
            // If the initial play() call is rejected (e.g., file not found), fallback.
            onAudioError();
        });
    });
};


// --- Centralized Text-to-Speech Function ---
/**
 * Plays a pre-generated audio file from the assets folder.
 * This is intended for single, atomic sound files like words or short phrases.
 * @param text The text to speak (must match a generated audio file).
 * @param lang The language.
 * @param isSoundOn A boolean to conditionally play the sound.
 */
export const speak = (text: string, lang: 'vi' | 'en', isSoundOn: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!isSoundOn || !text) {
            resolve();
            return;
        }

        try {
            const filename = sanitizeFilename(String(text), 'wav');
            const audioSrc = `${ASSET_BASE_URL}/assets/audio/${filename}`;
            const audio = new Audio(audioSrc);

            // Track the source
            activeSources.add(audio);

            const cleanupAndResolve = () => {
                activeSources.delete(audio);
                // Ensure listeners are removed to prevent calls on stopped elements
                audio.onended = null;
                audio.onerror = null;
                resolve();
            };

            audio.onended = cleanupAndResolve;
            audio.onerror = (e) => {
                console.error(`Could not play audio file: ${audioSrc}`, e);
                cleanupAndResolve(); // Resolve even on error to not break sequence
            };
            audio.play().catch(error => {
                console.error(`Error initiating play for: ${audioSrc}`, error);
                cleanupAndResolve(); // Resolve even on error
            });
        } catch (error) {
            console.error(`Error preparing sound for "${text}":`, error);
            resolve();
        }
    });
};
