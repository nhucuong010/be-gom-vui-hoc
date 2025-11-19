import { GoogleGenAI, Modality } from "@google/genai";

// This service is dedicated to interacting with the Gemini TTS API.

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates speech from text using the Gemini TTS API.
 * @param text The text to convert to speech.
 * @param language The language of the text ('en' or 'vi').
 * @param retries The number of times to retry on failure.
 * @returns A promise that resolves to the base64 encoded audio string.
 */
export const generateSpeech = async (text: string, language: 'en' | 'vi' = 'en', retries = 3): Promise<string> => {
    for (let i = 0; i < retries; i++) {
        try {
            const voiceName = language === 'vi' ? 'Kore' : 'Zephyr';
            // Append a period to the end of the text if one isn't present.
            // This helps the TTS model recognize phrases like math equations
            // as complete sentences, improving the reliability of audio generation.
            const prompt = text.trim().match(/[.?!]$/) ? text.trim() : `${text.trim()}.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voiceName },
                        },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                return base64Audio;
            }
            console.warn(`Attempt ${i + 1} for "${text}" returned no audio. Full response:`, JSON.stringify(response, null, 2));
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for "${text}":`, error);
            if (i === retries - 1) {
                throw error;
            }
        }
    }
    throw new Error(`Failed to generate speech for "${text}" after ${retries} attempts: No audio data.`);
};