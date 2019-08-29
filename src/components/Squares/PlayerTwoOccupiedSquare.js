import React from 'react';
import {Square} from './BlankSquare';

const PlayerTwoOccupiedSquare = (props) => {
  return (
    <Square className={`square `}>
      <svg viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={20} stroke="black" strokeWidth="2" fill="#9aacb8" />
      </svg>
    </Square>
  );
};

export default PlayerTwoOccupiedSquare;
