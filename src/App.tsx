import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playRollSound, playWinSound } from './utils/audio';
import Dice from './components/Dice';
import RuleCard from './components/RuleCard';
import Timer from './components/Timer';
import SettingsModal from './components/SettingsModal';
import { Gift, Settings, Sun, Moon, RotateCw } from 'lucide-react';
import Snow from './components/Snow';
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

function App() {
  const [diceCount, setDiceCount] = useState<number>(1);
  const [rules, setRules] = useState<Record<number, string>>(DEFAULT_RULES_1_DIE);
  const [diceValues, setDiceValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

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
    if (isRolling) {
      interval = setInterval(() => {
        playRollSound();
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRolling]);

  const totalValue = diceValues.reduce((a, b) => a + b, 0);

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setShowRule(false);

    // Determine result immediately but show after animation
    const newValues = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    setDiceValues(newValues);
  };

  const onRollComplete = () => {
    setIsRolling(false);
    setShowRule(true);

    // Play win sound
    playWinSound();

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Check for Joker in rule text
    const totalValue = diceValues.reduce((a, b) => a + b, 0);
    const currentRule = rules[totalValue] || "";

    if (currentRule.includes("Joker")) {
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
        }}
      />

      <header className="app-header">
        <div className="header-logo">
          <div className="logo-icon">
            <Gift color="white" size={24} />
          </div>
          <h1 className="header-title">Wichtelhelfer</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsRotated(!isRotated)}
            className="settings-btn"
            aria-label="Ansicht drehen"
            style={{ color: isRotated ? 'var(--primary)' : 'inherit' }}
          >
            <RotateCw size={20} />
          </button>

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

      <main
        className={`container app-main ${isRotated ? 'rotated' : ''}`}
        style={{ transition: 'transform 0.5s ease' }}
      >
        <div
          className="dice-container"
          onClick={handleRoll}
          style={{ cursor: 'pointer' }}
        >
          {diceValues.map((val, idx) => (
            <Dice
              key={idx}
              value={val}
              isRolling={isRolling}
              onRollComplete={idx === diceValues.length - 1 ? onRollComplete : undefined}
            />
          ))}
        </div>

        <div className="controls-container">
          <div className="roll-btn-wrapper">
            <button
              className="btn-primary roll-btn"
              onClick={handleRoll}
              disabled={isRolling}
              style={{
                opacity: isRolling ? 0.8 : 1,
                transform: isRolling ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              {isRolling ? 'Würfelt...' : 'Würfeln!'}
            </button>
          </div>

          <RuleCard
            rule={rules[totalValue] || "Keine Regel definiert"}
            number={totalValue}
            isVisible={showRule}
          />

          <Timer />
        </div>
      </main>

      <footer className="app-footer">
        <p>Viel Spaß beim Wichteln!</p>
        <p className="footer-credits">
          Erstellt von M. Schellenberger am 29.11.25 mit "Antigravity" • v1.0.0
        </p>
      </footer>
    </div>
  );
}

export default App;
