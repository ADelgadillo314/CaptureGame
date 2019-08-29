import { MOVE_PLAYER, START_NEW_GAME, UNDO_LAST_MOVE, AUTO_SELECT_MOVE, SWITCH_GAME_MODE } from './actionTypes';

export const movePlayerAction = (row, col, player) => ({
    type: MOVE_PLAYER,
    player: player,
    row: row,
    col: col
});

export const startNewGameAction = () => ({
    type: START_NEW_GAME
})

export const undoLastMove = () => ({
    type: UNDO_LAST_MOVE
})

export const autoSelectMove = () => ({
    type: AUTO_SELECT_MOVE
})

export const switchGameMode = () => ({
    type: SWITCH_GAME_MODE
})