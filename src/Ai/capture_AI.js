const wall = 1;
const human_player = 2;
const ai_player = 3;
const RecursiveDepth = 2;


// Utility Functions

let printBoard = function (board) {
    console.log("------------------------------");
    console.log("");
    for (let i = 1; i < board.length - 1; i++) {
        var row = "";
        for (let j = 1; j < board[i].length - 1; j++) {
            row += board[i][j] + " ";

        }
        console.log(row);
    }
    console.log("");
    console.log("------------------------------");
}

let setSquare = function (board, row, col, val) {
    board[row][col] = val;
}

let movePlayer = function (board, row, col, player, player_row, player_col) {
    setSquare(board, row, col, player);
    setSquare(board, player_row, player_col, wall);
}

let makePosition = function (r, c) {
    return { row: r, col: c };
}

let copyBoard = function (board) {
    return JSON.parse(JSON.stringify(board));
}

let getBoardWithMovedPlayer = function (board, move, currentPosition, player) {
    var b = copyBoard(board);
    movePlayer(b, move.row, move.col, player, currentPosition.row, currentPosition.col);
    return b;
}

let findPlayerPos = function (board, player) {
    var position = {};
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === player) {
                position.row = i;
                position.col = j;
                return position;
            }
        }
    }
    return position;
}

function searchForArray(haystack, needle) {
    let i;
    for (i = 0; i < haystack.length; ++i) {
        if (haystack[i].row === needle.row && haystack[i].col === needle.col) {
            return true;
        }
    }
    return false;
}


// Helper Functions

let getAvailableMoves = function (board, player_row, player_col) {
    let movelist = [];

    //up
    let incr = player_row - 1;
    while (board[incr][player_col] !== 1) {
        movelist.push(makePosition(incr, player_col));
        if (board[incr][player_col] !== 0) {
            break;
        }
        incr--;
    }

    //down 
    incr = player_row + 1;
    while (board[incr][player_col] !== 1) {
        movelist.push(makePosition(incr, player_col));
        if (board[incr][player_col] !== 0) {
            break;
        }
        incr++;
    }

    //left
    incr = player_col - 1;
    while (board[player_row][incr] !== 1) {
        movelist.push(makePosition(player_row, incr));
        if (board[player_row][incr] !== 0) {
            break;
        }
        incr--;
    }

    //right
    incr = player_col + 1;
    while (board[player_row][incr] !== 1) {
        movelist.push(makePosition(player_row, incr));
        if (board[player_row][incr] !== 0) {
            break;
        }
        incr++;
    }

    //southwest
    incr = 1;
    while (board[player_row + incr][player_col - incr] !== 1) {
        movelist.push(makePosition(player_row + incr, player_col - incr));
        if (board[player_row + incr][player_col - incr] !== 0) {
            break;
        }
        incr++;

    }

    //southeast
    incr = 1;
    while (board[player_row + incr][player_col + incr] !== 1) {
        movelist.push(makePosition(player_row + incr, player_col + incr));
        if (board[player_row + incr][player_col + incr] !== 0) {
            break;
        }
        incr++;

    }

    //northwest
    incr = 1;
    while (board[player_row - incr][player_col - incr] !== 1) {
        movelist.push(makePosition(player_row - incr, player_col - incr));
        if (board[player_row - incr][player_col - incr] !== 0) {
            break;
        }
        incr++;

    }

    //northeast
    incr = 1;
    while (board[player_row - incr][player_col + incr] !== 1) {
        movelist.push(makePosition(player_row - incr, player_col + incr));
        if (board[player_row - incr][player_col + incr] !== 0) {
            break;
        }
        incr++;
    }

    return movelist;
}

//shows paths on grid of a player. 
let showPaths = function (board, player) {
    let s = JSON.parse(JSON.stringify(board));

    let possibleMoves = getAvailableMoves(s, player.row, player.col);
    for (let i = 0; i < possibleMoves.length; i++) {
        let r = possibleMoves[i].row;
        let c = possibleMoves[i].col;

        s[r][c] = '-';
    }

    printBoard(s);
}

function scoreGameState(state, player1Pos, player2Pos) {
    let numPlayer1Moves = getAvailableMoves(state, player1Pos.row, player1Pos.col).length;
    let numPlayer2Moves = getAvailableMoves(state, player2Pos.row, player2Pos.col).length;

    return numPlayer1Moves - numPlayer2Moves;

}

let hasPlayerWonByCapturing = function (board, prevBoard, player) {
    let enemy = player === ai_player ? human_player : ai_player;

    let playerPos = findPlayerPos(board, player);

    let enemyPosInPrevBoard = findPlayerPos(prevBoard, enemy);

    if (playerPos.row === enemyPosInPrevBoard.row && playerPos.col === enemyPosInPrevBoard.col) {
        return true;
    }
    return false;
}


// is the player in a position to be captured. i.e in line with opponent. 
let isPlayerInWinningState = function (board, player) {
    let playerPos = findPlayerPos(board, player);
    let playerMoves = getAvailableMoves(board, playerPos.row, playerPos.col);

    let enemy = player === ai_player ? human_player : ai_player;

    let enemyPos = findPlayerPos(board, enemy);

    return searchForArray(playerMoves, enemyPos);
}


let minimax = function (board, prevboard, player, depth) {
    if (hasPlayerWonByCapturing(board, prevboard, human_player)) {
        return -1000;
    }
    else if (hasPlayerWonByCapturing(board, prevboard, ai_player)) {
        return 1000;
    }

    var playerPos = findPlayerPos(board, player);
    var playerMoves = getAvailableMoves(board, playerPos.row, playerPos.col);

    if (playerMoves.length === 0) {
        return player === ai_player ? -1000 : 1000;
    }

    if (depth === 0) {
        if (isPlayerInWinningState(board, player) && player === ai_player) {
            return 1000;
        }
        else if (isPlayerInWinningState(board, player) && player === human_player) {
            return -1000;
        }

        var aiPos = findPlayerPos(board, ai_player);
        var humanPos = findPlayerPos(board, human_player);
        return scoreGameState(board, aiPos, humanPos);
    }

    //score the moves. 
    for (let i = 0; i < playerMoves.length; i++) {
        let move = playerMoves[i];
        if (player === ai_player) {
            let movedBoard = getBoardWithMovedPlayer(board, move, playerPos, ai_player);
            move.score = minimax(movedBoard, board, human_player, depth - 1);
        }
        else {
            let movedBoard = getBoardWithMovedPlayer(board, move, playerPos, human_player);
            move.score = minimax(movedBoard, board, ai_player, depth - 1);
        }

    }

    let bestMove = {};
    // return the best move; 
    if (player === ai_player) {
        let bestScore = -10000;
        for (let i = 0; i < playerMoves.length; i++) {
            let move = playerMoves[i];
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    else {
        let bestScore = 10000;
        for (let i = 0; i < playerMoves.length; i++) {
            let move = playerMoves[i];
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return depth === RecursiveDepth ? bestMove : bestMove.score;
}

let ExtendedMiniMax = function (brd, previousBrd, player) {
    let board = ConvertBoard(brd);
    let previousBoard = ConvertBoard(previousBrd);
    var move = minimax(board, previousBoard, player, RecursiveDepth);
    return {row: move.row -1 , col: move.col - 1};
}

let ConvertBoard = function (board) {
    console.log(board)
    let min = 0;
    let max = 6;
    let aiFormattedBoard = [];
    let border = [1, 1, 1, 1, 1, 1, 1, 1];
    aiFormattedBoard.push(border);

    for (let i = min; i < max; i++) {
        let newRow = [1];
        let row = board[i];
        for(let j = 0; j < 6; j++)
        {
            newRow.push(row[j]);
        }
        newRow.push(1);
        aiFormattedBoard.push(newRow);
    }
    aiFormattedBoard.push(border);

    return aiFormattedBoard;
}

module.exports = {
    ExtendedMinimax: ExtendedMiniMax,
    showPaths: showPaths
}
