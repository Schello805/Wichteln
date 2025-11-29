import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface RuleCardProps {
    rule: string;
    number: number;
    isVisible: boolean;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, number, isVisible }) => {
    return (
        <div style={{ minHeight: '180px', position: 'relative', width: '100%' }}>
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key={number}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="glass-panel"
                        style={{
                            padding: '2rem',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '100%'
                        }}
                    >
                        <div style={{
                            background: 'var(--primary)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)'
                        }}>
                            {number}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                            {rule}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <Info size={16} />
                            <span>Aktion sofort ausführen!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RuleCard;
