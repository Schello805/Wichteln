import React from 'react';

interface RollHistoryProps {
    history: number[];
}

const RollHistory: React.FC<RollHistoryProps> = ({ history }) => {
    if (history.length === 0) return null;

    return (
        <div className="history-container">
            <span className="history-label">
                Verlauf
            </span>
            <div className="history-grid">
                {history.map((roll, idx) => (
                    <div
                        key={idx}
                        className={`history-item ${idx === 0 ? 'active' : ''}`}
                    >
                        {roll}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RollHistory;
