export const videoEffects = [
    { name: 'Slow Motion', func: (video: HTMLVideoElement) => {
      video.playbackRate = 0.5;
    }},
    { name: 'Fast Forward', func: (video: HTMLVideoElement) => {
      video.playbackRate = 2;
    }},
  ];