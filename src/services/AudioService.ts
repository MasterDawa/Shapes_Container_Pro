import { useEffect, useRef, useState, useCallback } from 'react';

class AudioService {
  private static instance: AudioService;
  private backgroundMusic: HTMLAudioElement;
  private clickSound: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private isLoaded: boolean = false;
  private isSoundEnabled: boolean = false;
  private userInteracted: boolean = false;

  private constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
    }

    this.backgroundMusic = new Audio('/music/background.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    
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

    this.preloadAudio();
    
    document.addEventListener('click', () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        this.handleFirstInteraction();
      }
    }, { once: true });
  }

  private preloadAudio() {
    try {
      this.clickSound.load();
      this.backgroundMusic.load();
    } catch (error) {
      console.error('Error preloading audio:', error);
    }
  }

  private handleFirstInteraction() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume().catch(error => {
        console.error('Error resuming audio context:', error);
      });
    }
    
    const savedSoundEnabled = localStorage.getItem('soundEnabled') === 'true';
    const savedMusicEnabled = localStorage.getItem('musicEnabled') === 'true';
    
    this.toggleSound(savedSoundEnabled);
    this.toggleMusic(savedMusicEnabled);
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playClickSound() {
    if (!this.isSoundEnabled || !this.userInteracted) return;

    try {
      if (this.clickSound.paused) {
        this.clickSound.currentTime = 0;
        const playPromise = this.clickSound.play();
        if (playPromise) {
          playPromise.catch(e => {
            if (e.name !== 'NotAllowedError') {
              console.error('Error playing click sound:', e);
            }
          });
        }
      } else {
        const newClick = this.clickSound.cloneNode() as HTMLAudioElement;
        const playPromise = newClick.play();
        if (playPromise) {
          playPromise.catch(e => {
            if (e.name !== 'NotAllowedError') {
              console.error('Error playing click sound:', e);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }

  public toggleSound(enabled: boolean) {
    this.isSoundEnabled = enabled;
    localStorage.setItem('soundEnabled', enabled.toString());
    
    if (!enabled) {
      this.clickSound.pause();
      this.clickSound.currentTime = 0;
    }
  }

  public toggleMusic(enabled: boolean) {
    if (!this.isLoaded || !this.userInteracted) return;

    try {
      if (enabled && !this.isMusicPlaying) {
        const playPromise = this.backgroundMusic.play();
        if (playPromise) {
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
      
      localStorage.setItem('musicEnabled', enabled.toString());
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  }

  public getState() {
    return {
      isSoundEnabled: this.isSoundEnabled,
      isMusicPlaying: this.isMusicPlaying,
      userInteracted: this.userInteracted
    };
  }
}

export const useAudio = (soundEnabled: boolean, musicEnabled: boolean) => {
  const audioService = useRef(AudioService.getInstance());
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      audioService.current.toggleSound(soundEnabled);
    }
  }, [soundEnabled, hasInteracted]);

  useEffect(() => {
    if (hasInteracted) {
      audioService.current.toggleMusic(musicEnabled);
    }
  }, [musicEnabled, hasInteracted]);

  const playClickSound = useCallback(() => {
    audioService.current.playClickSound();
  }, []);

  return { playClickSound };
};

export default AudioService;