import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playRollSound, playWinSound } from './utils/audio';
import SettingsModal from './components/SettingsModal';
import StartScreen from './components/StartScreen';
import PrintableNumbers from './components/PrintableNumbers';
import { Gift, Settings, Sun, Moon, RotateCw, Split, ArrowLeft, Github } from 'lucide-react';
import Snow from './components/Snow';
import GameInterface from './components/GameInterface';
import './App.css';

// Default rules for Schrottwichteln (1 Die)
const DEFAULT_RULES_1_DIE: Record<number, string> = {
  1: "Geschenk auspacken! (Oder behalten)",
  2: "Tausche mit dem linken Nachbarn!",
  3: "Tausche mit dem rechten Nachbarn!",
  4: "Tausche mit einem beliebigen Spieler!",
  5: "Alle geben ihr Geschenk nach links!",
  6: "Joker! Tausche mit wem du willst (oder nicht)."
};

// Rules for Schweinchen töten
const PIG_RULES: Record<number, string> = {
  1: "Nichts passiert. Weitergeben.",
  2: "Nichts passiert. Weitergeben.",
  3: "Nichts passiert. Weitergeben.", // Can be swapped in advanced mode
  4: "Nichts passiert. Weitergeben.",
  5: "Nichts passiert. Weitergeben.",
  6: "Nimm das nächste Teil aus der Schnecke! (Geschenk sofort auspacken)"
};

const PIG_RULES_ADVANCED: Record<number, string> = {
  ...PIG_RULES,
  3: "Tausche ein Geschenk deiner Wahl!"
};

type GameMode = 'classic' | 'pig' | null;

function App() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [showPrintables, setShowPrintables] = useState(false);

  const [diceCount, setDiceCount] = useState<number>(1);
  const [rules, setRules] = useState<Record<number, string>>(DEFAULT_RULES_1_DIE);
  const [diceValues, setDiceValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);

  // New Features
  const [history, setHistory] = useState<number[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Sound loop effect
  useEffect(() => {
    let interval: any;
    if (isRolling && isSoundEnabled) {
      interval = setInterval(() => {
        playRollSound();
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRolling, isSoundEnabled]);

  const totalValue = diceValues.reduce((a, b) => a + b, 0);

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setShowRule(false);

    // Determine result immediately but show after animation
    const newValues = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    setDiceValues(newValues);
  };

  const handleManualInput = (value: number) => {
    if (isRolling) return;

    // For manual input, we set the dice to match the sum if possible, or just random if it's complicated
    // For 1 die, it's exact. For 2 dice, we try to find a pair.
    let newValues: number[] = [];

    if (diceCount === 1) {
      newValues = [value];
    } else {
      // Find a random pair that sums to value
      // Possible range for each die: 1-6
      const possiblePairs: [number, number][] = [];
      for (let i = 1; i <= 6; i++) {
        const remainder = value - i;
        if (remainder >= 1 && remainder <= 6) {
          possiblePairs.push([i, remainder]);
        }
      }

      if (possiblePairs.length > 0) {
        const pair = possiblePairs[Math.floor(Math.random() * possiblePairs.length)];
        newValues = pair;
      } else {
        // Fallback (should not happen if input is valid 2-12)
        newValues = Array(diceCount).fill(1);
      }
    }

    setDiceValues(newValues);
    // Trigger completion logic immediately
    onRollComplete(newValues);
  };

  const onRollComplete = (values: number[] = diceValues) => {
    setIsRolling(false);
    setShowRule(true);

    // Play win sound
    if (isSoundEnabled) {
      playWinSound();
    }

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Check for Joker in rule text
    const currentTotal = values.reduce((a, b) => a + b, 0);
    const currentRule = rules[currentTotal] || "";

    // Update History (keep last 5)
    setHistory(prev => [currentTotal, ...prev].slice(0, 5));

    if (currentRule.includes("Joker") || (gameMode === 'pig' && currentTotal === 6)) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#10b981', '#ffffff']
      });
    }
  };

  // Wake Lock
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock error:', err);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (wakeLock) wakeLock.release();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const [isPigAdvanced, setIsPigAdvanced] = useState(false);

  const handleModeSelect = (mode: 'classic' | 'pig') => {
    setGameMode(mode);
    setHistory([]);
    if (mode === 'pig') {
      setDiceCount(1);
      setRules(isPigAdvanced ? PIG_RULES_ADVANCED : PIG_RULES);
    } else {
      setDiceCount(1);
      setRules(DEFAULT_RULES_1_DIE);
    }
  };

  // Update rules when advanced toggle changes
  useEffect(() => {
    if (gameMode === 'pig') {
      setRules(isPigAdvanced ? PIG_RULES_ADVANCED : PIG_RULES);
    }
  }, [isPigAdvanced, gameMode]);

  const gameInterfaceProps = {
    diceValues,
    isRolling,
    onRollComplete: () => onRollComplete(),
    handleRoll,
    rules,
    totalValue,
    showRule,
    diceCount,
    onManualInput: handleManualInput,
    history,
    onDismissRule: () => setShowRule(false)
  };

  const Footer = () => (
    <footer className="app-footer">
      <div className="footer-content">
        <p>Viel Spaß beim Wichteln!</p>

        <div className="footer-links" style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/Schello805/Wichteln"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}
          >
            <Github size={16} />
            <span>Open Source</span>
          </a>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ opacity: 0.8 }}>Mit KI erstellt</span>
        </div>

        <div className="legal-info" style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Impressum:</strong> Michael Schellenberger, <a href="mailto:info@schellenberger.biz" style={{ color: 'inherit' }}>info@schellenberger.biz</a>
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <a href="/DATENSCHUTZ.md" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>Datenschutzerklärung</a>
          </p>
        </div>

        <p className="footer-credits" style={{ fontSize: '0.75rem', opacity: 0.5 }}>
          v1.2.0 • © {new Date().getFullYear()} M. Schellenberger
        </p>
      </div>
    </footer>
  );

  if (showPrintables) {
    return <PrintableNumbers onClose={() => setShowPrintables(false)} />;
  }

  if (!gameMode) {
    return (
      <div className="app-container">
        <Snow />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          rules={rules}
          onUpdateRules={setRules}
          diceCount={diceCount}
          onUpdateDiceCount={(count) => {
            setDiceCount(count);
            // Reset dice visuals when changing count
            setDiceValues(Array(count).fill(1));
            setShowRule(false);
            setHistory([]); // Reset history on mode change
            if (gameMode === 'pig') {
              setRules(isPigAdvanced ? PIG_RULES_ADVANCED : PIG_RULES);
            } else {
              setRules(DEFAULT_RULES_1_DIE);
            }
          }}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
          gameMode={gameMode}
          isPigAdvanced={isPigAdvanced}
          onTogglePigAdvanced={() => setIsPigAdvanced(!isPigAdvanced)}
        />
        <StartScreen
          onSelectMode={handleModeSelect}
          onOpenPrintables={() => setShowPrintables(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Snow />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        rules={rules}
        onUpdateRules={setRules}
        diceCount={diceCount}
        onUpdateDiceCount={(count) => {
          setDiceCount(count);
          // Reset dice visuals when changing count
          setDiceValues(Array(count).fill(1));
          setShowRule(false);
          setHistory([]); // Reset history on mode change
          if (gameMode === 'pig') {
            setRules(isPigAdvanced ? PIG_RULES_ADVANCED : PIG_RULES);
          } else {
            setRules(DEFAULT_RULES_1_DIE);
          }
        }}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        gameMode={gameMode}
        isPigAdvanced={isPigAdvanced}
        onTogglePigAdvanced={() => setIsPigAdvanced(!isPigAdvanced)}
      />

      <header className="app-header">
        <div className="header-logo" onClick={() => setGameMode(null)} style={{ cursor: 'pointer' }}>
          <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
          <div className="logo-icon">
            <Gift color="white" size={24} />
          </div>
          <h1 className="header-title">
            {gameMode === 'pig' ? 'Schweinchen töten' : 'Wichtelhelfer'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setIsSplitView(!isSplitView);
              setIsRotated(false); // Reset rotation when entering split view
            }}
            className="settings-btn"
            aria-label="Split Screen"
            style={{ color: isSplitView ? 'var(--primary)' : 'inherit' }}
          >
            <Split size={20} />
          </button>

          {!isSplitView && (
            <button
              onClick={() => setIsRotated(!isRotated)}
              className="settings-btn"
              aria-label="Ansicht drehen"
              style={{ color: isRotated ? 'var(--primary)' : 'inherit' }}
            >
              <RotateCw size={20} />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="settings-btn"
            aria-label="Design wechseln"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="settings-btn"
            aria-label="Einstellungen"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {isSplitView ? (
        <main className="container app-main split-view">
          <div className="split-section rotated">
            <GameInterface {...gameInterfaceProps} />
          </div>
          <div className="split-section">
            <GameInterface {...gameInterfaceProps} />
          </div>
        </main>
      ) : (
        <main
          className={`container app-main ${isRotated ? 'rotated' : ''}`}
          style={{ transition: 'transform 0.5s ease' }}
        >
          <GameInterface {...gameInterfaceProps} />
        </main>
      )}
    </div>
  );
}

export default App;
