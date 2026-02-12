
/**
 * Utility to optimize and compress video files client-side.
 * Uses MediaRecorder to re-encode video at a lower bitrate.
 */
export async function optimizeVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If the file is already small, just read it as is
    if (file.size < 1.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Create a canvas to draw the video frames (optional, but MediaRecorder captureStream is easier)
      if (!(video as any).captureStream) {
        // Fallback for browsers not supporting captureStream - just use the original if we can't compress
        console.warn('captureStream not supported, using original file.');
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const stream = (video as any).captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 800000 // 800kbps targets a small size
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          URL.revokeObjectURL(url);
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      };

      // Play and record
      video.play().then(() => {
        mediaRecorder.start();
        
        // Stop recording when video ends or after max 10 seconds to ensure 2MB limit
        const maxDuration = Math.min(video.duration, 10);
        setTimeout(() => {
          mediaRecorder.stop();
          video.pause();
        }, maxDuration * 1000);
      }).catch(reject);
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
  });
}
