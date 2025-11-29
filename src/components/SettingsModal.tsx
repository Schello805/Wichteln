import React from 'react';
import { X, Save, RotateCcw, Moon, Sun } from 'lucide-react';
import './SettingsModal.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    rules: Record<number, string>;
    onUpdateRules: (newRules: Record<number, string>) => void;
    diceCount: number;
    onUpdateDiceCount: (count: number) => void;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

const DEFAULT_RULES_1_DIE: Record<number, string> = {
    1: "Tausche mit dem jüngsten Spieler!",
    2: "Tausche mit dem linken Nachbarn!",
    3: "Tausche mit dem rechten Nachbarn!",
    4: "Tausche mit dem ältesten Spieler!",
    5: "Alle geben ihr Geschenk nach links!",
    6: "Joker! Tausche mit wem du willst (oder nicht)."
};

const DEFAULT_RULES_2_DICE: Record<number, string> = {
    2: "Jeder gibt sein Geschenk nach rechts",
    3: "Tausche mit dem 3. Spieler zu deiner Linken",
    4: "Alle Geschenke werden neu verteilt",
    5: "Tausche mit einem Spieler deiner Wahl",
    6: "Tausche mit dem Spieler, der dir gegenüber sitzt",
    7: "Tausche mit dem Spieler, der am lautesten lacht",
    8: "Alle geben ihr Geschenk nach links",
    9: "Tausche mit dem 3. Spieler zu deiner Rechten",
    10: "Du musst ein Weihnachtslied singen (und darfst tauschen)",
    11: "Tausche das Geschenk mit dem, der am weitesten weg sitzt",
    12: "Joker! Bestimme eine Regel für diese Runde"
};

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    rules,
    onUpdateRules,
    diceCount,
    onUpdateDiceCount,
    theme,
    onToggleTheme
}) => {
    if (!isOpen) return null;

    const handleDiceCountChange = (count: number) => {
        onUpdateDiceCount(count);
        const currentKeys = Object.keys(rules).map(Number);
        const isMode1 = count === 1;

        if (isMode1 && !currentKeys.includes(1)) {
            onUpdateRules(DEFAULT_RULES_1_DIE);
        } else if (!isMode1 && !currentKeys.includes(7)) {
            onUpdateRules(DEFAULT_RULES_2_DICE);
        }
    };

    const handleRuleChange = (num: number, text: string) => {
        onUpdateRules({
            ...rules,
            [num]: text
        });
    };

    const resetRules = () => {
        if (diceCount === 1) {
            onUpdateRules(DEFAULT_RULES_1_DIE);
        } else {
            onUpdateRules(DEFAULT_RULES_2_DICE);
        }
    };

    const range = diceCount === 1 ? [1, 2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return (
        <div className="settings-overlay">
            <div className="glass-panel settings-modal" style={{ background: 'var(--card-bg)' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        color: 'var(--text-muted)'
                    }}
                >
                    <X />
                </button>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                    <Save size={24} className="text-primary" />
                    Einstellungen
                </h2>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Design</label>
                    <button
                        onClick={onToggleTheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--text-main)',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        {theme === 'dark' ? 'Dunkler Modus' : 'Heller Modus'}
                    </button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Anzahl Würfel</label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            className={diceCount === 1 ? 'btn-primary' : ''}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '8px',
                                background: diceCount === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                flex: 1,
                                justifyContent: 'center',
                                color: diceCount === 1 ? 'white' : 'var(--text-main)'
                            }}
                            onClick={() => handleDiceCountChange(1)}
                        >
                            1 Würfel
                        </button>
                        <button
                            className={diceCount === 2 ? 'btn-primary' : ''}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '8px',
                                background: diceCount === 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                flex: 1,
                                justifyContent: 'center',
                                color: diceCount === 2 ? 'white' : 'var(--text-main)'
                            }}
                            onClick={() => handleDiceCountChange(2)}
                        >
                            2 Würfel
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 600, color: 'var(--text-main)' }}>Regeln bearbeiten</label>
                        <button
                            onClick={resetRules}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                color: 'var(--text-muted)',
                                background: 'transparent'
                            }}
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {range.map(num => (
                            <div key={num} className="settings-input-group">
                                <div className="settings-number-badge" style={{ color: 'var(--text-main)' }}>
                                    {num}
                                </div>
                                <input
                                    type="text"
                                    value={rules[num] || ''}
                                    onChange={(e) => handleRuleChange(num, e.target.value)}
                                    placeholder="Keine Aktion"
                                    className="settings-input"
                                    style={{
                                        background: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.2)',
                                        borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                        color: 'var(--text-main)'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn-primary"
                        onClick={onClose}
                        style={{ padding: '0.75rem 2rem', width: '100%', justifyContent: 'center' }}
                    >
                        Fertig
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
