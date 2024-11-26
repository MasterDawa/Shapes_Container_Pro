import { useEffect, useRef } from 'react';

class AudioService {
  private static instance: AudioService;
  private backgroundMusic: HTMLAudioElement;
  private clickSound: HTMLAudioElement;
  private isMusicPlaying: boolean = false;

  private constructor() {
    this.backgroundMusic = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/win.ogg');
    this.backgroundMusic.loop = true;
    
    this.clickSound = new Audio('https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg');
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playClickSound() {
    if (this.clickSound.paused) {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch(() => {});
    } else {
      const newClick = this.clickSound.cloneNode() as HTMLAudioElement;
      newClick.play().catch(() => {});
    }
  }

  public toggleMusic(enabled: boolean) {
    if (enabled && !this.isMusicPlaying) {
      this.backgroundMusic.play().catch(() => {});
      this.isMusicPlaying = true;
    } else if (!enabled && this.isMusicPlaying) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isMusicPlaying = false;
    }
  }
}

export const useAudio = (soundEnabled: boolean, musicEnabled: boolean) => {
  const audioService = useRef(AudioService.getInstance());

  useEffect(() => {
    audioService.current.toggleMusic(musicEnabled);
  }, [musicEnabled]);

  const playClickSound = () => {
    if (soundEnabled) {
      audioService.current.playClickSound();
    }
  };

  return { playClickSound };
};

export default AudioService;