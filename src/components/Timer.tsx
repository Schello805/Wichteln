import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

const Timer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes default
    const [isActive, setIsActive] = useState(false);
    const [initialTime, setInitialTime] = useState(15 * 60);

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound or alert
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const adjustTime = (minutes: number) => {
        const newTime = minutes * 60;
        setInitialTime(newTime);
        setTimeLeft(newTime);
        setIsActive(false);
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                    <TimerIcon />
                    <span style={{ fontWeight: 600 }}>Spielzeit</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => adjustTime(10)}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                    >
                        10m
                    </button>
                    <button
                        onClick={() => adjustTime(15)}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                    >
                        15m
                    </button>
                    <button
                        onClick={() => adjustTime(20)}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                    >
                        20m
                    </button>
                </div>
            </div>

            <div style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                textAlign: 'center',
                fontVariantNumeric: 'tabular-nums',
                color: timeLeft < 60 ? 'var(--primary)' : 'var(--text-main)',
                textShadow: timeLeft < 60 ? '0 0 20px rgba(225, 29, 72, 0.5)' : 'none',
                marginBottom: '1.5rem'
            }}>
                {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={toggleTimer}
                    className="btn-primary"
                    style={{ width: '120px', justifyContent: 'center' }}
                >
                    {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
                </button>
                <button
                    onClick={resetTimer}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'var(--text-main)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
    );
};

export default Timer;
