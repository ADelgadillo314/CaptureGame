import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { movePlayerAction, autoSelectMove } from '../actions/actions';
import BlankSquare from './Squares/BlankSquare';
import PlayerOneOccupiedSquare from './Squares/PlayerOneOccupiedSquare';
import PlayerTwoOccupiedSquare from './Squares/PlayerTwoOccupiedSquare';
import WallSquare from './Squares/WallSquare';
import {SINGLE_PLAYER} from  '../GameMode/GameMode';
import { playerOne, playerTwo, wall } from '../players/players';

class Board extends Component {

    componentDidUpdate(){
        if(this.isDisabled())
        {
            setTimeout(() => {     
                this.props.autoSelectMove();
            }, 1000);
        }
    }

    getSquareStatus(row, col, status) {
        switch (status) {
            case playerOne:
                return <PlayerOneOccupiedSquare key={col} />;
            case playerTwo:
                return <PlayerTwoOccupiedSquare key={col} />;
            case wall:
                return <WallSquare key={col} />;
            default:
                return <BlankSquare key={col}
                    movePlayer={this.props.movePlayer.bind(this, row, col)}
                    turn={this.props.turn}
                    disabled={this.isDisabled()} />

        }
    }

    isDisabled()
    {
        return this.props.gameMode === SINGLE_PLAYER && this.props.turn === playerTwo;
    }

    render() {
        return <div className="captureGame" align="center">
            <div className="game">
                <div className="board" >
                    {
                        Object.keys(this.props.board)
                            .map(row => {
                                return (
                                    <div className={`row`} key={row} >
                                        {

                                            this.props.board[row].map((player, col) => {
                                                return this.getSquareStatus(row, col, player);
                                            })
                                        }
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </div>
    }

}

Board.propTypes = {
    // PROPS FROM STORE
    board: PropTypes.object.isRequired,
    turn: PropTypes.number.isRequired,
    won: PropTypes.number,
    previousState: PropTypes.object,

    // ACTIONS FOR DISPATCH
    movePlayer: PropTypes.func.isRequired,
    autoSelectMove: PropTypes.func.isRequired
};

export default connect(
    // Import props into this component from the store
    ({ board, turn, gameMode }) => ({
        board, turn, gameMode
    }),

    // Import Actions into Component
    (dispatch) => {
        return {
            movePlayer(row, col, player) {
                dispatch(movePlayerAction(row, col, player));
            },
            autoSelectMove() {
                dispatch(autoSelectMove())
            }
        };
    }
)(Board);

export { Board as PureBoard };