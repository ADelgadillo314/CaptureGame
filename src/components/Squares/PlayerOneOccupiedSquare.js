import React from 'react';
import  {Square}  from './BlankSquare.js';

const PlayerOneOccupiedSquare = (props) => {
  return (
    <Square className={`square `}>
      <svg viewBox="0 0 56 56">
      <line x1="12" y1="10" x2="46" y2="46" stroke="#b37c57" strokeWidth="5" />
        <line x1="12" y1="46" x2="46" y2="10" stroke="#b37c57" strokeWidth="5" />
      </svg>
    </Square>
  );
};

export default PlayerOneOccupiedSquare;
