// Previous imports remain the same...

export function useGameState() {
  // Previous state declarations remain the same...
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  // Save sound preferences
  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  // Rest of the hook implementation remains the same...

  return {
    // Previous returns remain the same...
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
  };
}