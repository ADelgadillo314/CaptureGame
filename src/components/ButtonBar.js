import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startNewGameAction, undoLastMove, autoSelectMove } from '../actions/actions';
import {SINGLE_PLAYER} from  '../GameMode/GameMode';
import { playerTwo } from '../players/players';

class ButtonBar extends Component 
{
    isDisabled()
    {
        return this.props.gameMode === SINGLE_PLAYER && this.props.turn === playerTwo;
    }

    render() {
        return  <div className="buttonBar">
                {
                    !this.props.won ?
                        <button onClick={this.props.autoSelectMove} 
                        disabled={this.isDisabled()}>
                            Auto Select Move
                        </button> : false

                }
                {
                    this.props.won ?
                        <button onClick={this.props.startAgain}>
                            Click to start again!
                        </button> :
                        <button onClick={this.props.startAgain} 
                            disabled={this.isDisabled()}>
                            Restart Game
                        </button>

                }
                {
                    this.props.previousState ?
                        <button className="startAgain" onClick={this.props.undoLastMove} 
                                disabled={this.isDisabled()} >
                            Undo Last Move
                        </button> : false
                }
            </div>
    }

}

ButtonBar.propTypes = {
    // PROPS FROM STORE
    won: PropTypes.number,
    previousState: PropTypes.object,

    // ACTIONS FOR DISPATCH
    startAgain: PropTypes.func.isRequired,
    undoLastMove: PropTypes.func.isRequired,
    autoSelectMove: PropTypes.func.isRequired
};

export default connect(
    // Import props into this component from the store
    ({ won, previousState, gameMode }) => ({
        won, previousState, gameMode
    }),

    // Import Actions into Component
    (dispatch) => {
        return {
            startAgain() {
                dispatch(startNewGameAction());
            },
            undoLastMove() {
                dispatch(undoLastMove());
            },
            autoSelectMove() {
                dispatch(autoSelectMove())
            }
        };
    }
)(ButtonBar);

export { ButtonBar as PureButtonBar };