
/**
 * Static Image Service
 * Replaces Google Gemini AI image generation with static placeholders.
 * This ensures the app works offline and without API keys.
 */

// A simple 1x1 pixel transparent GIF as a fallback, or we could use a colored placeholder.
// For a better experience, we'll generate a colored SVG placeholder.

const generatePlaceholderSvg = (text: string, color: string) => {
    const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">${text}</text>
    </svg>`;
    return btoa(svg);
};

export const generateImageFromText = async (prompt: string): Promise<string> => {
    console.log(`[Offline Mode] Generating placeholder for prompt: "${prompt}"`);
    // Return a blue placeholder with the prompt text (truncated)
    const shortText = prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt;
    return Promise.resolve(generatePlaceholderSvg(shortText, '#3b82f6')); // Blue-500
};

export const generateImageWithReference = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    console.log(`[Offline Mode] Generating placeholder with reference for prompt: "${prompt}"`);
    // Return a green placeholder
    const shortText = prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt;
    return Promise.resolve(generatePlaceholderSvg(shortText, '#22c55e')); // Green-500
};