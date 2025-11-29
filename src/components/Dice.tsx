import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './Dice.css';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRollComplete?: () => void;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRollComplete }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isRolling) {
      // Random rotation for rolling effect
      controls.start({
        rotateX: [0, 360 * 2, 720 + (Math.random() * 360)],
        rotateY: [0, 360 * 2, 720 + (Math.random() * 360)],
        transition: { duration: 0.8, ease: "easeInOut" }
      }).then(() => {
        // Snap to the correct face
        const rotations: Record<number, { rotateX: number; rotateY: number }> = {
          1: { rotateX: 0, rotateY: 0 },
          2: { rotateX: 0, rotateY: -90 },
          3: { rotateX: 0, rotateY: 180 },
          4: { rotateX: 0, rotateY: 90 },
          5: { rotateX: -90, rotateY: 0 },
          6: { rotateX: 90, rotateY: 0 },
        };
        
        const target = rotations[value];
        controls.start({
          rotateX: target.rotateX,
          rotateY: target.rotateY,
          transition: { duration: 0.3, ease: "easeOut" }
        }).then(() => {
          if (onRollComplete) onRollComplete();
        });
      });
    }
  }, [isRolling, value, controls, onRollComplete]);

  const renderFace = (dots: number[]) => (
    <div className="face-content">
      {dots.includes(1) && <div className="dot dot-tl" />}
      {dots.includes(2) && <div className="dot dot-tr" />}
      {dots.includes(3) && <div className="dot dot-ml" />}
      {dots.includes(4) && <div className="dot dot-center" />}
      {dots.includes(5) && <div className="dot dot-mr" />}
      {dots.includes(6) && <div className="dot dot-bl" />}
      {dots.includes(7) && <div className="dot dot-br" />}
    </div>
  );

  // Mapping logic for dots:
  // 1: center(4)
  // 2: tl(1), br(7)
  // 3: tl(1), center(4), br(7)
  // 4: tl(1), tr(2), bl(6), br(7)
  // 5: tl(1), tr(2), center(4), bl(6), br(7)
  // 6: tl(1), tr(2), ml(3), mr(5), bl(6), br(7) - Wait, standard dice 6 is 2 columns of 3
  
  // Correct standard dice dot positions:
  // 1: Center
  // 2: Top-Left, Bottom-Right
  // 3: Top-Left, Center, Bottom-Right
  // 4: Top-Left, Top-Right, Bottom-Left, Bottom-Right
  // 5: 4 + Center
  // 6: Top-Left, Top-Right, Mid-Left, Mid-Right, Bottom-Left, Bottom-Right

  return (
    <div className="scene">
      <motion.div className="cube" animate={controls} initial={{ rotateX: 0, rotateY: 0 }}>
        <div className="cube__face cube__face--1">{renderFace([4])}</div>
        <div className="cube__face cube__face--2">{renderFace([1, 7])}</div>
        <div className="cube__face cube__face--3">{renderFace([1, 4, 7])}</div>
        <div className="cube__face cube__face--4">{renderFace([1, 2, 6, 7])}</div>
        <div className="cube__face cube__face--5">{renderFace([1, 2, 4, 6, 7])}</div>
        <div className="cube__face cube__face--6">{renderFace([1, 2, 3, 5, 6, 7])}</div>
      </motion.div>
    </div>
  );
};

export default Dice;
