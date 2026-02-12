
/**
 * Utility to optimize and compress video files client-side.
 * Uses MediaRecorder to re-encode video at a lower bitrate for 100% fast loading.
 */
export async function optimizeVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If the file is already small (under 1MB), just read it as is for speed
    if (file.size < 1.0 * 1024 * 1024) {
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
      if (!(video as any).captureStream) {
        console.warn('captureStream not supported, using original file.');
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const stream = (video as any).captureStream();
      // Target 500kbps for EXTREME fast loading speed (Approx 500KB for 10 seconds)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 500000 
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

      // Play and record quickly
      video.play().then(() => {
        mediaRecorder.start();
        
        // Stop recording after max 8 seconds to ensure speed and small footprint
        const maxDuration = Math.min(video.duration, 8);
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            video.pause();
          }
        }, maxDuration * 1000);
      }).catch(reject);
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
  });
}
