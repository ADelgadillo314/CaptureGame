import { wall, playerOne } from '../players/players';
const captureAI = require('../Ai/capture_AI');

let firstTierMoves = [{ row: 2, col: 2 }, { row: 2, col: 3 },
{ row: 3, col: 3 }, { row: 3, col: 2 }];

let topTierMoves = [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 3, col: 3 }, { row: 3, col: 2 },
                    { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
                    { row: 2, col: 1 }, { row: 2, col: 4 }, { row: 3, col: 1 }, { row: 3, col: 4 },
                    { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }]

export const Minimax = (board, previousBoard, player) => captureAI.ExtendedMinimax(board, previousBoard, player);

export const FirstTurnBestMove = (state) => {
    if (state.turn === playerOne) {
        let move = firstTierMoves[Math.floor(Math.random() * firstTierMoves.length)];
        
        return {row: move.row, col: move.col};
    }
    else {
        while (true) {
            let move = topTierMoves[Math.floor(Math.random() * topTierMoves.length)];
            if(move.row === state.playerOnePosition.row && move.col === state.playerOnePosition.col)
            {
                continue;
            }
            else if(goodSecondPlayerMove(state.board, move, state.playerOnePosition))
            {
                continue;
            }
            else{
                return {row: move.row, col: move.col};
            }
        }
    }
}

export const movePlayer = (board, player, currentRow, currentCol, newRow, newCol) => {
    board[currentRow][currentCol] = wall;
    board[newRow][newCol] = player;
}

export const setPlayer = (board, player, newRow, newCol) => {
    board[newRow][newCol] = player;
}

export const isLegalMove = function (board, player, move) {
    if (player.row === 0 || player.col === 0) {
        return true;
    }
    var moves = getAvailableMoves(board, player.row, player.col);
    return searchForArray(moves, move)
}

export const hasPlayerWithTurnWonByKill = function (board, playerWithTurn, playerOnePosition, playerTwoPosition) {
    let playerOneMoves = getAvailableMoves(board, playerOnePosition.row, playerOnePosition.col);
    let playerTwoMoves = getAvailableMoves(board, playerTwoPosition.row, playerTwoPosition.col);
    return playerWithTurn === playerOne ? searchForArray(playerOneMoves, playerTwoPosition) : searchForArray(playerTwoMoves, playerOnePosition);
}

export const hasPlayerWithTurnLostByNoMoves = function (board, playerPosition) {
    return getAvailableMoves(board, playerPosition.row, playerPosition.col).length === 0;
}

let makePosition = function (r, c) {
    return { row: r, col: c };
}

function searchForArray(haystack, needle) {
    let i;
    for (i = 0; i < haystack.length; ++i) {
        if (haystack[i].row == needle.row && haystack[i].col == needle.col) {
            return true;
        }
    }
    return false;
}

let getAvailableMoves = function (board, player_row, player_col) {
    let movelist = [];
    let min = 0;
    let max = 6;
    //up
    let incr = player_row - 1;
    while (incr >= min) {
        let square = board[incr][player_col];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(incr, player_col));
            }
            break;
        }
        else {
            movelist.push(makePosition(incr, player_col));
            incr--;
        }
    }

    //down 
    incr = player_row + 1;
    while (incr < max) {
        let square = board[incr][player_col];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(incr, player_col));
            }
            break;
        }
        else {
            movelist.push(makePosition(incr, player_col));
            incr++;
        }

    }

    //left
    incr = player_col - 1;
    while (incr >= min) {
        let square = board[player_row][incr];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(player_row, incr));
            }
            break;
        }
        else {
            movelist.push(makePosition(player_row, incr));
            incr--;
        }

    }

    //right
    incr = player_col + 1;
    while (incr < max) {
        let square = board[player_row][incr];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(player_row, incr));
            }
            break;
        }
        else {
            movelist.push(makePosition(player_row, incr));
            incr++;
        }
    }

    //southwest
    incr = 1;
    while (player_row + incr < max && player_col - incr >= min) {
        let square = board[player_row + incr][player_col - incr];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(player_row + incr, player_col - incr));
            }
            break;
        }
        else {
            movelist.push(makePosition(player_row + incr, player_col - incr));
            incr++;
        }

    }

    //southeast
    incr = 1;

    while (player_row + incr < max && player_col + incr < max) {
        let square = board[player_row + incr][player_col + incr];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(player_row + incr, player_col + incr));
            }
            break;
        }
        else {
            movelist.push(makePosition(player_row + incr, player_col + incr));
            incr++;
        }

    }

    //northwest
    incr = 1;

    while (player_row - incr >= min && player_col - incr >= min) {
        let square = board[player_row - incr][player_col - incr];

        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(player_row - incr, player_col - incr));
            }
            break;
        }
        else {
            movelist.push(makePosition(player_row - incr, player_col - incr));
            incr++;
        }
    }

    //northeast
    incr = 1;
    while (player_row - incr >= min && player_col + incr < max) {
        let square = board[player_row - incr][player_col + incr];
        if (square !== 0) {
            // if square is the enemy
            if (square !== 1) {
                movelist.push(makePosition(player_row - incr, player_col + incr));
            }
            break;
        }
        else {
            movelist.push(makePosition(player_row - incr, player_col + incr));
            incr++;
        }
    }

    return movelist;
}

let goodSecondPlayerMove = function (board, move, playerOnePosition)
{
    let moves = getAvailableMoves(board, move.row, move.col);
    moves.push(move);
    return searchForArray(moves, playerOnePosition);
}
