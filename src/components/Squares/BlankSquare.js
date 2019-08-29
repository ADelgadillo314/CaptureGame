import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Square = styled.div`
  background-color: white;
  border: 1px solid black;
  height: 60px;
  margin: 1px;
  transition: background-color .5s ease;
  width: 60px;
`;

const BlankSquare = (props) => {
  return <Square onClick={() => !props.disabled ? props.movePlayer(props.turn): undefined}
  ></Square>;
};

BlankSquare.propTypes = {
  movePlayer: PropTypes.func.isRequired,
  turn: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default BlankSquare;