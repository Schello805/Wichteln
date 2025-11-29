import { useState, useEffect } from 'react';
import Dice from './components/Dice';
import RuleCard from './components/RuleCard';
import Timer from './components/Timer';
import SettingsModal from './components/SettingsModal';
import { Gift, Settings } from 'lucide-react';
import Snow from './components/Snow';

// Default rules for Schrottwichteln (1 Die)
const DEFAULT_RULES_1_DIE: Record<number, string> = {
  1: "Tausche mit dem jüngsten Spieler!",
  2: "Tausche mit dem linken Nachbarn!",
  3: "Tausche mit dem rechten Nachbarn!",
  4: "Tausche mit dem ältesten Spieler!",
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const totalValue = diceValues.reduce((a, b) => a + b, 0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
  };

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
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      <header style={{
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--card-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--primary)',
            padding: '0.5rem',
            borderRadius: '8px',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <Gift color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Schrottwichteln</h1>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            padding: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="container" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem',
        paddingTop: '2rem',
        paddingBottom: '4rem'
      }}>

        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          gap: diceCount > 1 ? '4rem' : '0',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {diceValues.map((val, idx) => (
            <Dice
              key={idx}
              value={val}
              isRolling={isRolling}
              onRollComplete={idx === diceValues.length - 1 ? onRollComplete : undefined}
            />
          ))}
        </div>

        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleRoll}
              disabled={isRolling}
              style={{
                fontSize: '1.25rem',
                padding: '1rem 3rem',
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

      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        borderTop: '1px solid var(--card-border)'
      }}>
        <p>Viel Spaß beim Wichteln!</p>
      </footer>
    </div>
  );
}

export default App;
