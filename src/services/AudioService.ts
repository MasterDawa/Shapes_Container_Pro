import { useEffect, useRef, useState, useCallback } from 'react';

class AudioService {
  private static instance: AudioService;
  private backgroundMusic: HTMLAudioElement;
  private clickSound: HTMLAudioElement;
  private isMusicPlaying: boolean = false;
  private isLoaded: boolean = false;
  private isSoundEnabled: boolean = true;

  private constructor() {
    this.backgroundMusic = new Audio('/music/background.mp3');
    this.backgroundMusic.loop = true;
    
    this.backgroundMusic.addEventListener('canplaythrough', () => {
      this.isLoaded = true;
      console.log('Background music loaded successfully');
    });

    this.backgroundMusic.addEventListener('error', (e) => {
      console.error('Error loading background music:', e);
    });
    
    this.clickSound = new Audio('/music/click.mp3');
    
    this.clickSound.addEventListener('error', (e) => {
      console.error('Error loading click sound:', e);
    });

    this.clickSound.load();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playClickSound() {
    if (!this.isSoundEnabled) return;

    if (this.clickSound.paused) {
      this.clickSound.currentTime = 0;
      this.clickSound.play().catch(e => {
        if (e.name !== 'NotAllowedError') {
          console.error('Error playing click sound:', e);
        }
      });
    } else {
      const newClick = this.clickSound.cloneNode() as HTMLAudioElement;
      newClick.play().catch(e => {
        if (e.name !== 'NotAllowedError') {
          console.error('Error playing click sound:', e);
        }
      });
    }
  }

  public toggleSound(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  public toggleMusic(enabled: boolean) {
    if (!this.isLoaded) return;

    if (enabled && !this.isMusicPlaying) {
      const playPromise = this.backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing background music:', error);
        });
      }
      this.isMusicPlaying = true;
    } else if (!enabled && this.isMusicPlaying) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isMusicPlaying = false;
    }
  }

  public preloadMusic() {
    this.backgroundMusic.load();
  }
}

export const useAudio = (soundEnabled: boolean, musicEnabled: boolean) => {
  const audioService = useRef(AudioService.getInstance());

  useEffect(() => {
    audioService.current.toggleSound(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioService.current.toggleMusic(musicEnabled);
  }, [musicEnabled]);

  const playClickSound = () => {
    audioService.current.playClickSound();
  };

  return { playClickSound };
};

export default AudioService;