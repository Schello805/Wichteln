import React from 'react';
import Dice from './Dice';
import Timer from './Timer';
import ManualInput from './ManualInput';
import RollHistory from './RollHistory';
import { Dice5 } from 'lucide-react';

interface GameInterfaceProps {
    diceValues: number[];
    isRolling: boolean;
    onRollComplete: () => void;
    handleRoll: () => void;
    rules: Record<number, string>;
    totalValue: number;
    showRule: boolean;
    diceCount: number;
    onManualInput: (value: number) => void;
    history: number[];
    onDismissRule: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({
    diceValues,
    isRolling,
    onRollComplete,
    handleRoll,
    rules,
    totalValue,
    showRule,
    diceCount,
    onManualInput,
    history,
    onDismissRule
}) => {
    return (
        <div className="game-interface">
            <div className="dice-section">
                <div
                    className="dice-container"
                    onClick={handleRoll}
                    style={{ cursor: 'pointer' }}
                    title="Tippen zum Würfeln"
                >
                    {diceValues.map((value, index) => (
                        <Dice
                            key={index}
                            value={value}
                            isRolling={isRolling}
                            onRollComplete={index === diceValues.length - 1 ? onRollComplete : undefined}
                        />
                    ))}
                </div>

                <div className="controls-container">
                    <button
                        className="btn-primary roll-button"
                        onClick={handleRoll}
                        disabled={isRolling}
                    >
                        {isRolling ? 'Würfelt...' : 'Würfeln'}
                        <Dice5 size={24} style={{ marginLeft: '0.5rem' }} />
                    </button>

                    <ManualInput
                        diceCount={diceCount}
                        onManualInput={onManualInput}
                        disabled={isRolling}
                    />
                </div>

                <RollHistory history={history} />
            </div>

            {showRule && (
                <div className="rule-overlay" onClick={onDismissRule}>
                    <div className="rule-content">
                        <div className="rule-number-large">{totalValue}</div>
                        <div className="rule-text-large">
                            {rules[totalValue] || "Keine Regel definiert"}
                        </div>
                        <div className="tap-hint">Tippen zum Fortfahren</div>
                    </div>
                </div>
            )}

            <Timer />
        </div>
    );
};

export default GameInterface;
