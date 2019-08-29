import React from 'react';
import { Square } from './BlankSquare';

const WallSquare = (props) => {
  return (
    <Square className={`square`}>
      <svg viewBox="0 0 56 56">
        <rect x="6" y ="6" width="45" height="45" fill="#60412B" opacity="0.5" stroke="rgb(0,0,0)" strokeWidth="2" />
      </svg>
    </Square>
  );
};
export default WallSquare;
