import { playerOne, playerTwo } from '../players/players';
import {SINGLE_PLAYER, TWO_PLAYER} from  '../GameMode/GameMode';
import * as _ from 'lodash';
import { MOVE_PLAYER, START_NEW_GAME, UNDO_LAST_MOVE, AUTO_SELECT_MOVE, SWITCH_GAME_MODE } from '../actions/actionTypes';
const gameLogic = require('../GameLogic/GameLogic');


export const initialState = {
    board: {
        0: [0, 0, 0, 0, 0, 0],
        1: [0, 0, 0, 0, 0, 0],
        2: [0, 0, 0, 0, 0, 0],
        3: [0, 0, 0, 0, 0, 0],
        4: [0, 0, 0, 0, 0, 0],
        5: [0, 0, 0, 0, 0, 0],
    },

    turn: playerOne,
    won: undefined,
    playerOnePosition: undefined,
    playerTwoPosition: undefined,
    previousState: undefined,

    playerOneScore: 0,
    playerTwoScore: 0,
    gameMode: SINGLE_PLAYER
};

export const captureReducer = (state, action) => {
    switch (action.type) {
        case MOVE_PLAYER:
            if (state.won !== undefined) {
                return state;
            }
            const newState = _.cloneDeep(state);

            // find the previous position of the player
            const playerPos = action.player === playerOne ? state.playerOnePosition : state.playerTwoPosition;

            if (playerPos === undefined) {
                gameLogic.setPlayer(newState.board, action.player, action.row, action.col);

                // set Previous positions
                    newState.playerOnePosition = action.player === playerOne ? { row: parseInt(action.row), col: action.col } : newState.playerOnePosition;
                    newState.playerTwoPosition = action.player === playerTwo ? { row: parseInt(action.row), col: action.col } : newState.playerTwoPosition;
                // if PlayerOne is already set
                if (newState.playerOnePosition !== undefined && newState.playerTwoPosition !== undefined) {
                    // and player two made a bad move.
                    if (gameLogic.hasPlayerWithTurnWonByKill(newState.board, playerOne, newState.playerOnePosition, newState.playerTwoPosition)) {
                        newState.won = newState.turn;
                    }
                }

                //Change player Turn
                newState.turn = newState.turn === playerOne ? playerTwo : playerOne;
            }
            else {
                if (gameLogic.isLegalMove(newState.board, playerPos, action)) {

                    gameLogic.movePlayer(newState.board, action.player, playerPos.row, playerPos.col, action.row, action.col);

                    // set Previous positions
                        newState.playerOnePosition = action.player === playerOne ? { row: parseInt(action.row), col: action.col } : newState.playerOnePosition;
                        newState.playerTwoPosition = action.player === playerTwo ? { row: parseInt(action.row), col: action.col } : newState.playerTwoPosition;
                    //Change player Turn
                    newState.turn = newState.turn === playerOne ? playerTwo : playerOne;

                    // Check if Player With Turn Ends Game
                    if (gameLogic.hasPlayerWithTurnWonByKill(newState.board, newState.turn, newState.playerOnePosition, newState.playerTwoPosition)) {
                        newState.won = newState.turn;
                    }

                    let playerPosition = newState.turn === playerOne ? newState.playerOnePosition : newState.playerTwoPosition;
                    if (gameLogic.hasPlayerWithTurnLostByNoMoves(newState.board, playerPosition))
                    {
                        newState.won = newState.turn === playerOne ? playerTwo : playerOne;
                    }
                }
                else{
                    return state;
                }
            }

            if(newState.won === playerOne)
            {
                newState.playerOneScore++;
            }
            else if(newState.won === playerTwo) 
            {
                newState.playerTwoScore++;
            }

            newState.previousState = state;

            return newState;

        case AUTO_SELECT_MOVE:
            let newAction = {};
            let bestMove = {};
            let previous = state.previousState === undefined ? state.board : state.previousState.board;

            // User Wants first move auto selected.
            if (state.playerTwoPosition === undefined) {
                bestMove = gameLogic.FirstTurnBestMove(state);
            }
            else {
                bestMove = gameLogic.Minimax(state.board, previous, state.turn);
            }

            newAction = { type: MOVE_PLAYER, player: state.turn, row: bestMove.row, col: bestMove.col};
            return captureReducer(state, newAction);

        case SWITCH_GAME_MODE:
            const resetState = _.cloneDeep(initialState);
            resetState.gameMode = state.gameMode === SINGLE_PLAYER ? TWO_PLAYER : SINGLE_PLAYER;
            return resetState;
        case START_NEW_GAME:
            const newGameState = _.cloneDeep(initialState);
            newGameState.playerOneScore = state.playerOneScore;
            newGameState.playerTwoScore = state.playerTwoScore;
            newGameState.gameMode = state.gameMode;
            return newGameState;
        case UNDO_LAST_MOVE:
            if(state.gameMode === SINGLE_PLAYER && state.turn === playerOne)
            {
                return state.previousState.previousState;
            }
            return state.previousState;
        default:
            return state;

    }

}