import React from 'react';
import { Dice5, Gift, Printer, Settings, Sun, Moon } from 'lucide-react';
import './StartScreen.css';

interface StartScreenProps {
    onSelectMode: (mode: 'classic' | 'pig') => void;
    onOpenPrintables: () => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    onOpenSettings: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSelectMode, onOpenPrintables, theme, toggleTheme, onOpenSettings }) => {
    return (
        <div className="start-screen">
            <div className="start-controls" style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={toggleTheme}
                    className="settings-btn"
                    aria-label="Design wechseln"
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                    onClick={onOpenSettings}
                    className="settings-btn"
                    aria-label="Einstellungen"
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem', borderRadius: '50%', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className="start-header">
                <div className="logo-large">
                    <Gift size={48} color="white" />
                </div>
                <h1>Wichtelhelfer</h1>
                <p>Wähle deine Spielvariante</p>
            </div>

            <div className="mode-cards">
                <div className="mode-card" onClick={() => onSelectMode('classic')}>
                    <div className="card-icon">
                        <Dice5 size={32} />
                    </div>
                    <h2>Klassisches Wichteln</h2>
                    <p>
                        Das bekannte Schrottwichteln. Würfle, um Geschenke zu tauschen,
                        auszupacken oder weiterzugeben. Mit Timer und Chaos-Regeln!
                    </p>
                    <button className="btn-primary">Starten</button>
                </div>

                <div className="mode-card" onClick={() => onSelectMode('pig')}>
                    <div className="card-icon">
                        <span style={{ fontSize: '32px' }}>🐷</span>
                    </div>
                    <h2>Schweinchen töten</h2>
                    <p>
                        Die "Schnecken"-Variante. Bringe 5-10 Geschenke mit.
                        Würfle eine 6, um das nächste Teil aus der Spirale zu nehmen.
                    </p>
                    <button className="btn-primary">Starten</button>
                </div>
            </div>

            <button className="btn-secondary print-btn" onClick={onOpenPrintables}>
                <Printer size={18} />
                Druckvorlagen für Zahlen
            </button>
        </div>
    );
};

export default StartScreen;
