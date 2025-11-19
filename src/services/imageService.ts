import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Resizes a base64 encoded image to a maximum width/height, and compresses it.
 * @param base64Url The full data URL of the image (e.g., "data:image/png;base64,...").
 * @param maxWidth The maximum width of the output image.
 * @param maxHeight The maximum height of the output image.
 * @returns A promise that resolves with the base64 data (without the prefix) of the resized JPEG image.
 */
const resizeImage = (base64Url: string, maxWidth = 512, maxHeight = 512): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Calculate the new dimensions to maintain aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context"));
            }
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to JPEG for high compression and remove the data URL prefix
            resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
        };
        img.onerror = (error) => {
            console.error("Failed to load image for resizing:", error);
            // Reject if the image can't be loaded
            reject(new Error("Image loading error for resizing"));
        };
    });
};


const processImageResponse = (response: GenerateContentResponse): string => {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("API returned no image data in parts.");
};

export const generateImageFromText = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const rawPngData = processImageResponse(response);
        // The API returns raw PNG data, so we create a full data URL to load it for resizing
        const fullPngUrl = `data:image/png;base64,${rawPngData}`;
        const resizedJpegData = await resizeImage(fullPngUrl);
        return resizedJpegData;
    } catch (error) {
        console.error("Failed to generate and resize image from text:", error);
        throw error;
    }
};

export const generateImageWithReference = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const rawPngData = processImageResponse(response);
        const fullPngUrl = `data:image/png;base64,${rawPngData}`;
        const resizedJpegData = await resizeImage(fullPngUrl);
        return resizedJpegData;
    } catch (error) {
        console.error("Failed to generate and resize image with reference:", error);
        throw error;
    }
};