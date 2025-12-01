import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import './PrintableNumbers.css';

interface PrintableNumbersProps {
    onClose: () => void;
}

const PrintableNumbers: React.FC<PrintableNumbersProps> = ({ onClose }) => {
    const [maxNumber, setMaxNumber] = useState<number>(30);

    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="printable-overlay">
            <div className="printable-modal no-print">
                <div className="printable-header">
                    <h2>Druckvorlagen</h2>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="printable-controls">
                    <label>
                        Anzahl Geschenke:
                        <select
                            value={maxNumber}
                            onChange={(e) => setMaxNumber(Number(e.target.value))}
                            className="number-select"
                        >
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={150}>150</option>
                        </select>
                    </label>

                    <button onClick={handlePrint} className="btn-primary">
                        <Printer size={18} style={{ marginRight: '0.5rem' }} />
                        Drucken
                    </button>
                </div>

                <p className="hint-text">
                    Jede Zahl wird 2x generiert (1x für den Tisch, 1x für das Geschenk).
                    Benutze die Druckfunktion deines Browsers (Strg+P / Cmd+P).
                </p>
            </div>

            <div className="print-area">
                <h1>Wichtel-Nummern (1-{maxNumber})</h1>
                <div className="numbers-grid">
                    {numbers.map((num) => (
                        <React.Fragment key={num}>
                            <div className="number-card table-card">
                                <span className="label">Tisch</span>
                                <span className="value">{num}</span>
                            </div>
                            <div className="number-card gift-card">
                                <span className="label">Geschenk</span>
                                <span className="value">{num}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrintableNumbers;
