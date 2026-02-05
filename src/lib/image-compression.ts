
/**
 * Utility to compress and resize images on the client side before uploading.
 * Optimized for ultra-fast loading (approx 10-20KB per image).
 */
export async function compressImage(file: File, maxWidth: number = 450, maxHeight: number = 450): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas Context Error'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Ultra-aggressive compression (0.35) for instant paints even with 10k images
        // This ensures the site remains "Super Fast" regardless of volume.
        const dataUrl = canvas.toDataURL('image/jpeg', 0.35);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
