import React from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import './SettingsModal.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    rules: Record<number, string>;
    onUpdateRules: (newRules: Record<number, string>) => void;
    diceCount: number;
    onUpdateDiceCount: (count: number) => void;
}

const DEFAULT_RULES_1_DIE: Record<number, string> = {
    1: "Geschenk auspacken! (Oder behalten)",
    2: "Tausche mit dem linken Nachbarn!",
    3: "Tausche mit dem rechten Nachbarn!",
    4: "Tausche mit einem beliebigen Spieler!",
    5: "Alle geben ihr Geschenk nach links!",
    6: "Joker! Tausche mit wem du willst (oder nicht)."
};

const DEFAULT_RULES_2_DICE: Record<number, string> = {
    2: "Jeder gibt sein Geschenk nach rechts",
    3: "Tausche mit dem 3. Spieler zu deiner Linken",
    4: "Alle Geschenke werden neu verteilt",
    5: "Tausche mit einem Spieler deiner Wahl",
    6: "Geschenk auspacken",
    7: "Nichts passiert (Glück gehabt!)",
    8: "Alle geben ihr Geschenk nach links",
    9: "Tausche mit dem 3. Spieler zu deiner Rechten",
    10: "Du musst ein Weihnachtslied singen",
    11: "Tausche das Geschenk mit dem, der am weitesten weg sitzt",
    12: "Joker! Bestimme eine Regel für diese Runde"
};

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    rules,
    onUpdateRules,
    diceCount,
    onUpdateDiceCount
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
            <div className="glass-panel settings-modal">
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

                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={24} className="text-primary" />
                    Einstellungen
                </h2>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Anzahl Würfel</label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            className={diceCount === 1 ? 'btn-primary' : ''}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '8px',
                                background: diceCount === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                flex: 1,
                                justifyContent: 'center'
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
                                justifyContent: 'center'
                            }}
                            onClick={() => handleDiceCountChange(2)}
                        >
                            2 Würfel
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Vorlagen</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => onUpdateRules(diceCount === 1 ? DEFAULT_RULES_1_DIE : DEFAULT_RULES_2_DICE)}
                            style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => {
                                if (diceCount === 1) {
                                    onUpdateRules({
                                        1: "Alle singen 'Jingle Bells'",
                                        2: "Tausche mit Mama/Papa",
                                        3: "Erzähle einen Witz",
                                        4: "Mache 3 Hampelmänner",
                                        5: "Umarme deinen Nachbarn",
                                        6: "Joker! Such dir ein Geschenk aus"
                                    });
                                } else {
                                    // Kids 2 dice logic placeholder
                                    onUpdateRules(DEFAULT_RULES_2_DICE);
                                }
                            }}
                            style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                            Kinder
                        </button>
                        <button
                            onClick={() => {
                                if (diceCount === 1) {
                                    onUpdateRules({
                                        1: "Alle tauschen nach links!",
                                        2: "Alle tauschen nach rechts!",
                                        3: "Tausche mit gegenüber",
                                        4: "Alle Geschenke in die Mitte!",
                                        5: "Würfel nochmal",
                                        6: "Joker! Bestimme alles!"
                                    });
                                } else {
                                    onUpdateRules(DEFAULT_RULES_2_DICE);
                                }
                            }}
                            style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                            Chaos
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--secondary)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>
                    💡 <strong>Tipp:</strong> Wenn du "(Joker)" oder "Joker" in den Regeltext schreibst, gibt es beim Würfeln einen Konfetti-Effekt! 🎉
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 600 }}>Regeln bearbeiten</label>
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
                                <div className="settings-number-badge">
                                    {num}
                                </div>
                                <input
                                    type="text"
                                    value={rules[num] || ''}
                                    onChange={(e) => handleRuleChange(num, e.target.value)}
                                    placeholder="Keine Aktion"
                                    className="settings-input"
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
