// Image Service - Production Version (No API)
// Provides image processing utilities for the game

/**
 * Resizes a base64 encoded image to a maximum width/height, and compresses it.
 * @param base64Url The full data URL of the image (e.g., "data:image/png;base64,...")
 * @param maxWidth The maximum width of the output image.
 * @param maxHeight The maximum height of the output image.
 * @returns A promise that resolves with the base64 data (without the prefix) of the resized image.
 */
export const resizeImage = (base64Url: string, maxWidth = 512, maxHeight = 512): Promise<string> => {
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
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      const base64data = canvas.toDataURL('image/jpeg', 0.7);
      const base64String = base64data.replace(/^data:image\/[a-z]+;base64,/, '');
      resolve(base64String);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

/**
 * Converts a canvas to a blob
 */
export const canvasToBlob = (canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.7): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, type, quality);
  });
};
