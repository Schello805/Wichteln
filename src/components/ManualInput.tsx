import React from 'react';

interface ManualInputProps {
    diceCount: number;
    onManualInput: (value: number) => void;
    disabled: boolean;
}

const ManualInput: React.FC<ManualInputProps> = ({ diceCount, onManualInput, disabled }) => {
    const getButtons = () => {
        if (diceCount === 1) {
            return Array.from({ length: 6 }, (_, i) => i + 1);
        }
        // For 2 dice, sums are 2 to 12
        return Array.from({ length: 11 }, (_, i) => i + 2);
    };

    const buttons = getButtons();

    return (
        <div className="manual-input-container">
            <p className="manual-input-label">Oder Augenzahl wählen:</p>
            <div className="manual-input-grid">
                {buttons.map((num) => (
                    <button
                        key={num}
                        onClick={() => onManualInput(num)}
                        disabled={disabled}
                        className="manual-input-btn"
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ManualInput;
